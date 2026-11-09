# A/B 2026-11-05 — tự làm trần vs tự làm + skill `wamotion`

**Bản 1 = agent tự làm + skill `wamotion` (K) · Bản 2 = agent tự làm trần (C).**
Cùng câu nhờ (`prompt.txt`, 15 giây, không gợi ý gì về tiếng), cùng bài nhạc
Volex đặt sẵn trong `music/`, cùng Opus 5.5 effort medium, `claude -p`, không app,
không sidecar. Bản C là bản đã dùng ở `2026-11-05-ab-r15-tu-chu/` (chạy trước khi
skill tồn tại, nên chắc chắn không thấy nó). Hai bản cân loudnorm I=−16, trộn
ngẫu nhiên, chủ dự án chấm mù trên trang có nút (`votes.jsonl`, `key.json`).

## Kết quả — skill thắng 5/5

| Mục | Thắng |
|---|---|
| Design | **K (skill)** |
| Ít AI slop | **K (skill)** |
| Chất lượng tiếng | **K (skill)** |
| Tiếng khớp chuyển động | **K (skill)** |
| Tổng thể | **K (skill)** |

Chi phí: K 6,21 USD · 32 phút (49 lượt) — C 7,07 USD.

## Skill là gì (spike, `skill/wamotion/`, symlink `~/.claude/skills/wamotion`)

Chỉ vật liệu và công cụ, không một luật nào về phim (SKILL.md 395 chữ, soát
bằng `dont-over-constrain.md`): kho 341 SFX + 14 nhạc CC0/MIT offline với
`scripts/sound.mjs search|get|music|credits` (khớp từ, không CLAP), `scripts/tempo.mjs`
(port thuật toán plan/70 ④), `scripts/hear.sh` (earshot nếu đã cài, không thì một
dòng), `references/review.md` (một vòng soát subagent sạch trên frame thật: sáu tell +
R1/R6/R7/R9 + hợp đồng), bốn skill vendor làm tài liệu tra.

## Agent có skill đã dùng gì (đọc từ `run-K.jsonl` ở temp/, không phải lời nó kể)

- Gọi `Skill wamotion` ngay lượt đầu; đọc SKILL.md, bank.md, motion-prompt.
- `sound.mjs get` sáu tiếng kho (typing-key-clicky, key-thock, cut-hit-kick,
  cut-hit-punch, impact-deep…), đặt theo `peakLagSec`.
- `tempo.mjs` → 132,06 BPM; cắt theo lưới đó, cắt lại nhạc để drop rơi đúng chỗ.
- `hear.sh` → 23/23 chỉ số trong ngưỡng, −13,6 LUFS.
- Một subagent soát sạch (Agent ×1): bắt lỗi thật — dấu nháy làm tên đọc thành
  "AII" — và được sửa. Không vòng hai.
- Phần còn lại vẫn của nó: WebGL engine riêng, 24 sub-frame motion blur, 620.000
  hạt, 60 fps, 10 file — skill không kéo về khuôn.

## Điều rút ra

- Lần đầu một bản "qua Wamotion" thắng tự làm trần **với câu nhờ giống hệt**, và
  thắng ở đúng bốn mục chủ dự án đặt làm mục tiêu app (design · ít slop · tiếng ·
  khớp). Thứ thắng là **vật liệu** (kho tiếng, đo nhịp, tai, vòng soát) — không có
  app, không có sidecar, không có màn nào.
- Hướng (chủ dự án, 20:30 hôm nay): publish skill trước, app lên kệ cho đến khi có
  người không chạy terminal đòi; editor nếu cần là `wamotion studio` trên localhost
  (bản web sẵn có), không Tauri.
- Một cặp, chưa lặp. Chỗ thô của spike còn ở README của skill (tìm tiếng bằng
  từ, hear chưa cân −14 LUFS, reference còn nhắc lệnh `wamotion …`).
