"use strict";

/**
 * Bài kiểm tra định hướng R.E.S.D
 *
 * Mô hình: 4 trục độc lập, mỗi trục 6 câu thang Likert 5 mức.
 * Mỗi câu có hướng (+1 / -1) để tránh thói quen luôn chọn "đồng ý".
 *
 *   1. Nhịp làm việc      P (chuẩn bị trước) <-> I (ứng biến tại chỗ)
 *   2. Nguồn năng lượng   C (làm cùng người) <-> F (làm sâu một mình)
 *   3. Cách tạo giá trị   E (biểu đạt, sáng tạo) <-> A (phân tích, lập luận)
 *   4. Vị trí trong đội   S (tiền tuyến) <-> O (vận hành hậu phương)
 *
 * Kết quả: mã 4 chữ cái + độ tương đồng tham khảo với 4 ban và 8 lựa chọn chuyên môn.
 * Toàn bộ tính toán chạy trong trình duyệt, không gửi dữ liệu đi đâu.
 */
(async function () {
  const CFG = window.RESD_CONFIG || {};
  const store = window.RESD_STORE;
  const toast = window.RESD_TOAST || (() => {});
  const RESULT_KEY = "resd.test.v1";

  /* ====================================================================
     1. Dữ liệu
     ================================================================= */

  const AXES = [
    { id: "rhythm", name: "Nhịp làm việc", pos: "P", neg: "I", posName: "Chuẩn bị trước", negName: "Ứng biến tại chỗ",
      posDesc: "Bạn an tâm khi mọi thứ có kế hoạch, checklist và mốc thời gian rõ ràng.",
      negDesc: "Bạn bật lên đúng lúc mọi thứ thay đổi và cần một cái đầu lạnh xử lý ngay." },
    { id: "energy", name: "Nguồn năng lượng", pos: "C", neg: "F", posName: "Làm cùng người", negName: "Làm sâu một mình",
      posDesc: "Bạn lấy năng lượng từ trao đổi, kết nối và làm việc nhóm.",
      negDesc: "Bạn làm tốt nhất khi có khoảng lặng để tập trung vào một việc đến cùng." },
    { id: "value", name: "Cách tạo giá trị", pos: "E", neg: "A", posName: "Biểu đạt", negName: "Phân tích",
      posDesc: "Bạn diễn đạt ý tưởng bằng chữ, hình, âm thanh và câu chuyện.",
      negDesc: "Bạn tin vào số liệu, cấu trúc và lập luận có thể kiểm chứng." },
    { id: "stand", name: "Vị trí trong đội", pos: "S", neg: "O", posName: "Tiền tuyến", negName: "Vận hành",
      posDesc: "Bạn thoải mái khi đứng trước đám đông và đại diện cho tập thể.",
      negDesc: "Bạn thích làm cho bộ máy chạy trơn tru từ phía sau sân khấu." },
  ];

  /* 24 câu, xếp xen kẽ để người làm không đoán được trục.
     `let` (không phải `const`) vì Ban chuyên môn có thể nạp bộ câu hỏi
     khác từ file CSV — xem khối "Nạp dữ liệu từ CSV" bên dưới. */
  let QUESTIONS = [
    { a: 0, d: +1, q: "Khi tham gia một chương trình, tôi muốn chia công việc thành các mốc rõ ràng trước khi bắt đầu." },
    { a: 1, d: +1, q: "Tôi có thêm năng lượng khi được trao đổi và phối hợp thường xuyên với nhiều người." },
    { a: 2, d: +1, q: "Tôi thích biến một thông tin khô thành câu chữ, hình ảnh hoặc cách trình bày thu hút hơn." },
    { a: 3, d: -1, q: "Tôi thấy hài lòng khi phần việc phía sau vận hành ổn định, dù mình không xuất hiện trước mọi người." },

    { a: 0, d: -1, q: "Khi kế hoạch thay đổi đột ngột, tôi có thể nhanh chóng chọn lại việc cần ưu tiên." },
    { a: 1, d: -1, q: "Tôi làm tốt các việc cần tập trung liên tục trong một khoảng thời gian dài." },
    { a: 2, d: -1, q: "Trước khi tin một kết luận, tôi thường kiểm tra nguồn, dữ liệu hoặc tiêu chí được dùng." },
    { a: 3, d: +1, q: "Tôi thoải mái đại diện cho nhóm để trình bày, kết nối hoặc trao đổi với người khác." },

    { a: 0, d: +1, q: "Trước khi gửi một sản phẩm hoặc đưa một hoạt động vào vận hành, tôi muốn rà soát bằng checklist." },
    { a: 1, d: +1, q: "Tôi chủ động bắt chuyện và duy trì liên hệ với thành viên mới, sinh viên hoặc đối tác." },
    { a: 2, d: +1, q: "Khi nhận một chủ đề, tôi thường nghĩ ra nhiều cách mới để truyền tải hoặc tổ chức nó." },
    { a: 3, d: -1, q: "Tôi hợp với việc quản lý dữ liệu, timeline hoặc công cụ hỗ trợ để cả đội làm việc thuận lợi." },

    { a: 0, d: -1, q: "Tôi thoải mái bắt đầu từ một định hướng ban đầu rồi điều chỉnh dần qua phản hồi." },
    { a: 1, d: -1, q: "Tôi thích nhận một đầu việc rõ ràng, tự hoàn thiện phần lớn rồi mới trao đổi với nhóm." },
    { a: 2, d: -1, q: "Tôi thường phát hiện điểm chưa hợp lý trong số liệu, quy trình hoặc sản phẩm kỹ thuật." },
    { a: 3, d: +1, q: "Trong một hoạt động, tôi sẵn sàng làm người hướng dẫn, điều phối tại chỗ hoặc liên hệ chính." },

    { a: 0, d: +1, q: "Khi có nhiều đầu việc cùng lúc, tôi thường ghi lại deadline và theo dõi tiến độ từng việc." },
    { a: 1, d: +1, q: "Tôi thích những công việc cần trực tiếp lắng nghe, hỗ trợ và đồng hành cùng người khác." },
    { a: 2, d: +1, q: "Tôi quan tâm đến việc thông điệp được thể hiện sao cho người xem dễ hiểu và muốn tương tác." },
    { a: 3, d: -1, q: "Tôi thích xây dựng quy trình, tài liệu hoặc sản phẩm số để người khác sử dụng lâu dài." },

    { a: 0, d: -1, q: "Khi phát sinh sự cố, tôi vẫn có thể hành động dù chưa có đủ mọi thông tin." },
    { a: 1, d: -1, q: "Tôi có thể dành nhiều thời gian làm độc lập với nội dung, thiết kế, dữ liệu hoặc công nghệ." },
    { a: 2, d: -1, q: "Tôi hứng thú với việc phân tích nguyên nhân và tìm bằng chứng cho một vấn đề." },
    { a: 3, d: +1, q: "Trong thảo luận nhóm, tôi sẵn sàng đề xuất phương án và thông báo quyết định chung." },
  ];

  const LIKERT = [
    { v: 2, label: "Rất đúng với tôi", key: "1" },
    { v: 1, label: "Khá đúng", key: "2" },
    { v: 0, label: "Lưng chừng", key: "3" },
    { v: -1, label: "Khá không đúng", key: "4" },
    { v: -2, label: "Hoàn toàn không đúng", key: "5" },
  ];

  /* Bốn ban và các lựa chọn chuyên môn. Vector t[] theo thứ tự trục ở AXES,
     giá trị -1..1. `direct` đánh dấu lựa chọn trực tiếp ở cấp ban (PT-TN).
     Trị tuyệt đối càng lớn thì trục đó càng quan trọng với lựa chọn đó. */
  const BANS = [
    {
      id: "tcxd", gem: "Sapphire", color: "#6fa8ff", name: "Tổ chức - Xây dựng", short: "TC-XD",
      url: "ban-to-chuc-xay-dung.html",
      why: "Nơi một chương trình được dựng từ con số không: con người, nguồn lực và sân khấu.",
      mangs: [
        { code: "NS", name: "Nhân sự", url: "ban-to-chuc-xay-dung-ns.html", t: [0.85, 0.85, -0.3, -0.45],
          why: "Bạn quan tâm tới người trong đội nhiều như quan tâm tới đầu việc." },
        { code: "ĐN", name: "Đối ngoại", url: "ban-to-chuc-xay-dung-dn.html", t: [0.5, 0.9, 0.1, 0.8],
          why: "Bạn dám mở lời trước, giữ được quan hệ và nói thay cho tập thể." },
        { code: "KT", name: "Kỹ thuật", url: "ban-to-chuc-xay-dung-kt.html", t: [0.8, -0.2, -0.6, -0.9],
          why: "Bạn thấy vui khi hệ thống chạy đúng, dù khán giả không biết bạn là ai." },
      ],
    },
    {
      id: "pttn", gem: "Diamond", color: "#b9f6ff", name: "Phong trào - Tình nguyện", short: "PT-TN",
      url: "ban-phong-trao-tinh-nguyen.html",
      why: "Nơi tạo ra không khí sinh viên và những chuyến đi để lại dấu vết thật.",
      mangs: [
        { code: "PTTN", name: "Phong trào - Tình nguyện", url: "ban-phong-trao-tinh-nguyen.html", direct: true,
          t: [-0.125, 0.85, 0.25, 0.525],
          why: "Bạn có năng lượng làm việc cùng người khác, biết ứng biến và muốn tạo ra hoạt động có ích cho sinh viên, cộng đồng." },
      ],
    },
    {
      id: "tt", gem: "Ruby", color: "#ff799b", name: "Truyền thông", short: "TT",
      url: "ban-truyen-thong.html",
      why: "Nơi mọi hoạt động của Đoàn - Hội được kể lại để người ngoài muốn bước vào.",
      mangs: [
        { code: "IDEA", name: "Nội dung", url: "ban-truyen-thong-content.html", t: [0.1, 0.0, 0.9, 0.2],
          why: "Bạn viết được thứ người khác đọc hết chứ không lướt qua." },
        { code: "DEP", name: "Thiết kế - Hình ảnh", url: "ban-truyen-thong-dep.html", t: [-0.1, -0.4, 0.9, -0.3],
          why: "Bạn nghĩ bằng hình trước khi nghĩ bằng chữ." },
      ],
    },
    {
      id: "htnckh", gem: "Emerald", color: "#6ce8ae", name: "Học tập - Nghiên cứu khoa học", short: "HT-NCKH",
      url: "ban-hoc-tap-nckh.html",
      why: "Nơi đồng hành cùng sinh viên BIT qua tài liệu học tập, workshop kỹ năng và cơ hội tham gia đề tài thực tế.",
      mangs: [
        { code: "HT", name: "Học tập", url: "ban-hoc-tap-nckh-ht.html", t: [0.6, 0.4, -0.4, 0.3],
          why: "Bạn thích biến thứ mình hiểu thành thứ người khác học được." },
        { code: "NCKH", name: "Nghiên cứu khoa học", url: "ban-hoc-tap-nckh-nckh.html", t: [0.7, -0.5, -0.9, -0.4],
          why: "Bạn kiên nhẫn với dữ liệu và không ngại một câu hỏi phải mất vài tháng để trả lời." },
      ],
    },
  ];

  /* 16 nhóm. Mã đọc theo thứ tự trục: nhịp - năng lượng - giá trị - vị trí. */
  const TYPES = {
    PCES: { name: "Người dẫn đoàn", line: "Bạn lên kế hoạch cho cả nhóm rồi đứng ra nói thay cho nhóm.", strong: ["Điều phối", "Thuyết trình", "Giữ deadline"], grow: "Nhớ chừa chỗ cho người khác lên tiếng." },
    PCEO: { name: "Người giữ lửa hậu trường", line: "Bạn gắn kết đội và lo phần chuẩn bị để người khác toả sáng.", strong: ["Gắn kết đội", "Tổ chức", "Kể chuyện"], grow: "Thỉnh thoảng hãy nhận công cho mình." },
    PCAS: { name: "Người điều phối", line: "Bạn chốt được quyết định dựa trên dữ liệu và truyền đạt rõ ràng.", strong: ["Ra quyết định", "Phân tích", "Đối ngoại"], grow: "Đừng để số liệu lấn át cảm xúc của đội." },
    PCAO: { name: "Người giữ nhịp", line: "Bạn là bộ khung thầm lặng giữ cho mọi mốc thời gian không trượt.", strong: ["Theo dõi tiến độ", "Làm việc nhóm", "Chi tiết"], grow: "Tập nói \"không\" với việc không phải của mình." },
    PFES: { name: "Người dựng sân khấu", line: "Bạn chuẩn bị kỹ trong im lặng rồi trình bày một sản phẩm chỉn chu.", strong: ["Sáng tạo có kế hoạch", "Trình bày", "Thẩm mỹ"], grow: "Chia sẻ bản nháp sớm hơn thay vì chờ hoàn hảo." },
    PFEO: { name: "Người dựng hình", line: "Bạn ngồi sâu vào một sản phẩm và giao ra thứ dùng được ngay.", strong: ["Tập trung sâu", "Thiết kế", "Kỷ luật"], grow: "Hỏi sớm khi đề bài chưa rõ." },
    PFAS: { name: "Người trình bày dữ liệu", line: "Bạn biến bảng số khô khan thành một bài nói người ta hiểu.", strong: ["Phân tích", "Trình bày", "Nghiên cứu"], grow: "Bớt chi tiết đi một chút, khán giả sẽ theo kịp hơn." },
    PFAO: { name: "Kiến trúc sư quy trình", line: "Bạn nhìn thấy chỗ tắc trong một quy trình trước khi nó gây rắc rối.", strong: ["Hệ thống hoá", "Hậu cần", "Cẩn thận"], grow: "Quy trình tốt vẫn cần người chịu dùng nó." },
    ICES: { name: "Người thắp lửa", line: "Bạn kéo được không khí lên chỉ bằng vài câu và một nụ cười.", strong: ["Dẫn dắt đám đông", "Ứng biến", "Sáng tạo"], grow: "Ghi lại việc cần làm trước khi quên." },
    ICEO: { name: "Người ứng biến", line: "Sự cố phút chót là lúc bạn hữu dụng nhất, và bạn không cần ai thấy.", strong: ["Xử lý phát sinh", "Hỗ trợ đội", "Linh hoạt"], grow: "Đừng để việc chữa cháy thay thế việc phòng cháy." },
    ICAS: { name: "Người xử lý tình huống", line: "Bạn giữ cái đầu lạnh và nói ra phương án khi mọi người đang rối.", strong: ["Bình tĩnh", "Quyết đoán", "Giao tiếp"], grow: "Nói chậm lại để đội bắt kịp suy nghĩ của bạn." },
    ICAO: { name: "Người gỡ nút thắt", line: "Bạn tìm ra nguyên nhân thật của vấn đề rồi lặng lẽ sửa nó.", strong: ["Gỡ vấn đề", "Phân tích nhanh", "Làm nhóm"], grow: "Chia sẻ cách bạn gỡ, để lần sau đội tự gỡ được." },
    IFES: { name: "Người ngẫu hứng", line: "Ý tưởng của bạn đến bất chợt và bạn dám đem nó ra trước mọi người.", strong: ["Ý tưởng mới", "Trình bày", "Tự chủ"], grow: "Một cuốn sổ nhỏ sẽ cứu rất nhiều ý tưởng." },
    IFEO: { name: "Người sáng tạo thầm lặng", line: "Bạn làm ra thứ đẹp mà không cần ai đứng cạnh nhắc.", strong: ["Thiết kế", "Tự chủ", "Ứng biến"], grow: "Cho đội thấy tiến độ sớm, đừng để đến phút chót." },
    IFAS: { name: "Người khảo sát", line: "Bạn đi tìm câu trả lời thật rồi mang nó ra trình bày.", strong: ["Nghiên cứu", "Đặt câu hỏi", "Thuyết trình"], grow: "Đặt hạn cho việc tìm hiểu, nếu không sẽ không bao giờ xong." },
    IFAO: { name: "Thợ máy của hệ thống", line: "Bạn hiểu cách mọi thứ vận hành và giữ cho nó chạy.", strong: ["Kỹ thuật", "Tập trung", "Xử lý sự cố"], grow: "Viết lại cách bạn làm, đội sẽ đỡ phụ thuộc vào bạn." },
  };

  /* ====================================================================
     1b. Đọc và áp bộ câu hỏi / hồ sơ mảng dạng CSV
     ================================================================= */

  /* Bỏ dấu, chữ thường, chỉ giữ a-z0-9 — để so khớp tên cột và mã trục
     dù người điền viết hoa/thường hay có khoảng trắng khác nhau. */
  function normKey(s) {
    return String(s || "")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/gi, "d").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  /* nhip / nangluong / giatri / vitri khớp đúng thứ tự AXES ở trên.
     Chấp nhận thêm vài cách viết quen thuộc để đỡ phải đọc tài liệu. */
  const AXIS_CODE_TO_INDEX = {};
  [["nhip", "nhiplamviec", "rhythm"], ["nangluong", "nguonnangluong", "energy"],
   ["giatri", "cachtaogiatri", "value"], ["vitri", "vitritrongdoi", "stand"]]
    .forEach((keys, i) => keys.forEach((k) => { AXIS_CODE_TO_INDEX[k] = i; }));

  /* Parser CSV tối giản (không phụ thuộc thư viện ngoài): hỗ trợ dấu phẩy,
     ngoặc kép và xuống dòng bên trong ô, giống định dạng Excel/Sheets xuất ra. */
  function parseCSV(text) {
    const s = String(text || "").replace(/^\uFEFF/, "");
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;
    for (let i = 0; i < s.length; i += 1) {
      const c = s[i];
      if (inQuotes) {
        if (c === '"') {
          if (s[i + 1] === '"') { field += '"'; i += 1; } else { inQuotes = false; }
        } else field += c;
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field); field = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && s[i + 1] === "\n") i += 1;
        row.push(field); field = "";
        if (row.length > 1 || row[0] !== "") rows.push(row);
        row = [];
      } else field += c;
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    if (!rows.length) return [];
    const header = rows[0].map((h) => normKey(h));
    return rows.slice(1)
      .filter((r) => r.some((c) => String(c).trim() !== ""))
      .map((r) => {
        const obj = {};
        header.forEach((h, i) => { obj[h] = r[i] !== undefined ? String(r[i]).trim() : ""; });
        return obj;
      });
  }

  /** Trả về { ok:true, data } hoặc { ok:false, error }. */
  function loadQuestionsFromCSV(text) {
    let rows;
    try { rows = parseCSV(text); } catch (err) { return { ok: false, error: "Không đọc được nội dung file." }; }
    if (!rows.length) return { ok: false, error: "File rỗng hoặc không đúng định dạng CSV." };
    const data = [];
    for (const r of rows) {
      const a = AXIS_CODE_TO_INDEX[normKey(r.truc)];
      if (a === undefined) {
        return { ok: false, error: "Cột \"truc\" có giá trị không hợp lệ ở dòng \"" + (r.macau || "?") + "\": " + r.truc };
      }
      const dRaw = String(r.huong || "").trim();
      const d = dRaw === "-1" || dRaw === "-" ? -1 : (dRaw === "+1" || dRaw === "1" || dRaw === "+" ? 1 : NaN);
      if (Number.isNaN(d)) {
        return { ok: false, error: "Cột \"huong\" phải là +1 hoặc -1 (dòng \"" + (r.macau || "?") + "\")." };
      }
      const q = r.noidungcauhoi || r.cauhoi || "";
      if (!q) return { ok: false, error: "Thiếu nội dung câu hỏi ở dòng \"" + (r.macau || "?") + "\"." };
      data.push({ a, d, q });
    }
    if (data.length < 4) return { ok: false, error: "Cần ít nhất vài câu hỏi thì mới chấm điểm được." };
    return { ok: true, data };
  }

  /** Trả về { ok:true, applied, unknown } hoặc { ok:false, error }. */
  function loadProfilesFromCSV(text) {
    let rows;
    try { rows = parseCSV(text); } catch (err) { return { ok: false, error: "Không đọc được nội dung file." }; }
    if (!rows.length) return { ok: false, error: "File rỗng hoặc không đúng định dạng CSV." };
    const cols = ["nhiplamviec", "nguonnangluong", "cachtaogiatri", "vitritrongdoi"];
    let applied = 0;
    const unknown = [];
    rows.forEach((r) => {
      const code = String(r.mamang || "").trim().toUpperCase();
      if (!code) return;
      let target = null;
      BANS.forEach((ban) => ban.mangs.forEach((m) => { if (m.code.toUpperCase() === code) target = m; }));
      if (!target) { unknown.push(code); return; }
      target.t = cols.map((c) => {
        const v = parseFloat(r[c]);
        return Number.isFinite(v) ? Math.max(-100, Math.min(100, v)) / 100 : 0;
      });
      if (r.motangan) target.why = r.motangan;
      applied += 1;
    });
    if (!applied) return { ok: false, error: "Không khớp được mã lựa chọn nào. Kiểm tra lại cột \"ma_mang\"." };
    return { ok: true, applied, unknown };
  }

  /* ====================================================================
     1c. Tự động lấy bộ câu hỏi / hồ sơ mảng từ thư mục assets/data trên host
     ================================================================= */

  /* Ban chuyên môn cập nhật nội dung bằng cách thay thẳng nội dung hai file
     `assets/data/cau-hoi-mau.csv` và `assets/data/ho-so-mang-mau.csv` trên
     host (qua trình quản lý file của nơi lưu trữ trang), KHÔNG cần vào giao
     diện website. Trang tự đọc lại hai file này mỗi khi tải trang: nếu file
     hợp lệ thì dùng nội dung mới, không thì lặng lẽ dùng bộ mặc định đã
     nhúng sẵn trong mã nguồn — người dùng cuối không thấy công cụ nạp file
     nào cả và không có bước nào cần họ can thiệp. */
  function fetchTextWithTimeout(url, timeoutMs) {
    if (typeof fetch !== "function") return Promise.resolve(null);
    const ctrl = typeof AbortController === "function" ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
    return fetch(url, { cache: "no-store", signal: ctrl ? ctrl.signal : undefined })
      .then((res) => (res && res.ok ? res.text() : null))
      .catch(() => null) // offline, mở qua file://, CORS, 404... đều coi là "chưa có bản cập nhật"
      .finally(() => { if (timer) clearTimeout(timer); });
  }

  async function loadHostDataQuietly() {
    const [qText, pText] = await Promise.all([
      fetchTextWithTimeout("assets/data/cau-hoi-mau.csv", 2500),
      fetchTextWithTimeout("assets/data/ho-so-mang-mau.csv", 2500),
    ]);
    if (qText) {
      const res = loadQuestionsFromCSV(qText);
      if (res.ok) QUESTIONS = res.data;
    }
    if (pText) {
      loadProfilesFromCSV(pText); // ghi thẳng vào từng lựa chọn trong BANS; lỗi thì bỏ qua trong im lặng
    }
  }

  /* ====================================================================
     2. Chấm điểm
     ================================================================= */

  function scoreAxes(answers) {
    const sums = [0, 0, 0, 0];
    const counts = [0, 0, 0, 0];
    QUESTIONS.forEach((q, i) => {
      const v = answers[i];
      if (typeof v !== "number") return;
      sums[q.a] += v * q.d;
      counts[q.a] += 1;
    });
    // Chuẩn hoá về -1..1 (mỗi câu tối đa 2 điểm).
    return sums.map((s, i) => (counts[i] ? s / (counts[i] * 2) : 0));
  }

  /**
   * Độ tương đồng tham khảo = tương đồng cosine giữa hồ sơ người làm và hồ sơ mảng.
   *
   * Dùng cosine thay vì khoảng cách vì cosine không phụ thuộc độ lớn vector:
   * một mảng có thiên hướng nhẹ trên cả bốn trục sẽ không tự động thắng chỉ
   * vì nó nằm gần tâm. Kết quả -1..1 được quy về thang 0..100.
   */
  function fitScore(u, t) {
    let dot = 0;
    let nu = 0;
    let nt = 0;
    for (let i = 0; i < 4; i += 1) {
      dot += u[i] * t[i];
      nu += u[i] * u[i];
      nt += t[i] * t[i];
    }
    if (nu < 1e-9 || nt < 1e-9) return 50; // trả lời lưng chừng hết: không nghiêng về đâu
    const cos = dot / (Math.sqrt(nu) * Math.sqrt(nt));
    return Math.round(((cos + 1) / 2) * 100);
  }

  function buildResult(answers) {
    const u = scoreAxes(answers);
    const code = AXES.map((ax, i) => (u[i] >= 0 ? ax.pos : ax.neg)).join("");

    const mangs = [];
    const bans = BANS.map((ban) => {
      const list = ban.mangs.map((m) => {
        const s = fitScore(u, m.t);
        mangs.push({ ...m, ban, score: s });
        return { ...m, score: s };
      }).sort((a, b) => b.score - a.score);
      const max = list[0].score;
      const mean = list.reduce((acc, m) => acc + m.score, 0) / list.length;
      return { ...ban, mangs: list, score: Math.round(max * 0.7 + mean * 0.3) };
    }).sort((a, b) => b.score - a.score);

    mangs.sort((a, b) => b.score - a.score);
    return { u, code, bans, mangs, at: new Date().toISOString() };
  }

  /* ====================================================================
     3. Giao diện
     ================================================================= */

  const root = document.querySelector("[data-quiz]");
  if (!root) return;

  /* Chờ (tối đa ~2.5s) thử lấy bản CSV mới nhất từ host trước khi dựng UI,
     để nếu Ban chuyên môn vừa thay file thì người làm bài thấy ngay bộ mới
     ngay từ câu đầu tiên chứ không phải đợi tải lại trang lần hai. */
  await loadHostDataQuietly();

  const screens = {
    intro: root.querySelector("[data-screen='intro']"),
    quiz: root.querySelector("[data-screen='quiz']"),
    result: root.querySelector("[data-screen='result']"),
  };

  const answers = new Array(QUESTIONS.length).fill(null);
  let index = 0;

  function show(name) {
    Object.entries(screens).forEach(([key, el]) => { if (el) el.hidden = key !== name; });
  }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* --- Màn hình câu hỏi ------------------------------------------------ */
  const qHost = root.querySelector("[data-question]");
  const barFill = root.querySelector("[data-quiz-bar]");
  const stepLabel = root.querySelector("[data-quiz-step]");
  const axisLabel = root.querySelector("[data-quiz-axis]");
  const prevBtn = root.querySelector("[data-quiz-prev]");
  const nextBtn = root.querySelector("[data-quiz-next]");

  function renderQuestion() {
    const q = QUESTIONS[index];
    const axis = AXES[q.a];

    qHost.innerHTML =
      '<p class="axis-tag">Phần ' + (q.a + 1) + " / 4 · " + esc(axis.name) + "</p>" +
      "<h2>" + esc(q.q) + "</h2>" +
      '<fieldset class="likert">' +
      '<legend class="visually-hidden">' + esc(q.q) + "</legend>" +
      LIKERT.map((opt, i) =>
        '<label><input type="radio" name="q" value="' + opt.v + '"' +
        (answers[index] === opt.v ? " checked" : "") +
        '><span class="mark" aria-hidden="true"></span><span>' + esc(opt.label) +
        '</span><span class="key" aria-hidden="true">' + opt.key + "</span></label>"
      ).join("") +
      "</fieldset>";

    qHost.querySelectorAll("input[name='q']").forEach((input) => {
      input.addEventListener("change", () => {
        answers[index] = Number(input.value);
        updateProgress();
        updateNav();
        setTimeout(() => { if (index < QUESTIONS.length - 1) goTo(index + 1); }, 190);
      });
    });

    updateProgress();
    updateNav();
  }

  function updateProgress() {
    const done = answers.filter((a) => a !== null).length;
    if (barFill) barFill.style.width = (done / QUESTIONS.length) * 100 + "%";
    if (stepLabel) stepLabel.textContent = "Câu " + (index + 1) + " / " + QUESTIONS.length;
    if (axisLabel) axisLabel.textContent = "Đã trả lời " + done + " câu";
  }

  function updateNav() {
    if (prevBtn) prevBtn.disabled = index === 0;
    if (!nextBtn) return;
    const last = index === QUESTIONS.length - 1;
    const allDone = answers.every((a) => a !== null);
    nextBtn.textContent = last ? "Xem kết quả" : "Câu tiếp theo";
    nextBtn.disabled = last ? !allDone : answers[index] === null;
  }

  function goTo(i) {
    index = Math.min(Math.max(i, 0), QUESTIONS.length - 1);
    renderQuestion();
    qHost.querySelector("h2")?.scrollIntoView({ block: "center", behavior: "auto" });
    qHost.querySelector("input")?.focus({ preventScroll: true });
  }

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => {
    if (index === QUESTIONS.length - 1) finish();
    else goTo(index + 1);
  });

  /* Phím 1-5 để chọn nhanh. */
  document.addEventListener("keydown", (event) => {
    if (screens.quiz?.hidden) return;
    if (event.target.matches("input[type='text'], textarea")) return;
    const n = Number(event.key);
    if (n >= 1 && n <= 5) {
      const input = qHost.querySelectorAll("input[name='q']")[n - 1];
      if (input) { input.checked = true; input.dispatchEvent(new Event("change")); }
    } else if (event.key === "ArrowLeft") { goTo(index - 1); }
    else if (event.key === "ArrowRight" && answers[index] !== null) { goTo(index + 1); }
  });

  root.querySelectorAll("[data-quiz-start]").forEach((btn) => btn.addEventListener("click", () => {
    answers.fill(null);
    index = 0;
    show("quiz");
    renderQuestion();
    screens.quiz.scrollIntoView({ block: "start" });
  }));

  /* --- Màn hình kết quả ------------------------------------------------ */
  function finish() {
    const result = buildResult(answers);
    store?.write(RESULT_KEY, { answers, code: result.code });
    renderResult(result);
    show("result");
    screens.result.scrollIntoView({ block: "start" });
  }

  function renderResult(r) {
    const type = TYPES[r.code] || { name: "Nhà thám hiểm", line: "", strong: [], grow: "" };
    const topBan = r.bans[0];
    const topMang = r.mangs[0];

    root.querySelector("[data-result-code]").textContent = r.code;
    root.querySelector("[data-result-name]").textContent = type.name;
    root.querySelector("[data-result-line]").textContent = type.line;
    root.querySelector("[data-result-strong]").innerHTML =
      type.strong.map((s) => '<span class="chip is-gem">' + esc(s) + "</span>").join("");
    root.querySelector("[data-result-grow]").textContent = type.grow;

    root.querySelector("[data-result-axes]").innerHTML = AXES.map((ax, i) => {
      const v = r.u[i];
      const pct = Math.round(Math.abs(v) * 100);
      const toPos = v >= 0;
      const half = Math.abs(v) * 50;
      const style = toPos ? "left:50%;width:" + half + "%" : "right:50%;width:" + half + "%";
      const leaning = toPos ? ax.posName : ax.negName;
      const desc = toPos ? ax.posDesc : ax.negDesc;
      return '<div class="axis-row">' +
        '<div class="ends"><b>' + esc(ax.posName) + " (" + ax.pos + ")</b><span>" + esc(ax.name) +
        "</span><b>(" + ax.neg + ") " + esc(ax.negName) + "</b></div>" +
        '<div class="track"><i style="' + style + '"></i></div>' +
        '<p class="note">Nghiêng ' + pct + "% về " + esc(leaning) + ". " + esc(desc) + "</p></div>";
    }).join("");

    root.querySelector("[data-result-bans]").innerHTML = r.bans.map((ban, i) =>
      '<li class="fit-row' + (i === 0 ? " is-top" : "") + '" style="--c:' + ban.color + '">' +
      '<div class="top"><span class="who"><span class="gem-dot" style="--dot:' + ban.color + '"></span>' +
      esc(ban.name) + "</span><span class=\"score\">" + ban.score + "% tương đồng</span></div>" +
      '<div class="track"><i style="width:' + ban.score + '%"></i></div>' +
      "<p>" + esc(ban.why) + "</p>" +
      '<div class="links"><a href="' + ban.url + '">Xem trang ban</a>' +
      ban.mangs.filter((m) => !m.direct).map((m) => '<a href="' + m.url + '">' + esc(m.code) + " · " + m.score + "% tương đồng</a>").join("") +
      "</div></li>"
    ).join("");

    const flat = Math.max.apply(null, r.u.map(Math.abs)) < 0.12;
    root.querySelector("[data-result-mang]").innerHTML = flat
      ? "Bạn chọn <b>lưng chừng ở gần như mọi câu</b>, nên cả bốn ban đều có độ tương đồng gần nhau và mã bốn chữ cái phía trên chưa nói lên điều gì. " +
        "Hãy làm lại và chọn dứt khoát hơn, hoặc đọc thẳng bốn trang ban để tự so."
      : (topMang.direct ? "Ban" : "Mảng") + " được gợi ý để bạn đọc trước là <b>" + esc(topMang.code + " · " + topMang.name) +
        "</b>" + (topMang.direct ? "" : " thuộc ban " + esc(topMang.ban.name)) +
        " (" + topMang.score + "% tương đồng tham khảo). " + esc(topMang.why);

    lastResult = { r, type, topBan, topMang };

    // Canvas là phần phụ. Nếu trình duyệt không vẽ được thì kết quả dạng chữ
    // vẫn phải hiện đầy đủ, nên tách riêng và nuốt lỗi ở đây.
    try {
      drawCard(r, type, topBan, topMang);
    } catch (err) {
      const wrapEl = root.querySelector(".result-canvas-wrap");
      if (wrapEl) wrapEl.hidden = true;
      const dl = root.querySelector("[data-result-download]");
      if (dl) dl.hidden = true;
    }
  }

  let lastResult = null;

  /* --- Vẽ ảnh kết quả bằng canvas -------------------------------------- */
/* --- Vẽ ảnh kết quả bằng canvas -------------------------------------- */
  const canvas = root.querySelector("[data-result-canvas]");

  function drawCard(r, type, topBan, topMang) {
    if (!canvas) return;
    const W = 1080;
    const H = 1350;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext && canvas.getContext("2d");
    if (!ctx) throw new Error("Trình duyệt không hỗ trợ canvas 2d");

    const paint = () => {
      const font = (size, weight) => (weight || 400) + " " + size + 'px "Be Vietnam Pro", "Segoe UI", Arial, sans-serif';
      const mono = (size, weight) => (weight || 700) + " " + size + 'px "Space Grotesk", "Segoe UI", Consolas, monospace';
      const fitFont = (text, maxWidth, startSize, minSize, weight) => {
        let size = startSize;
        ctx.font = font(size, weight);
        while (size > minSize && ctx.measureText(text).width > maxWidth) {
          size -= 2;
          ctx.font = font(size, weight);
        }
        return size;
      };

      // Nền
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#0b2038");
      bg.addColorStop(0.55, "#071323");
      bg.addColorStop(1, "#040b16");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Sao
      let seed = 7;
      const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      for (let i = 0; i < 150; i += 1) {
        const x = rnd() * W;
        const y = rnd() * H;
        const rr = rnd() * 1.9 + 0.4;
        ctx.globalAlpha = 0.18 + rnd() * 0.55;
        ctx.fillStyle = i % 3 === 0 ? "#86d2f7" : "#dff4ff";
        ctx.beginPath();
        ctx.arc(x, y, rr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Quầng sáng theo màu ban phù hợp nhất
      const glow = ctx.createRadialGradient(W - 130, 250, 20, W - 130, 250, 480);
      glow.addColorStop(0, topBan.color + "66");
      glow.addColorStop(1, "#00000000");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // Khung
      ctx.strokeStyle = "#a0c5e544";
      ctx.lineWidth = 2;
      ctx.strokeRect(48, 48, W - 96, H - 96);

      // Đầu thẻ
      ctx.fillStyle = "#7ae9ed";
      ctx.font = font(26, 600);
      ctx.fillText("R.E.S.D · BÀI KIỂM TRA ĐỊNH HƯỚNG", 96, 140);

      ctx.fillStyle = "#8296ad";
      ctx.font = font(24, 400);
      ctx.fillText("Đoàn - Hội khoa Công nghệ thông tin kinh doanh", 96, 182);

      // =========================================================================
      // [PHẦN THÊM MỚI] Vẽ Logo ở góc phải header
      // =========================================================================
      const logo = new Image();
      logo.crossOrigin = "anonymous"; // Thêm để tránh lỗi CORS nếu bạn có chức năng tải/lưu ảnh về máy
      logo.src = "./assets/images/logo-khoa-trang.png"; // <-- THAY LINK LOGO CỦA BẠN VÀO ĐÂY
      logo.onload = () => {
        // Giới hạn kích thước tối đa của logo trên thẻ
        const maxHeight = 80;
        const maxWidth = 200; 
        
        // Lấy kích thước gốc
        let targetWidth = logo.width;
        let targetHeight = logo.height;
        
        // 1. Tính toán tỷ lệ: Ưu tiên thu nhỏ theo chiều cao (maxHeight)
        if (targetHeight > maxHeight || targetHeight <= maxHeight) {
          targetWidth = targetWidth * (maxHeight / targetHeight);
          targetHeight = maxHeight;
        }
        
        // 2. Nếu thu theo chiều cao mà chiều rộng vẫn vượt maxWidth, thu tiếp theo chiều rộng
        if (targetWidth > maxWidth) {
          targetHeight = targetHeight * (maxWidth / targetWidth);
          targetWidth = maxWidth;
        }

        // Tính tọa độ X: Căn mép phải, luôn cách lề phải 96px
        const x = W - 96 - targetWidth;
        
        // Tính tọa độ Y: Căn giữa theo trục dọc với dòng chữ tiêu đề (Tâm Y ~ 150)
        const y = 150 - (targetHeight / 2);

        // Vẽ ảnh lên canvas với kích thước đã được tính toán chuẩn tỷ lệ
        ctx.drawImage(logo, x, y, targetWidth, targetHeight);
      };
      // =========================================================================

      // Mã
      ctx.fillStyle = topBan.color;
      ctx.font = mono(164, 700);
      ctx.fillText(r.code, 92, 358);

      // Tên nhóm
      ctx.fillStyle = "#eef7ff";
      fitFont(type.name, W - 192, 58, 42, 800);
      ctx.fillText(type.name, 96, 442);

      // Mô tả
      ctx.fillStyle = "#a8bacf";
      ctx.font = font(30, 400);
      wrap(ctx, type.line, 96, 500, W - 200, 46);

      // Bốn trục
      let y = 610;
      ctx.font = font(24, 600);
      AXES.forEach((ax, i) => {
        const v = r.u[i];
        const toPos = v >= 0;
        ctx.fillStyle = "#8296ad";
        ctx.fillText(ax.posName + " (" + ax.pos + ")", 96, y);
        ctx.textAlign = "right";
        ctx.fillText("(" + ax.neg + ") " + ax.negName, W - 96, y);
        ctx.textAlign = "left";

        const bx = 96;
        const bw = W - 192;
        ctx.fillStyle = "#13293f";
        roundRect(ctx, bx, y + 16, bw, 16, 8);
        ctx.fill();

        const half = (Math.abs(v) * bw) / 2;
        ctx.fillStyle = "#7ae9ed";
        if (toPos) roundRect(ctx, bx + bw / 2, y + 16, Math.max(half, 6), 16, 8);
        else roundRect(ctx, bx + bw / 2 - Math.max(half, 6), y + 16, Math.max(half, 6), 16, 8);
        ctx.fill();

        y += 88;
      });

      // Ban được gợi ý
      ctx.fillStyle = "#8296ad";
      ctx.font = font(24, 600);
      ctx.fillText("BAN ĐƯỢC GỢI Ý", 96, y + 40);

      ctx.fillStyle = topBan.color;
      const banLabel = topBan.gem + " · " + topBan.name;
      fitFont(banLabel, W - 192, 52, 36, 800);
      ctx.fillText(banLabel, 96, y + 106);

      ctx.fillStyle = "#a8bacf";
      ctx.font = font(26, 400);
      wrap(
        ctx,
        (topMang.direct ? "Ban" : "Mảng") + " gợi ý: " + topMang.code + " · " + topMang.name + " — " + topMang.score + "% tương đồng",
        96,
        y + 154,
        W - 192,
        38
      );

      // Chân thẻ
      ctx.strokeStyle = "#a0c5e533";
      ctx.beginPath();
      ctx.moveTo(96, H - 168);
      ctx.lineTo(W - 96, H - 168);
      ctx.stroke();

      ctx.fillStyle = "#8296ad";
      ctx.font = font(24, 400);
      ctx.fillText("Kết quả trắc nghiệm mang tính chất tham khảo, Đoàn - Hội luôn trân trọng mọi màu sắc và tiềm năng thực tế của các BIT-ers.", 96, H - 118);
      ctx.fillStyle = "#7ae9ed";
      ctx.fillText("✦ Về với BIT nhé các Tí yêu ơi!", 96, H - 76);
    };

    const safePaint = () => { try { paint(); } catch (err) { /* thẻ ảnh là phần phụ */ } };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(safePaint, safePaint);
    else safePaint();
  }

  function wrap(ctx, text, x, y, maxWidth, lineHeight) {
    const words = String(text).split(" ");
    let line = "";
    let cy = y;
    words.forEach((word) => {
      const test = line ? line + " " + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, cy);
        line = word;
        cy += lineHeight;
      } else {
        line = test;
      }
    });
    if (line) ctx.fillText(line, x, cy);
    return cy;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* --- Xuất kết quả dạng CSV --------------------------------------------
     Một file duy nhất gồm: toàn bộ câu hỏi kèm câu trả lời đã chọn, rồi tới
     bảng độ tương đồng tham khảo của 8 lựa chọn và 4 ban, rồi tới 4 trục — cùng khuôn dạng cột
     với hai file CSV trong assets/data/, để mở lại bằng Excel/Sheets như một
     "phiếu điểm" kiểu MBTI/DISC. */
  function csvField(v) {
    const s = String(v == null ? "" : v);
    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function csvRow(arr) { return arr.map(csvField).join(","); }
  function likertLabel(v) {
    const found = LIKERT.find((opt) => opt.v === v);
    return found ? found.label : "";
  }

  function buildResultCSV(r, type, answersSnapshot) {
    const lines = [];
    lines.push(csvRow(["R.E.S.D — KẾT QUẢ BÀI KIỂM TRA ĐỊNH HƯỚNG"]));
    lines.push(csvRow(["Mã định hướng", r.code]));
    lines.push(csvRow(["Nhóm tính cách", type.name]));
    lines.push(csvRow(["Mô tả", type.line]));
    lines.push(csvRow(["Thời điểm làm bài", r.at]));
    lines.push("");
    lines.push(csvRow(["CÂU HỎI VÀ CÂU TRẢ LỜI"]));
    lines.push(csvRow(["stt", "truc", "huong", "noi_dung_cau_hoi", "cau_tra_loi", "gia_tri"]));
    QUESTIONS.forEach((q, i) => {
      const axis = AXES[q.a];
      lines.push(csvRow([
        i + 1, axis.name, q.d > 0 ? axis.pos : axis.neg, q.q,
        likertLabel(answersSnapshot[i]), answersSnapshot[i],
      ]));
    });
    lines.push("");
    lines.push(csvRow(["ĐỘ TƯƠNG ĐỒNG THAM KHẢO THEO LỰA CHỌN (8 lựa chọn)"]));
    lines.push(csvRow(["ma_ban", "ten_ban", "ma_mang", "ten_mang", "do_tuong_dong_tham_khao"]));
    r.mangs.forEach((m) => lines.push(csvRow([m.ban.short, m.ban.name, m.code, m.name, m.score + "%"])));
    lines.push("");
    lines.push(csvRow(["ĐỘ TƯƠNG ĐỒNG THAM KHẢO THEO BAN (tổng hợp)"]));
    lines.push(csvRow(["ma_ban", "ten_ban", "do_tuong_dong_tham_khao"]));
    r.bans.forEach((b) => lines.push(csvRow([b.short, b.name, b.score + "%"])));
    lines.push("");
    lines.push(csvRow(["BỐN TRỤC TÍNH CÁCH"]));
    lines.push(csvRow(["truc", "nghieng_ve", "phan_tram"]));
    AXES.forEach((ax, i) => {
      const v = r.u[i];
      const toPos = v >= 0;
      lines.push(csvRow([
        ax.name, toPos ? ax.posName + " (" + ax.pos + ")" : ax.negName + " (" + ax.neg + ")",
        Math.round(Math.abs(v) * 100) + "%",
      ]));
    });
    return "\uFEFF" + lines.join("\r\n");
  }

  root.querySelector("[data-result-csv]")?.addEventListener("click", () => {
    if (!lastResult) return;
    const { r, type } = lastResult;
    try {
      const csv = buildResultCSV(r, type, answers);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resd-dinh-huong-" + r.code + ".csv";
      link.click();
      URL.revokeObjectURL(url);
      toast("Đã tải kết quả dạng CSV (mở được bằng Excel).");
    } catch (err) {
      toast("Không tạo được file CSV. Bạn có thể tải ảnh kết quả thay thế.");
    }
  });

  /* --- Hành động sau khi có kết quả ------------------------------------ */
  root.querySelector("[data-result-download]")?.addEventListener("click", () => {
    if (!canvas || !lastResult) return;
    const link = document.createElement("a");
    link.download = "resd-dinh-huong-" + lastResult.r.code + ".png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast("Đã tải ảnh kết quả về máy.");
  });

  root.querySelector("[data-result-copy]")?.addEventListener("click", async () => {
    if (!lastResult) return;
    const { r, type, topBan, topMang } = lastResult;
    const text =
      "Kết quả định hướng R.E.S.D của mình: " + r.code + " — " + type.name + ".\n" +
      "Ban được gợi ý: " + topBan.name + " (" + topBan.score + "% tương đồng tham khảo), " +
      (topMang.direct ? "lựa chọn " : "mảng ") + topMang.code + " (" + topMang.score + "% tương đồng tham khảo).\n" +
      "Làm thử tại cổng thông tin R.E.S.D.";
    try {
      await navigator.clipboard.writeText(text);
      toast("Đã sao chép kết quả.");
    } catch (err) {
      toast("Trình duyệt chặn sao chép. Bạn có thể tải ảnh thay thế.");
    }
  });

  root.querySelector("[data-result-retake]")?.addEventListener("click", () => {
    answers.fill(null);
    index = 0;
    store?.remove(RESULT_KEY);
    show("quiz");
    renderQuestion();
    screens.quiz.scrollIntoView({ block: "start" });
  });

  /* --- Nhúng đơn đăng ký ----------------------------------------------- */
  const embedHost = root.querySelector("[data-form-embed]");
  if (embedHost && CFG.formEmbedUrl) {
    embedHost.innerHTML =
      '<iframe src="' + CFG.formEmbedUrl + '" title="Đơn đăng ký R.E.S.D" loading="lazy">Đang tải đơn đăng ký…</iframe>';
  }

  /* --- Khôi phục kết quả cũ -------------------------------------------- */
  const saved = store?.read(RESULT_KEY, null);
  if (saved && Array.isArray(saved.answers) && saved.answers.length === QUESTIONS.length && saved.answers.every((a) => typeof a === "number")) {
    saved.answers.forEach((v, i) => { answers[i] = v; });
    renderResult(buildResult(answers));
    show("result");
  } else {
    show("intro");
  }
})();
