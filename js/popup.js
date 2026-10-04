"use strict";

/**
 * Pop-up thông báo toàn cổng R.E.S.D
 * Thứ tự nạp: config.js -> site.js -> popup.js -> (main.js | test-dinh-huong.js)
 *
 * Trạng thái:
 *  - localStorage "has_submitted" === "true"  -> lời cảm ơn (đã nộp đơn)
 *  - còn lại                                  -> thông báo cổng đã đóng
 *  - sessionStorage "resd_popup_dismissed"    -> người dùng đã bấm đóng trong phiên này
 *
 * Tự phát hiện việc nộp form: iframe Google Form được nạp lần 1 là trang điền,
 * lần nạp thứ SUBMIT_LOAD_COUNT là trang "đã ghi nhận câu trả lời".
 */
(function () {
  const CFG = window.RESD_CONFIG || {};

  const SHOW_DELAY = 1000;          // ms sau khi trang tải xong
  const SUBMIT_LOAD_COUNT = 2;      // form 1 trang = 2. Form nhiều phần: tăng thêm (xem hướng dẫn)
  const SHOW_ON_SUBMIT = true;      // hiện lời cảm ơn ngay sau khi vừa nộp
  const SUBMIT_POPUP_DELAY = 1800;  // ms, để người dùng kịp thấy xác nhận của Google Form

  const KEY_SUBMITTED = "has_submitted";
  const KEY_DISMISSED = "resd_popup_dismissed";

  /* --- Storage an toàn (chế độ riêng tư có thể chặn) --------------------- */
  const safe = {
    get(area, key) { try { return window[area].getItem(key); } catch (e) { return null; } },
    set(area, key, value) { try { window[area].setItem(key, value); } catch (e) { /* bỏ qua */ } },
    remove(area, key) { try { window[area].removeItem(key); } catch (e) { /* bỏ qua */ } },
  };
  const hasSubmitted = () => safe.get("localStorage", KEY_SUBMITTED) === "true";

  /* --- Nội dung ---------------------------------------------------------- */
  const ICON_CHECK =
    '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const ICON_STAR =
    '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" opacity=".7"/></svg>';

  const CONTENT = {
    submitted: {
      tone: "success",
      icon: ICON_CHECK,
      title: "Cảm ơn bạn đã lựa chọn đồng hành cùng BIT!",
      paragraphs: [
        "Chúc mừng bạn đã hoàn thành bước chân đầu tiên trên hành trình chinh phục thử thách mới tại BIT! Sự nhiệt tình và năng lượng thanh xuân từ chiếc đơn của bạn chính là nguồn động lực lớn cho chúng mình trên chặng đường đồng hành cùng nhau sắp tới.",
        "Kết quả của đợt tuyển sẽ được bật mí trong vài ngày tới, hãy cùng chờ đón nhé.",
        "Giữ vững ngọn lửa tự tin này bạn nhé, vì \"Even if you miss, you will still live among the bestITers\", dẫu có chút lỡ hẹn, bạn vẫn luôn là một phần của thế hệ sinh viên BIT đầy bản lĩnh và tự hào.",
      ],
         cta: {
    text: 'Ghé thăm Fanpage BIT để tham quan và không bỏ lỡ các chương trình thú vị khác',
    href: 'https://facebook.com/BIT.UEH', // Thay link Fanpage của bạn vào đây
  },
    },
    closed: {
      tone: "closed",
      icon: ICON_STAR,
      title: "Oops, hành trình này có vẻ phải dừng ở đây rồi",
      paragraphs: [
        "Cổng đăng ký vòng CV của hành trình lần này đã chính thức khép lại. Dù bạn đã kịp ghi danh hay lỡ hẹn ở những giây cuối cùng, hãy tin rằng mỗi nỗ lực hướng về phía các vì sao đều là một trải nghiệm đáng giá.",
        "Cơ hội đồng hành cùng Đoàn - Hội vẫn luôn rộng mở ở những chặng đường phía trước. Hẹn gặp lại bạn tại những tọa độ rực rỡ hơn nhé!",
      ],
        cta: {
        text: 'Ghé thăm Fanpage BIT để tham quan và không bỏ lỡ các chương trình thú vị khác',
        href: 'https://facebook.com/BIT.UEH', // Thay link Fanpage của bạn vào đây
    },
    },
  };

  /* --- Dựng và điều khiển pop-up ---------------------------------------- */
  let root = null;
  let lastFocus = null;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function build(data) {
    const overlay = el("div", "resd-popup is-" + data.tone);
    overlay.setAttribute("data-resd-popup", "");

    const card = el("div", "resd-popup__card");
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-labelledby", "resd-popup-title");
    card.setAttribute("aria-describedby", "resd-popup-desc");
    card.tabIndex = -1;

    const closeBtn = el("button", "resd-popup__close");
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Đóng thông báo");
    closeBtn.innerHTML =
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    closeBtn.addEventListener("click", () => close());

    const scroller = el("div", "resd-popup__body");

    const badge = el("span", "resd-popup__badge");
    badge.setAttribute("aria-hidden", "true");
    badge.innerHTML = data.icon;

    const title = el("h2", "resd-popup__title", data.title);
    title.id = "resd-popup-title";

    const desc = el("div", "resd-popup__desc");
    desc.id = "resd-popup-desc";
    data.paragraphs.forEach((p) => desc.appendChild(el("p", "", p)));

    scroller.append(badge, title, desc);

    const footer = el("div", "resd-popup__footer");
    if (CFG.fanpageUrl) {
      const cta = el("a", "btn-gem resd-popup__cta", data.cta.text || data.cta);
      cta.href = CFG.fanpageUrl;
      cta.target = "_blank";
      cta.rel = "noopener";
      footer.appendChild(cta);
    }
    if (footer.childNodes.length) scroller.appendChild(footer);

    card.append(closeBtn, scroller);
    overlay.appendChild(card);

    overlay.addEventListener("mousedown", (event) => {
      if (event.target === overlay) close();
    });
    return overlay;
  }

  function onKey(event) {
    if (!root) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const items = root.querySelectorAll("button, a[href]");
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === root.firstChild)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function open() {
    if (root) return;
    lastFocus = document.activeElement;
    root = build(hasSubmitted() ? CONTENT.submitted : CONTENT.closed);
    document.body.appendChild(root);
    document.body.classList.add("has-resd-popup");
    document.addEventListener("keydown", onKey, true);
    root.firstChild.focus({ preventScroll: true });
  }

  function close(remember = true) {
    if (!root) return;
    const node = root;
    root = null;
    if (remember) safe.set("sessionStorage", KEY_DISMISSED, "1");
    document.removeEventListener("keydown", onKey, true);
    document.body.classList.remove("has-resd-popup");
    node.classList.add("is-closing");
    setTimeout(() => node.remove(), 160);
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus({ preventScroll: true });
  }

  /* --- Tự hiện khi vào trang -------------------------------------------- */
  function schedule() {
    if (safe.get("sessionStorage", KEY_DISMISSED) === "1") return;
    setTimeout(open, SHOW_DELAY);
  }
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });

  /* --- Phát hiện nộp form qua iframe ------------------------------------ */
  function markSubmitted() {
    safe.set("localStorage", KEY_SUBMITTED, "true");
    safe.remove("sessionStorage", KEY_DISMISSED);
    if (SHOW_ON_SUBMIT) setTimeout(open, SUBMIT_POPUP_DELAY);
  }

  const watched = new WeakSet();

  function isFormFrame(frame) {
    const src = frame.getAttribute("src") || "";
    return src.indexOf("docs.google.com/forms") !== -1 || (CFG.formEmbedUrl && src === CFG.formEmbedUrl);
  }

  function watch(frame) {
    if (watched.has(frame)) return;
    watched.add(frame);
    let loads = 0;
    frame.addEventListener("load", () => {
      if (!isFormFrame(frame)) return;
      loads += 1;
      if (loads === SUBMIT_LOAD_COUNT) markSubmitted();
    });
  }

  function scan(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.tagName === "IFRAME") watch(node);
    node.querySelectorAll("iframe").forEach(watch);
  }

  scan(document.body);
  new MutationObserver((records) => {
    records.forEach((r) => r.addedNodes.forEach(scan));
  }).observe(document.documentElement, { childList: true, subtree: true });

  /* Dùng khi cần gọi tay (ví dụ kiểm thử trong Console). */
  window.RESD_POPUP = { open, close, markSubmitted };
})();