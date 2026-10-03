/* Bản đồ sao BIT — các ngôi sao nằm trên đường viền logo BIT (vector trích từ logo gốc 989x335). */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var VB = { x: -20, y: -20, w: 1029, h: 375 };
  /* 7 đường viền kín của logo: thân B+I+T+swoosh, thân B dưới, 2 lỗ chữ B, I dưới, T dưới, mũi tên */
  var LOGO = ["M399 206.8 L398.5 331.5 L519.2 332 L519.8 207 L445 209Z", "M773.8 166.5 L759.5 172 L732.2 178.8 L651 193.8 L651.2 334.2 L773.8 334Z", "M82.8 126.5 L83.2 330.5 L267 330.5 L282 328.8 L305 322.8 L317.2 317.8 L328.5 311.5 L340.5 302.5 L349.5 293.2 L355.5 285 L361.8 270.5 L365.8 252.8 L366.5 243.5 L366.2 205 L284.8 194 L250.2 186 L194.5 171 L170.8 164 L145.5 155 L91.8 132 L86.2 128.8 L83.8 126.2Z", "M196 198.8 L197.8 197.8 L207.8 197.5 L227 199 L234.8 200.8 L242.8 204.8 L249 210.5 L253 218.8 L253 230 L250 237.2 L242.5 244.8 L230.8 250 L214.8 252.8 L196.2 252.5Z", "M988.8 25.8 L935 42.8 L935 43.8 L950 54.8 L949.5 56 L937 66.2 L936.2 70.2 L937.2 72.2 L940.5 74.5 L945 73.8 L957.5 62 L966 76.5 L967.5 77.2Z", "M0 82.2 L35.5 96.5 L131.8 126.8 L177.8 139.5 L217.8 148.8 L273 158.8 L337.8 167.8 L400 173.8 L462.8 176.8 L518 176.5 L567 173.8 L622 167.8 L696 155.8 L765.5 140.8 L820.2 126.5 L846.5 117.8 L875.2 106.8 L920.8 86.5 L919.8 86 L901.5 92 L839 109.8 L776.5 123.5 L775 123 L775 82 L775.8 81.2 L869.8 81 L870 1.2 L869 0.2 L555.2 0.5 L555.2 81.2 L648.5 81.2 L649.5 82.2 L649.2 144 L645.8 145 L606.8 149 L558 152.5 L521.5 153.2 L520.8 152.5 L519.8 1 L519 0.2 L398.8 0.8 L397.2 107.2 L397.5 151.5 L396.8 152 L339.8 147 L336.5 146 L342.5 138.5 L347.8 128.2 L350.8 118.5 L352.8 105.8 L353 90 L351.8 76.8 L349.5 65.8 L345.8 54.5 L340.8 44.8 L333.8 35 L325.2 26.2 L317.2 20 L307.2 14 L298.2 10 L286 6 L273.8 3.2 L246 0 L137 0 L83.5 1.2 L83.2 105.5 L82.5 106.2 L56.2 99 L10.5 84 L1.8 81.8Z", "M196.5 79.5 L204 79 L223.5 80.8 L229 82.8 L235.8 87.8 L239.8 94.5 L240.8 99.2 L240.8 106 L238 115 L233.2 121 L228.8 123.8 L219.8 125.8 L195.8 125.5 L195.8 80.2Z"];

  var DAY = 864e5, Y0 = Date.UTC(2000, 2, 21); /* mốc 21/03 = đầu cung Bạch Dương */
  function zkey(m, d) { var k = (Date.UTC(2000, m - 1, d) - Y0) / DAY; return k < 0 ? k + 366 : k; }
  var SIGNS = [
    ["♈", "Bạch Dương", 3, 21], ["♉", "Kim Ngưu", 4, 20], ["♊", "Song Tử", 5, 21], ["♋", "Cự Giải", 6, 21],
    ["♌", "Sư Tử", 7, 23], ["♍", "Xử Nữ", 8, 23], ["♎", "Thiên Bình", 9, 23], ["♏", "Thiên Yết", 10, 23],
    ["♐", "Nhân Mã", 11, 22], ["♑", "Ma Kết", 12, 22], ["♒", "Bảo Bình", 1, 20], ["♓", "Song Ngư", 2, 19]
  ].map(function (s) { return { glyph: s[0], name: s[1], key: zkey(s[2], s[3]) }; });
  function zodiacOf(k) { var s = SIGNS[0]; SIGNS.forEach(function (x) { if (k >= x.key) s = x; }); return s; }
  function fold(s) { return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase(); }
  function pad(n) { return String(n).padStart(2, "0"); }

  function parse(text) {
    var out = [], bad = 0;
    text.replace(/^\uFEFF/, "").split(/\r?\n/).forEach(function (line, i) {
      line = line.trim(); if (!line) return;
      var c = line.lastIndexOf(",");
      var m = c > 0 && line.slice(c + 1).replace(/"/g, "").trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!m) { if (i) bad++; return; } /* dòng đầu là tiêu đề */
      var name = line.slice(0, c).replace(/^"|"$/g, "").trim(), d = +m[1], mo = +m[2];
      if (!name || new Date(Date.UTC(2000, mo - 1, d)).getUTCMonth() !== mo - 1) { bad++; return; }
      var k = zkey(mo, d);
      out.push({ name: name, dob: pad(d) + "/" + pad(mo) + "/" + m[3], key: k, sign: zodiacOf(k), fold: fold(name) });
    });
    if (bad) console.warn("[starmap] bỏ qua " + bad + " dòng CSV không hợp lệ");
    /* thứ tự chòm sao: từ 21/03 đi hết một vòng hoàng đạo */
    out.sort(function (a, b) { return a.key - b.key || a.name.localeCompare(b.name, "vi"); });
    return out;
  }

  async function load() {
    var emb = document.getElementById("starmap-csv"); /* dữ liệu nhúng sẵn lúc build, không cần fetch */
    if (emb && emb.textContent.trim()) { var u = parse(emb.textContent); if (u.length) return u; }
    var r = await fetch("assets/data/Danh_sach_sinh_nhat.csv", { cache: "no-cache" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    var users = parse(await r.text());
    if (!users.length) throw new Error("CSV trống hoặc sai định dạng");
    return users;
  }

  function mk(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function $(id) { return document.getElementById(id); }
  function rnd(i, a, b) { return ((i * a + b) % 997) / 997; }

  function build(users) {
    var svg = $("starmap-svg"), btn = $("toggleShapeBtn"), input = $("starSearch"),
        list = $("starResults"), info = $("starInfo");
    var galaxy = false, picked = null, stars = [];

    svg.innerHTML =
      '<defs>' + [["w","#ffffff","#9fdcff"],["b","#bfe3ff","#4aa8ff"],["y","#fff1c9","#ffc766"]].map(function (c) {
        return '<radialGradient id="sm-g-' + c[0] + '"><stop offset="0" stop-color="' + c[1] + '" stop-opacity="1"/><stop offset=".1" stop-color="' + c[1] + '" stop-opacity=".7"/><stop offset=".3" stop-color="' + c[2] + '" stop-opacity=".22"/><stop offset=".6" stop-color="' + c[2] + '" stop-opacity=".06"/><stop offset="1" stop-color="' + c[2] + '" stop-opacity="0"/></radialGradient>' +
          '<g id="star-' + c[0] + '"><circle r="16" fill="url(#sm-g-' + c[0] + ')"/><circle class="star-shape" r="2.1" fill="' + c[1] + '"/></g>';
      }).join("") + '<radialGradient id="sm-neb-a"><stop offset="0" stop-color="#4b7bff" stop-opacity=".22"/><stop offset="1" stop-color="#4b7bff" stop-opacity="0"/></radialGradient><radialGradient id="sm-neb-b"><stop offset="0" stop-color="#b05cff" stop-opacity=".18"/><stop offset="1" stop-color="#b05cff" stop-opacity="0"/></radialGradient><radialGradient id="sm-neb-c"><stop offset="0" stop-color="#2fd6ff" stop-opacity=".14"/><stop offset="1" stop-color="#2fd6ff" stop-opacity="0"/></radialGradient><linearGradient id="sm-tail"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient><filter id="sm-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2"/></filter></defs>';
    var gNeb = mk("g", { class: "sm-nebula" }, svg);
    [["a", 300, 130, 360, 170], ["b", 720, 210, 400, 190], ["c", 500, 90, 300, 120]].forEach(function (n) {
      mk("ellipse", { cx: n[1], cy: n[2], rx: n[3], ry: n[4], fill: "url(#sm-neb-" + n[0] + ")" }, gNeb);
    });
    [[80, 20, 0], [620, 5, 7]].forEach(function (m) { /* sao băng */
      mk("line", { class: "sm-meteor", x1: m[0] - 70, y1: m[1] - 28, x2: m[0], y2: m[1], stroke: "url(#sm-tail)", "stroke-width": 1.6, "stroke-linecap": "round", style: "animation-delay:" + m[2] + "s" }, svg);
    });
    var gBg = mk("g", { class: "sm-dust" }, svg), gOut = mk("g", { filter: "url(#sm-blur)", opacity: ".9" }, svg), gStars = mk("g", {}, svg);
    for (var q = 0; q < 170; q++) { /* bụi sao nền: chỉ là những chấm sáng mờ */
      mk("circle", { cx: (VB.x + rnd(q, 6151, 3) * VB.w).toFixed(1), cy: (VB.y + rnd(q, 7727, 11) * VB.h).toFixed(1),
        r: (0.4 + rnd(q, 13, 1) * 1.1).toFixed(2), fill: q % 5 ? "#cfe8ff" : "#ffe9b8",
        style: "--d:" + (rnd(q, 29, 3) * 4).toFixed(1) + "s;--o:" + (0.25 + rnd(q, 53, 9) * 0.5).toFixed(2) }, gBg);
    }

    /* chia số ngôi sao theo chu vi từng nét logo (phương pháp phần dư lớn nhất) */
    var cs = LOGO.map(function (d) {
      var p = mk("path", { class: "logo-path", d: d }, gOut), b = p.getBBox();
      return { p: p, len: p.getTotalLength(), x: b.x, y: b.y };
    }).sort(function (a, b) { return a.x - b.x || a.y - b.y; });
    var total = cs.reduce(function (s, c) { return s + c.len; }, 0), N = users.length;
    cs.forEach(function (c) { var q = N * c.len / total; c.n = Math.floor(q); c.r = q - c.n; });
    var left = N - cs.reduce(function (s, c) { return s + c.n; }, 0);
    cs.slice().sort(function (a, b) { return b.r - a.r; }).slice(0, left).forEach(function (c) { c.n++; });

    /* tooltip khi rê chuột */
    var tip = document.createElement("div");
    tip.className = "star-tooltip"; tip.setAttribute("aria-hidden", "true");
    document.body.appendChild(tip);

    var idx = 0;
    cs.forEach(function (c) {
      for (var j = 0; j < c.n; j++, idx++) {
        var pt = c.p.getPointAtLength((j + 0.5) * c.len / c.n);
        addStar(users[idx], idx, pt.x, pt.y);
      }
    });

    function addStar(u, i, x, y) {
      var g = mk("g", { class: "star-group", tabindex: 0, role: "button",
        "aria-label": u.name + ", sinh " + u.dob + ", cung " + u.sign.name }, gStars);
      var st = { u: u, g: g, x: x, y: y, lx: x, ly: y,
        gx: VB.x + 16 + rnd(i, 7919, 13) * (VB.w - 32), gy: VB.y + 16 + rnd(i, 104729, 101) * (VB.h - 32) };
      u.st = st; stars.push(st);
      g.style.transform = "translate(" + x + "px," + y + "px)";
      mk("circle", { class: "star-hit", r: 15 }, g);
      var b = mk("g", { class: "star-body" }, g);
      mk("use", { href: "#star-" + ["w", "w", "b", "w", "y", "b"][i % 6], transform: "scale(" + (0.55 + Math.pow(rnd(i, 31, 7), 2) * 1.1).toFixed(2) + ")",
        style: "--d:" + (rnd(i, 17, 5) * 3).toFixed(1) + "s" }, b);
      g.addEventListener("pointerenter", function (e) {
        if (e.pointerType !== "mouse") return;
        tip.innerHTML = "";
        var h = document.createElement("h4"); h.textContent = u.name;
        var p = document.createElement("p"); p.textContent = "Ngày sinh: " + u.dob;
        var z = document.createElement("div"); z.className = "zodiac-tag"; z.textContent = u.sign.glyph + " " + u.sign.name;
        tip.append(h, p, z); tip.style.opacity = "1";
      });
      g.addEventListener("pointermove", function (e) { tip.style.left = e.clientX + "px"; tip.style.top = (e.clientY - 22) + "px"; });
      g.addEventListener("pointerleave", function () { tip.style.opacity = "0"; });
      g.addEventListener("click", function () { pick(st); });
      g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(st); } });
    }

    function showInfo(u) {
      info.innerHTML = "";
      var h = document.createElement("strong"); h.textContent = u.name;
      var p = document.createElement("span");
      p.textContent = "Sinh ngày " + u.dob + " · Cung " + u.sign.glyph + " " + u.sign.name +
        " · Ngôi sao thứ " + (users.indexOf(u) + 1) + "/" + users.length;
      info.append(h, p); info.classList.add("has-pick");
    }

    function placeLabel(st) {
      var lab = st.g.querySelector(".star-label"); if (!lab) return;
      var W = svg.getBoundingClientRect().width, k = W / VB.w, w = +lab.dataset.w,
          sx = (st.x - VB.x) * k, sy = (st.y - VB.y) * k,
          dx = (sx + 18 + w < W) ? 18 : -18 - w, dy = sy > 56 ? -44 : 16;
      lab.setAttribute("transform", "scale(" + (1 / k).toFixed(4) + ") translate(" + dx + " " + dy + ")");
    }

    function pick(st, scroll) {
      if (picked) { picked.g.classList.remove("is-picked"); picked.g.querySelectorAll(".star-ring,.star-label").forEach(function (n) { n.remove(); }); }
      picked = st; st.g.classList.add("is-picked"); gStars.appendChild(st.g);
      var ring = mk("g", { class: "star-ring-wrap" }, st.g); mk("circle", { class: "star-ring", r: 12 }, ring);
      var lab = mk("g", { class: "star-label" }, st.g), rect = mk("rect", { rx: 6, height: 28 }, lab),
          t = mk("text", { x: 10, y: 19 }, lab);
      t.textContent = st.u.name;
      var w = Math.ceil(t.getComputedTextLength()) + 20; rect.setAttribute("width", w); lab.dataset.w = w;
      placeLabel(st); showInfo(st.u);
      if (scroll) svg.parentNode.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    window.addEventListener("resize", function () { if (picked) placeLabel(picked); });

    /* nút chuyển chế độ logo <-> dải ngân hà */
    btn.disabled = false; btn.textContent = "Xem dải ngân hà BIT";
    btn.addEventListener("click", function () {
      galaxy = !galaxy; svg.classList.toggle("is-galaxy", galaxy);
      btn.textContent = galaxy ? "Tụ hợp thành logo BIT" : "Xem dải ngân hà BIT";
      stars.forEach(function (s) {
        s.x = galaxy ? s.gx : s.lx; s.y = galaxy ? s.gy : s.ly;
        s.g.style.transform = "translate(" + s.x + "px," + s.y + "px)";
      });
      if (picked) placeLabel(picked);
    });

    /* tìm tên: gợi ý ngay khi gõ, không cần gõ dấu */
    input.disabled = false;
    var res = [], act = -1;
    function close() { list.hidden = true; input.setAttribute("aria-expanded", "false"); }
    function choose(u) { input.value = u.name; close(); pick(u.st, true); }
    function mark() { Array.prototype.forEach.call(list.children, function (li, j) { li.setAttribute("aria-selected", j === act); }); }
    function render() {
      var q = fold(input.value.trim()); list.innerHTML = "";
      if (!q) { close(); return; }
      res = users.filter(function (u) { return u.fold.indexOf(q) > -1; }).slice(0, 8); act = res.length ? 0 : -1;
      if (!res.length) { var e = document.createElement("li"); e.className = "is-empty"; e.textContent = "Không tìm thấy. Thử gõ tên riêng của bạn (ví dụ: An)."; list.appendChild(e); }
      res.forEach(function (u) {
        var li = document.createElement("li"), a = document.createElement("span"), s = document.createElement("small");
        li.setAttribute("role", "option"); a.textContent = u.name; s.textContent = u.sign.glyph + " " + u.dob.slice(0, 5);
        li.append(a, s); li.addEventListener("mousedown", function (ev) { ev.preventDefault(); choose(u); }); list.appendChild(li);
      });
      mark(); list.hidden = false; input.setAttribute("aria-expanded", "true");
    }
    input.addEventListener("input", render);
    input.addEventListener("blur", close);
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" && res.length) { e.preventDefault(); act = (act + 1) % res.length; mark(); }
      else if (e.key === "ArrowUp" && res.length) { e.preventDefault(); act = (act - 1 + res.length) % res.length; mark(); }
      else if (e.key === "Enter" && act > -1 && !list.hidden) { e.preventDefault(); choose(res[act]); }
      else if (e.key === "Escape") close();
    });
  }

  function start() {
    var loading = $("starmapLoading"), text = $("loadingText");
    if (!$("starmap-svg")) return;
    load().then(function (users) { build(users); loading.hidden = true; })
      .catch(function (err) {
        console.error("[starmap]", err);
        text.textContent = "Không tải được dữ liệu bản đồ sao. Hãy tải lại trang hoặc kiểm tra file CSV.";
        loading.classList.add("is-error");
      });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();