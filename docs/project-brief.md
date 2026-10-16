# Project Brief - Cổng thông tin R.E.S.D

## Mục tiêu
Cổng thông tin tĩnh giới thiệu chương trình R.E.S.D của Đoàn - Hội khoa Công nghệ thông tin kinh doanh, UEH: ý tưởng chương trình, 4 ban chuyên môn, 7 mảng trực thuộc và 8 lựa chọn chuyên môn, bài kiểm tra định hướng cá nhân, và đường dẫn tới form đăng ký cùng booklet. Ban Phong trào - Tình nguyện là một ban thống nhất, không chia thành hai mảng PT/TN.

Trang phục vụ mục 3.2 của kế hoạch: "Giới thiệu Website Đoàn - Hội khoa và Trải nghiệm bài kiểm tra định hướng", dự kiến 23/09/2026, công bố trực tuyến trên Fanpage.

aaaa
## Định vị
Đây **không phải** website của Đoàn - Hội khoa. Đoàn - Hội khoa đã có kênh riêng là Fanpage. Cổng này chỉ phục vụ một chương trình cụ thể là R.E.S.D, nên nội dung phải tránh trùng lặp: không đăng tin tức hoạt động thường kỳ, không đăng thông báo chung của khoa, không đóng vai trang chủ của Đoàn - Hội.

Trọng tâm của cổng: giúp sinh viên **tự soi mình** trước khi ứng tuyển, hiểu mỗi ban và mỗi mảng làm gì, rồi đăng ký với lựa chọn có cơ sở. Trang chủ vì vậy là điểm điều phối chứ không phải trang tin.

Sự khác biệt với web khoa nên **tự nhiên hiện ra qua nội dung** (một chương trình cụ thể, đi thẳng vào lộ trình định hướng - đăng ký, không có bản tin hay thư viện ảnh) thay vì có hẳn một khối riêng đối chiếu "cổng này khác gì trang Đoàn - Hội khoa". Một khối so sánh lộ liễu như vậy dễ đọc như đang tự vệ hoặc ngầm phân biệt hai kênh, nên đã được bỏ khỏi trang chủ.

## Phạm vi kỹ thuật
Website tĩnh: HTML5, Bootstrap 5 qua CDN, CSS và JavaScript thuần. Không backend, không database, không đăng nhập, không bước build bắt buộc. Mở `index.html` là chạy.

Iframe và Google Form **được phép** (xem mục Thay đổi quyết định). `fetch()` cũng được phép, dùng đúng một việc: tự đọc hai file CSV câu hỏi / hồ sơ mảng từ `assets/data/` (xem mục Bài kiểm tra định hướng).

## Cấu trúc trang (15 trang)

```
index.html                             Trang chủ cổng thông tin
gioi-thieu.html                        Ý tưởng, giá trị nhận được, bảng so sánh 4 ban
ban-to-chuc-xay-dung.html              Sapphire · TC-XD (tổng quan, dẫn sang 3 mảng)
  ban-to-chuc-xay-dung-ns.html           Mảng Nhân sự
  ban-to-chuc-xay-dung-dn.html           Mảng Đối ngoại
  ban-to-chuc-xay-dung-kt.html           Mảng Kỹ thuật
ban-phong-trao-tinh-nguyen.html        Diamond · PT-TN (ban thống nhất, không chia mảng)
ban-truyen-thong.html                  Ruby · TT (tổng quan, dẫn sang 2 mảng)
  ban-truyen-thong-content.html          Mảng IDEA (Nội dung)
  ban-truyen-thong-dep.html              Mảng Thiết kế - Hình ảnh (DEP)
ban-hoc-tap-nckh.html                  Emerald · HT-NCKH (tổng quan, dẫn sang 2 mảng)
  ban-hoc-tap-nckh-ht.html                Mảng Học tập
  ban-hoc-tap-nckh-nckh.html              Mảng Nghiên cứu khoa học
test-dinh-huong.html                   Bài kiểm tra định hướng + form nhúng
lien-he.html                           Kênh liên hệ + FAQ
```

Mỗi trang ban bắt buộc có sứ mệnh và nhiệm vụ tổng quát. Ba ban có mảng thêm thẻ dẫn sang từng trang mảng; riêng PT-TN trình bày trực tiếp nội dung toàn ban. Mỗi trang mảng có đủ 5 khối: **sứ mệnh/lời dẫn, nhiệm vụ, chương trình nổi bật, lời nhắn nhủ của thành viên, yêu cầu - kỹ năng**, cộng thêm khu nhân sự.

Trước đây mảng từng là section/anchor bên trong trang ban (`#ns`, `#dn`...). Bản hiện tại đã tách bảy mảng thực tế thành trang riêng có URL độc lập (ví dụ TC-XD có 3 mảng → 1 trang tổng quan + 3 trang mảng = 4 trang), vì nội dung mỗi mảng đủ dài để đứng thành trang riêng và để liên kết chia sẻ trỏ thẳng đúng mảng. PT-TN không có trang con vì không chia mảng. Menu cấp 3 trên navbar chỉ hiện cho ba ban có mảng.

## Bài kiểm tra định hướng
Mô hình 4 trục kiểu MBTI, 24 câu Likert 5 mức, cho ra mã 4 chữ và 1 trong 16 nhóm, kèm xếp hạng độ tương đồng tham khảo với 8 lựa chọn chuyên môn (7 mảng + Ban PT-TN) và 4 ban. Kết quả render được thành ảnh 1080×1350 để chia sẻ, và tải được dưới dạng **file CSV** (đầy đủ câu hỏi, câu trả lời, độ tương đồng tham khảo từng ban/mảng — định dạng kiểu "phiếu điểm" MBTI/DISC, mở được bằng Excel).

**Bộ câu hỏi và hồ sơ % của 8 lựa chọn nằm trong hai file CSV** ở `assets/data/`:
- `cau-hoi-mau.csv` — 24 câu, cột `ma_cau, truc, huong, noi_dung_cau_hoi`.
- `ho-so-mang-mau.csv` — 8 dòng (một dòng một lựa chọn), cột % theo 4 trục.

Trang tự `fetch()` hai file này khi tải trang test. Nếu đọc được và hợp lệ thì dùng ngay; nếu không (lỗi mạng, mở qua `file://`, chưa có file, sai định dạng) thì lặng lẽ dùng bộ mặc định đã nhúng sẵn trong `js/test-dinh-huong.js` — người làm bài không thấy bất kỳ thông báo lỗi hay công cụ nạp file nào. **Ban chuyên môn cập nhật bộ câu hỏi/hồ sơ mảng bằng cách sửa thẳng hai file CSV này trên host**, không qua giao diện web công khai (xem `docs/content-guide.md`).

**Giới hạn phải nói rõ với người dùng**: đây là công cụ gợi mở để chọn ban, **không phải công cụ tâm lý đã kiểm định**, và **không ảnh hưởng tới kết quả xét tuyển**. Hai điều này đã ghi trong FAQ ở `lien-he.html` và trên chính trang test.

## Nhận diện
Chủ đề không gian: nền tối xanh, sao, quỹ đạo, tên lửa và bốn viên đá quý ứng với bốn ban. Trong nội dung hiển thị, bốn ban chỉ được gọi là **bốn viên đá**, không gọi là hành tinh.

| Ban | Đá quý | Màu |
| --- | --- | --- |
| Tổ chức - Xây dựng | Sapphire | `#6fa8ff` |
| Phong trào - Tình nguyện | Diamond | `#b9f6ff` |
| Truyền thông | Ruby | `#ff799b` |
| Học tập - NCKH | Emerald | `#6ce8ae` |

Font: Be Vietnam Pro cho nội dung tiếng Việt, Space Grotesk cho số và mã latin.

Chương trình nổi bật của mỗi ban/mảng hiển thị dạng khung ảnh khổ dọc, tên chương trình luôn hiện; di chuột/focus mới lộ mô tả. Chưa có ảnh thật nên khung đang hiện chữ cái đầu kèm nhãn "Ảnh minh hoạ · chờ cập nhật" — thay bằng ảnh thật khi có, qua `assets/images/`.

Responsive ưu tiên mobile. Tôn trọng `prefers-reduced-motion`. Có `@media print`.

## Chức năng tĩnh bổ sung
- **Hộ chiếu vũ trụ** — 8 trạm (4 ban + trang chủ, giới thiệu, test, liên hệ) tự đóng dấu khi ghé thăm.
- **Bảng lệnh tìm nhanh** `Ctrl/⌘ + K` — 16 mục (4 trang chính, mục so sánh, 4 ban và 7 mảng), tìm được không dấu.
- **Bốc ngẫu nhiên một lựa chọn** — nút ở `gioi-thieu.html`, đưa người đọc chưa biết bắt đầu từ đâu tới một trong 7 trang mảng hoặc trang Ban PT-TN.
- Đếm ngược tới mốc sự kiện, thanh tiến độ đọc, nút về đầu trang, hiệu ứng `.reveal`.

## Nguồn nội dung
Booklet R.E.S.D Spring 2026 (33 trang) là tài liệu tham khảo về nội dung và nhận diện. Không sao chép nguyên 33 trang thành 33 màn hình. Không dùng lại deadline và lịch tuyển trong booklet vì đã hết hạn.

PDF giới thiệu Đoàn - Hội khoa (đối chiếu ở phiên tách trang) đã xác nhận lại ý nghĩa mảng **KT = Kỹ thuật**: đây là mảng quản lý/phát triển sản phẩm số và website Đoàn - Hội, training học phần cơ sở ngành, và kỹ thuật chương trình — **không phải** hậu cần/âm thanh/ánh sáng/sân khấu như hiểu nhầm ban đầu. Nội dung `tools/build_pages.py` đã được sửa theo cách hiểu mới này.

## Thay đổi quyết định

**Gỡ lệnh cấm iframe và Google Form** (2026-09-17). Bản brief trước ghi "không Google Form, không iframe" vì MVP khi đó chỉ là trang giới thiệu. Yêu cầu mới là sau khi làm bài test thì hiện form đăng ký ngay để người dùng điền liền mạch, nên lệnh cấm này bị ghi đè có chủ đích. Iframe chỉ dùng cho đúng một chỗ: form đăng ký trong `test-dinh-huong.html`.

**Thêm Google Fonts** (2026-09-17). Font hệ thống hay lỗi dấu tiếng Việt ở các trọng số đậm. Be Vietnam Pro có bộ dấu đầy đủ. Space Grotesk chỉ dùng cho số và mã latin nên không cần bộ dấu.

**Tách các mảng thành trang riêng** (phiên sau). Mảng ban đầu là section/anchor trong trang ban; các mảng thực tế có URL riêng để liên kết chia sẻ trỏ đúng và nội dung không bị dồn quá dài trên một trang. Sau đó đã xác nhận PT-TN là một ban thống nhất, nên hai trang PT/TN được gỡ và hồ sơ bài test được gộp thành một lựa chọn PTTN.

**Gỡ phần "khác gì web khoa" ở trang chủ, thêm bộ CSV cho bài test** (phiên sau). Trang chủ trước có hẳn một khối so sánh trực diện với web khoa — đã bỏ, để sự khác biệt tự hiện qua nội dung. Bài test được bổ sung khả năng đọc bộ câu hỏi/hồ sơ mảng từ CSV.

**Ẩn công cụ nạp CSV khỏi giao diện public, chuyển sang tự đọc từ host** (phiên sau nữa). Bản đầu của tính năng CSV có một khối "Dành cho Ban chuyên môn" hiển thị công khai trên trang test, cho phép bất kỳ ai ghé trang cũng thấy nút tải lên file câu hỏi. Việc quản trị nội dung không nên lộ ra giao diện của người dùng cuối, nên khối này đã bị gỡ; thay vào đó trang tự `fetch()` hai file CSV từ `assets/data/` mỗi khi tải, Ban chuyên môn chỉ cần thay nội dung hai file đó thẳng trên host.

## Trạng thái hiện tại
15 trang đã dựng xong. Sau mỗi thay đổi cần kiểm tra cấu trúc HTML, liên kết nội bộ và cú pháp JavaScript theo hướng dẫn trong `AGENTS.md`. Chi tiết các lần kiểm tra nằm trong `docs/progress.md`.

## Còn chờ xác nhận
- **Mốc 23/09/2026** đang ghi kèm chú thích "dự kiến, chờ xác nhận từ Ban chuyên môn".
- **Diễn giải tên mảng "DEP"** trong TT hiện hiểu là **Thiết kế - Hình ảnh**. Nếu Ban chuyên môn hiểu khác thì sửa trong `tools/build_pages.py` rồi chạy lại script. Mảng "KT" đã được xác nhận qua PDF, xem mục Nguồn nội dung ở trên.
- **Nhân sự và lời nhắn nhủ** đang là chỗ trống và nội dung mẫu, không bịa tên người thật.
- **3 liên kết còn rỗng** trong `js/config.js`: `formEmbedUrl`, `formOpenUrl`, `bookletUrl`, `contactEmail` (`fanpageUrl` đã có).
- **Ảnh thật cho chương trình nổi bật** — hiện đang là khung giữ chỗ, chưa có ảnh nào được duyệt để đưa vào `assets/images/`.
- **Dọn dẹp kỹ thuật còn nợ**: `css/style.css` còn khối CSS cho panel CSV cũ (`.csv-tools`, `.csv-field`, `.csv-upload`, `.csv-status`, `details.panel`) chưa được gỡ sau khi bỏ giao diện public — không ảnh hưởng người dùng vì không còn phần tử nào dùng tới, nhưng nên dọn ở phiên kế tiếp.
