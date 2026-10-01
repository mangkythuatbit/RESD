"use strict";

/**
 * Cấu hình tập trung của cổng thông tin R.E.S.D.
 *
 * Mọi liên kết ngoài và mốc thời gian đều khai báo tại đây để ban Truyền thông
 * cập nhật một chỗ duy nhất, không phải sửa từng trang HTML.
 *
 * Quy ước: để chuỗi rỗng ("") nếu chưa có thông tin chính thức.
 * Giao diện sẽ tự hiển thị trạng thái "đang cập nhật" thay vì link hỏng.
 */
window.RESD_CONFIG = {
  /* Link nhúng Google Form đăng ký. */
  formEmbedUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfKn6lRUmug7r1ztfUOvAqOV9jjbhmRBO-gYIe9-KSEk928ww/viewform?embedded=true",

  /* Link mở Google Form ở tab mới (dạng .../viewform). */
  formOpenUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfKn6lRUmug7r1ztfUOvAqOV9jjbhmRBO-gYIe9-KSEk928ww/viewform",

  /* Link booklet R.E.S.D Spring 2026 (Drive, Canva, Flipbook...). */
  bookletUrl: "https://heyzine.com/flip-book/55514e23aa.html",

  /* Fanpage Đoàn - Hội khoa Công nghệ thông tin kinh doanh. */
  fanpageUrl: "https://www.facebook.com/BIT.UEH",

  /* Email đầu mối theo booklet R.E.S.D 2026. */
  contactEmail: "doanhoi.bit@ueh.edu.vn",

  /* Hạn nhận đơn theo booklet R.E.S.D 2026. */
  event: {
    title: "Hạn chót nhận đơn ứng tuyển",
    date: "2026-10-03T23:59:00+07:00",
    note: "",
  },
};
