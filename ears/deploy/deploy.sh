#!/usr/bin/env bash
# Put the ears API on one machine over SSH.
#   deploy/deploy.sh <user@host> [remote dir]
# Needs: ssh access as root (or sudo) to a box with Docker, and a DNS A record for EARS_DOMAIN pointing at the host
# (or an <ip>.sslip.io name, which needs no DNS of your own). Writes deploy/.env on first run (one static token), waits
# for Docker, copies this folder, builds the image there (torch CPU, 5–10 min on an 8-core ARM box) and starts
# ears + caddy. WAMOTION_EARS_SSH_KEY=<private key> picks the key. The models (~1.1 GB) download into the volume on
# first start; watch with
#   ssh <user@host> docker compose -f <remote dir>/deploy/compose.yaml logs -f ears
set -euo pipefail

HERE="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${1:?usage: deploy.sh <user@host> [remote dir]}"
REMOTE_DIR="${2:-wamotion-ears}"
SSH=(ssh -o StrictHostKeyChecking=accept-new ${WAMOTION_EARS_SSH_KEY:+-i "$WAMOTION_EARS_SSH_KEY"})

# First run: write deploy/.env from the example — EARS_DOMAIN from the environment, one static token.
if [[ ! -f "$HERE/deploy/.env" ]]; then
  domain="${EARS_DOMAIN:-}"
  if [[ -z "$domain" ]]; then
    ip="${HOST#*@}"
    [[ "$ip" =~ ^[0-9.]+$ ]] && domain="$(echo "$ip" | tr . -).sslip.io"
  fi
  [[ -n "$domain" ]] || { echo "deploy/.env is missing — copy deploy/.env.example and fill it in (or set EARS_DOMAIN)"; exit 1; }
  token="$(openssl rand -hex 24)"
  sed -e "s|^EARS_DOMAIN=.*|EARS_DOMAIN=$domain|" -e "s|^WAMOTION_WEB_URL=.*|WAMOTION_WEB_URL=${WAMOTION_WEB_URL:-}|" \
      -e "s|^WAMOTION_EARS_TOKENS=.*|WAMOTION_EARS_TOKENS=owner:$token|" "$HERE/deploy/.env.example" > "$HERE/deploy/.env"
  echo "wrote deploy/.env: EARS_DOMAIN=$domain, one static token (owner) — see the file; it is git-ignored"
fi

"${SSH[@]}" "$HOST" 'until command -v docker >/dev/null; do echo "waiting for docker…"; sleep 10; done'
rsync -az --delete -e "${SSH[*]}" --exclude .venv --exclude data --exclude __pycache__ --exclude .pytest_cache "$HERE/" "$HOST:$REMOTE_DIR/"
"${SSH[@]}" "$HOST" "cd $REMOTE_DIR/deploy && docker compose build && docker compose up -d && docker compose ps"
echo "started. Health: curl -s https://$(grep ^EARS_DOMAIN "$HERE/deploy/.env" | cut -d= -f2)/v1/health"
