# A/B 2026-11-06 — quán trà Hẻm 12, 30 s: tự làm trần · + skill có tai · + skill không tai

**Bản 1 = tự làm + skill, KHÔNG tai (N) · Bản 2 = tự làm trần (C) · Bản 3 = tự làm + skill, có tai (K).**

Đề KHÁC hai cặp trước (showreel Wamotion 15 s): quảng cáo Facebook 30 s cho quán trà chiều
Hẻm 12 (brief thật của `2026-11-04-ab-mot-mach`: 3 mustHave · 3 avoid · 3 facts, viết thẳng vào
câu nhờ `prompt.txt`). Cùng câu nhờ nguyên văn, cùng bài "A Cup of Tea" (kho, CC0) đặt sẵn ở
`music/`, không gợi ý gì về tiếng; cùng Opus 5.5 effort medium, `claude -p`, không app, không
sidecar; ba bản chạy song song từ ba thư mục rỗng (`~/AB-solo/hem12-*`). Skill đưa vào hai bản
K và N dưới dạng **skill cấp project** (`.claude/skills/wamotion` → `skill/wamotion`), symlink
cấp user gỡ trong lúc chạy để bản C không nhìn thấy skill. Bản N khác K đúng một biến:
`WAMOTION_EARSHOT_DIR=/nonexistent` nên `hear.sh` chỉ in một dòng "chưa cài". Ba bản cân
loudnorm I=−16, trộn ngẫu nhiên, chủ dự án chấm mù trên trang có nút (`votes.jsonl`, `key.json`).

## Kết quả — skill có tai thắng 5/5 cả hai bản còn lại

| Mục | Thắng |
|---|---|
| Design | **K (skill, tai)** |
| Ít AI slop | **K** |
| Chất lượng tiếng | **K** |
| Tiếng khớp chuyển động | **K** |
| Tổng thể | **K** |

| | C trần | K skill + tai | N skill, không tai |
|---|---|---|---|
| Thời gian | 23' · 31 lượt | 30' · 31 lượt | 27' · 42 lượt |
| Chi phí | 3,79 USD | 5,35 USD | 4,69 USD |
| Tiếng kho | 0 (tự tổng hợp) | 22 file | 22 file |
| Đo nhịp | — | 70 BPM, cắt theo lưới | có |
| Tai | — | **3 lần**: launch-grade 22/23 → "needs work" (−18,4 LUFS sau khi sửa mix) → viết `scripts/master.sh` → 23/23, −13,7 LUFS | 0 |
| Soát subagent sạch | 0 | 1 | 1 |

Tai đã làm gì cho K, đọc từ `temp/ab-hem12/run-K.jsonl`: lần 1 chỉ ra 1/11 sự kiện hình không
có tiếng ở 0:19,6 và gợi một "stop-down" trước cú hit lớn 0:23; agent sửa mix, gọi lại, tai báo
tổng thể tụt xuống −18,4 LUFS (critical) → agent thêm bước master có limiter → 23/23. Cân
loudnorm trước khi chấm đã xoá khác biệt mức tổng, nên cái còn lại để chấm là **vị trí và
chất tiếng** — và K vẫn thắng N ở "Chất lượng tiếng" lẫn "Tiếng khớp chuyển động".

## Hai câu hỏi đã trả lời

1. **Cửa ship plan/71 §71.7 (cặp mù thứ hai trên đề khác): ĐẠT.** Skill thắng tự làm trần lần
   hai, trên đề khác hẳn (quảng cáo có hợp đồng, không phải showreel). Hai cặp, hai đề, 10/10.
2. **Tai có đáng tiền không:** lần đầu tai thắng chấm mù (hai cặp 2026-11-02 trong app thì
   thua). Khác biệt so với 11-02: tai không bị ép qua `next`, agent tự gọi khi nó thấy cần và
   tự quyết sửa gì. Một cặp, chưa lặp, và chưa đo độ lệch giữa hai lần chạy cùng cấu hình — đủ
   để **mua máy chạy thử 5 tháng × 20 USD** (chủ dự án đặt mức này), chưa đủ để đặt giá.

## Lưu ý phương pháp

- N kết lượt bằng câu "render vẫn đang chạy" nhưng `out/hem12.mp4` đã ghi xong 09:39:14 (trước
  khi tiến trình thoát), 30,016 s, −16,5 LUFS theo chính nó đo — bản chấm là bản cuối.
- Skill cấp project hoạt động y như cấp user: cả K và N gọi `Skill wamotion` ngay lượt đầu.
- Đây là cặp thứ ba có cùng kết luận "vật liệu thắng, khung không": skill không có một luật nào
  về phim (`dont-over-constrain.md`).
