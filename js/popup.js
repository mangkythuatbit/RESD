"use strict";

/**
 * Pop-up thông báo toàn cổng R.E.S.D & Góp ý phỏng vấn (Chung một luồng)
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

  // URL nhận dữ liệu Google Sheets
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyvZS4y1IKz0aWCL4W-z05jJpNSxYUP7hsskMmwgXX2td3C5DU7mr0t6fBhzfcwwTkt/exec';

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
      title: "Cảm ơn bạn đã đến với BIT",
      paragraphs: [
        "Chúc mừng bạn đã hoàn thành bước chân đầu tiên trên hành trình chinh phục thử thách mới tại BIT! Sự nhiệt tình và năng lượng thanh xuân từ bạn chính là nguồn động lực lớn cho chúng mình trên chặng đường đồng hành cùng nhau sắp tới.",
        "Những chia sẻ hôm nay của bạn giúp chúng mình hiểu hơn về con người và cá tính của bạn, vì chúng ta là một đôi ngũ, và BIT là một gia đình. Hãy cùng nhau tạo nên những giá trị tuyệt vời trong tương lai nhé",
        "Cho dù thế nào hãy giữ vững ngọn lửa tự tin này bạn nhé, vì \"Even if you miss, you will still live among the bestITers\", dẫu có chút lỡ hẹn, bạn vẫn luôn là một phần của thế hệ sinh viên BIT đầy bản lĩnh và tự hào. Hẹn sớm đi cùng bạn trong chặng hành trình tiếp theo cùng BIT!",
      ],
         cta: {
    text: 'Tìm hiểu về BIT',
    href: 'https://facebook.com/BIT.UEH', // Thay link Fanpage của bạn vào đây
  },
    },
    closed: {
      tone: "closed",
      icon: ICON_STAR,
      title: "Cảm ơn bạn đã đến với BIT",
      paragraphs: [
        "Chúc mừng bạn đã hoàn thành bước chân đầu tiên trên hành trình chinh phục thử thách mới tại BIT! Sự nhiệt tình và năng lượng thanh xuân từ bạn chính là nguồn động lực lớn cho chúng mình trên chặng đường đồng hành cùng nhau sắp tới.",
        "Những chia sẻ hôm nay của bạn giúp chúng mình hiểu hơn về con người và cá tính của bạn, vì chúng ta là một đôi ngũ, và BIT là một gia đình. Hãy cùng nhau tạo nên những giá trị tuyệt vời trong tương lai nhé",
        "Cho dù thế nào hãy giữ vững ngọn lửa tự tin này bạn nhé, vì \"Even if you miss, you will still live among the bestITers\", dẫu có chút lỡ hẹn, bạn vẫn luôn là một phần của thế hệ sinh viên BIT đầy bản lĩnh và tự hào. Hẹn sớm đi cùng bạn trong chặng hành trình tiếp theo cùng BIT!",
      ],
        cta: {
        text: 'Tìm hiểu về BIT',
        href: 'https://facebook.com/BIT.UEH', // Thay link Fanpage của bạn vào đây
    },
    },
  };

  /* --- HTML Form Đánh giá --- */
  const FEEDBACK_FORM_HTML = `
    <div id="feedbackSection" style="display: none; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--resd-line); text-align: left;">
      <h3 style="margin: 0 0 10px; font-size: 1.1rem; color: var(--resd-cyan);">Cảm ơn bạn đã chia sẻ cùng BIT</h3>
      <p style="margin: 0 0 16px; color: var(--resd-muted); font-size: .9rem;">Hãy để lại đánh giá và góp ý để BIT ngày càng hoàn thiện hơn nhé!</p>
      <form id="interviewFeedbackForm">
        <div class="form-group">
          <label style="display: block; margin-bottom: 6px; font-weight: 600; color: var(--resd-text); font-size: .9rem;">Đánh giá buổi phỏng vấn</label>
          <div class="star-rating" style="display: flex; flex-direction: row-reverse; justify-content: flex-end; gap: 6px;">
            <input type="radio" name="rating" value="5" id="star5" required style="display: none;"><label for="star5" title="Tuyệt vời" style="font-size: 1.6rem; color: var(--resd-line-strong); cursor: pointer; transition: color 0.2s ease, transform 0.2s ease;">★</label>
            <input type="radio" name="rating" value="4" id="star4" style="display: none;"><label for="star4" title="Tốt" style="font-size: 1.6rem; color: var(--resd-line-strong); cursor: pointer; transition: color 0.2s ease, transform 0.2s ease;">★</label>
            <input type="radio" name="rating" value="3" id="star3" style="display: none;"><label for="star3" title="Bình thường" style="font-size: 1.6rem; color: var(--resd-line-strong); cursor: pointer; transition: color 0.2s ease, transform 0.2s ease;">★</label>
            <input type="radio" name="rating" value="2" id="star2" style="display: none;"><label for="star2" title="Tệ" style="font-size: 1.6rem; color: var(--resd-line-strong); cursor: pointer; transition: color 0.2s ease, transform 0.2s ease;">★</label>
            <input type="radio" name="rating" value="1" id="star1" style="display: none;"><label for="star1" title="Rất tệ" style="font-size: 1.6rem; color: var(--resd-line-strong); cursor: pointer; transition: color 0.2s ease, transform 0.2s ease;">★</label>
          </div>
        </div>
        <div class="form-group" style="margin-top: 14px;">
          <label style="display: block; margin-bottom: 6px; font-weight: 600; color: var(--resd-text); font-size: .9rem;">Góp ý của bạn</label>
          <textarea name="comment" rows="3" placeholder="Chia sẻ cảm nghĩ hoặc góp ý..." style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--resd-line-strong); background: rgba(11, 30, 52, 0.5); color: var(--resd-text); font-family: inherit; font-size: .9rem; resize: vertical; box-sizing: border-box;"></textarea>
        </div>
        <div id="feedbackMessage" style="display: none; margin-top: 10px; font-size: .85rem; color: var(--resd-cyan);"></div>
        <div style="display: flex; gap: 10px; margin-top: 16px;">
           <button type="button" id="cancelFeedbackBtn" class="btn-ghost" style="flex: 1; padding: 10px; justify-content: center;">Hủy</button>
           <button type="submit" id="submitFeedbackBtn" class="btn-gem" style="flex: 1; padding: 10px; justify-content: center;">Gửi đánh giá</button>
        </div>
      </form>
    </div>
  `;

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
    footer.style.display = 'flex';
    footer.style.flexWrap = 'wrap';
    footer.style.gap = '10px';
    footer.style.alignItems = 'center';

    if (CFG.fanpageUrl) {
      const cta = el("a", "btn-gem resd-popup__cta", data.cta.text || data.cta);
      cta.href = CFG.fanpageUrl;
      cta.target = "_blank";
      cta.rel = "noopener";
      // Bỏ set cứng 100% để nút có thể đứng cạnh nút Góp ý
      cta.style.width = 'auto'; 
      cta.style.flex = '1';
      footer.appendChild(cta);
    }
    
    // Nút mở form góp ý
    const feedbackBtn = el("button", "btn-ghost", "Góp ý phỏng vấn");
    feedbackBtn.type = "button";
    feedbackBtn.style.flex = '1';
    feedbackBtn.style.justifyContent = 'center';
    feedbackBtn.style.padding = '14px 22px';
    feedbackBtn.addEventListener("click", () => {
        const fbSection = document.getElementById('feedbackSection');
        if (fbSection.style.display === 'none') {
            fbSection.style.display = 'block';
            scroller.scrollTop = scroller.scrollHeight; // Cuộn xuống phần form
            feedbackBtn.style.display = 'none'; // Ẩn nút góp ý khi form đã mở
        }
    });
    footer.appendChild(feedbackBtn);

    if (footer.childNodes.length) scroller.appendChild(footer);
    
    // Thêm khối Form Góp ý (ẩn mặc định)
    scroller.insertAdjacentHTML('beforeend', FEEDBACK_FORM_HTML);

    card.append(closeBtn, scroller);
    overlay.appendChild(card);

    overlay.addEventListener("mousedown", (event) => {
      if (event.target === overlay) close();
    });
    return overlay;
  }

  function bindFeedbackFormEvents() {
    const feedbackForm = document.getElementById('interviewFeedbackForm');
    const feedbackMsg = document.getElementById('feedbackMessage');
    const cancelBtn = document.getElementById('cancelFeedbackBtn');
    const fbSection = document.getElementById('feedbackSection');
    const originalFeedbackBtn = root.querySelector('button.btn-ghost');

    if (!feedbackForm) return;

    // Xử lý nút Hủy
    cancelBtn.addEventListener('click', () => {
        fbSection.style.display = 'none';
        if (originalFeedbackBtn) originalFeedbackBtn.style.display = 'inline-flex';
        feedbackForm.reset();
        const checkedStar = feedbackForm.querySelector('input[type="radio"]:checked');
        if(checkedStar) checkedStar.checked = false;
        feedbackMsg.style.display = 'none';
    });

    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(feedbackForm);
        const data = {
            rating: formData.get('rating'),
            comment: formData.get('comment')
        };

        const btnSubmit = document.getElementById('submitFeedbackBtn');
        btnSubmit.textContent = 'Đang gửi...';
        btnSubmit.disabled = true;

        try {
            const urlEncodedData = new URLSearchParams(data);

            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', 
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlEncodedData
            });

            feedbackMsg.textContent = 'Cảm ơn bạn đã gửi đánh giá!';
            feedbackMsg.style.display = 'block';
            feedbackMsg.style.color = 'var(--resd-cyan)';
            feedbackForm.reset();
            
            const checkedStar = feedbackForm.querySelector('input[type="radio"]:checked');
            if(checkedStar) checkedStar.checked = false;

            // Đóng toàn bộ popup sau khi gửi xong
            setTimeout(close, 2000);
            
        } catch (error) {
            feedbackMsg.textContent = 'Đã có lỗi xảy ra, vui lòng thử lại.';
            feedbackMsg.style.display = 'block';
            feedbackMsg.style.color = '#ff8fa3';
        } finally {
            setTimeout(() => {
                btnSubmit.textContent = 'Gửi đánh giá';
                btnSubmit.disabled = false;
            }, 2500);
        }
    });
  }

  function onKey(event) {
    if (!root) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const items = root.querySelectorAll("button, a[href], input, textarea");
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
    
    // Thêm CSS xử lý hover của rating stars
    if (!document.getElementById('feedback-rating-styles')) {
        const style = document.createElement('style');
        style.id = 'feedback-rating-styles';
        style.textContent = `
          .star-rating label:hover,
          .star-rating label:hover ~ label,
          .star-rating input:checked ~ label {
            color: #ffd76a !important;
          }
          .star-rating label:hover {
            transform: scale(1.1);
          }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(root);
    document.body.classList.add("has-resd-popup");
    document.addEventListener("keydown", onKey, true);
    
    bindFeedbackFormEvents();
    
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