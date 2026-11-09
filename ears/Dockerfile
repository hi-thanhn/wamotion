# Wamotion ears API: earshot at the pinned commit, CPU torch, models downloaded into the /data volume on first start.
# Builds for linux/arm64 (ARM cloud boxes, Apple-silicon Docker Desktop) and linux/amd64 alike.
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 PIP_DISABLE_PIP_VERSION_CHECK=1 PIP_NO_CACHE_DIR=1 \
    WAMOTION_EARS_DATA=/data EARSHOT_HOME=/data/earshot PORT=8000

RUN apt-get update \
 && apt-get install -y --no-install-recommends git ca-certificates curl xz-utils \
 && rm -rf /var/lib/apt/lists/* \
 && useradd --create-home --uid 10001 ears

# ffmpeg 9 as a static build, not Debian's 7.1: earshot's cut detector (video.frame_diff) compares 96x54 grey frames that
# ffmpeg decodes, and ffmpeg 8 rewrote swscale, so 7.1 and 9 give frame differences ~15 % apart and a borderline cut flips
# (launch-film.mp4: 2 cuts under 7.1, 3 under 9 — and under 3 cuts earshot leaves the four cut-sync metrics unscored).
# Homebrew ships 9.0.x, so the API measures what a local install measures. Pinned by sha256.
ARG TARGETARCH
ARG FFMPEG_BUILD=autobuild-2026-11-05-12-48
ARG FFMPEG_VER=n9.0.2-47-gb204e94e90
RUN set -eux; \
    case "$TARGETARCH" in \
      arm64) FF=linuxarm64; SHA=070c25a302f7ae3b448a059e335b5208f3442ccf82dc3d3cd3e5215de878f801 ;; \
      amd64) FF=linux64;    SHA=7b4067286ca84450a4049a9d9387e50b306b985e2771b166eb6038035ebc514e ;; \
      *) echo "no ffmpeg build for $TARGETARCH"; exit 1 ;; \
    esac; \
    F="ffmpeg-${FFMPEG_VER}-${FF}-gpl-9.0.tar.xz"; \
    curl -fsSL -o /tmp/ff.tar.xz "https://github.com/BtbN/FFmpeg-Builds/releases/download/${FFMPEG_BUILD}/${F}"; \
    echo "${SHA}  /tmp/ff.tar.xz" | sha256sum -c -; \
    tar -xJf /tmp/ff.tar.xz -C /tmp; \
    install -m 0755 /tmp/ffmpeg-*/bin/ffmpeg /tmp/ffmpeg-*/bin/ffprobe /usr/local/bin/; \
    rm -rf /tmp/ff.tar.xz /tmp/ffmpeg-*; \
    ffmpeg -version | head -1

WORKDIR /app

# torch first from the CPU index (the PyPI wheel on amd64 pulls CUDA); then earshot at the commit the wamotion skill pins.
ARG EARSHOT_COMMIT=591fa3e028032e6dce56620a20e932e35667e8d8
RUN pip install torch --index-url https://download.pytorch.org/whl/cpu \
 && pip install "earshot @ git+https://github.com/Leonxlnx/earshot@${EARSHOT_COMMIT}"

COPY pyproject.toml README.md ./
COPY wamotion_ears ./wamotion_ears
RUN pip install .

RUN mkdir -p /data && chown ears:ears /data
VOLUME ["/data"]
USER ears
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=120s \
  CMD python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://127.0.0.1:8000/v1/health', timeout=4).status == 200 else 1)"

CMD ["python", "-m", "wamotion_ears"]
