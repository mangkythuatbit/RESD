"use strict";

/**
 * Riêng cho Trang chủ: tương tác với khối nhận diện R.E.S.D trong Hero.
 * Các hành vi dùng chung nằm ở js/site.js.
 */
(function () {
  const exploreButton = document.querySelector("#explore-button");
  const planet = document.querySelector("#resd-planet");
  let exploreTimer;

  exploreButton?.addEventListener("click", () => {
    if (!planet) return;
    clearTimeout(exploreTimer);
    planet.classList.add("is-exploring");
    planet.focus({ preventScroll: true });
    exploreTimer = setTimeout(() => planet.classList.remove("is-exploring"), 1800);
  });
})();
document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector(".planet-scene");
  const gems = document.querySelectorAll(".planet-scene .gem");
  if (!scene) return;

  // ==============================================================
  // 1. HIỆU ỨNG HÀNH TINH TỰ QUAY (AXIAL ROTATION)
  // ==============================================================
  // Dùng JS tiêm một đoạn CSS nhỏ để di chuyển bề mặt hành tinh, 
  // tạo ảo giác tự quay mà không làm lộn chữ hay sai hướng ánh sáng.
  const dynamicStyles = document.createElement("style");
  dynamicStyles.innerHTML = `
    @keyframes planet-surface-spin {
      0% { background-position: 0px 0px; }
      100% { background-position: -800px 0px; } /* Trượt các đường vân ngang */
    }
    .planet-scene .planet::before {
      animation: planet-surface-spin 20s linear infinite;
    }
    /* Đảm bảo chữ luôn nổi lên trên bề mặt đang quay */
    .planet-scene .planet-wordmark,
    .planet-scene .planet-caption {
      position: relative;
      z-index: 2;
    }
  `;
  document.head.appendChild(dynamicStyles);

  // ==============================================================
  // 2. HIỆU ỨNG 4 VIÊN ĐÁ QUAY QUANH HÀNH TINH
  // ==============================================================
  if (!gems.length) return;

  // Xóa bỏ các thuộc tính định vị tĩnh bị fix cứng trong CSS cũ
  gems.forEach(gem => {
    gem.style.right = "auto";
    gem.style.bottom = "auto";
  });

  // Thông số cấu hình quỹ đạo
  const radiusX = 45; // Bán kính trục ngang (45%)
  const radiusY = 45 * 0.84; // Bán kính trục dọc 
  const tiltAngle = -28 * (Math.PI / 180); // Độ nghiêng mặt phẳng quỹ đạo
  const cycleDuration = 20000; // 20 giây cho 1 chu kỳ

  let startTime = null;
  let isPaused = false;
  let lastTimestamp = 0;

  // Tính năng: Tạm dừng quỹ đạo đá khi di chuột vào khối (để dễ click)
  scene.addEventListener("mouseenter", () => (isPaused = true));
  scene.addEventListener("mouseleave", () => (isPaused = false));

  function animateOrbit(timestamp) {
    if (!startTime) startTime = timestamp;

    // Nếu đang hover, ngừng cộng dồn thời gian để đá đứng im
    if (isPaused) {
      startTime += timestamp - lastTimestamp;
    }
    lastTimestamp = timestamp;

    const progress = ((timestamp - startTime) % cycleDuration) / cycleDuration;
    const t = progress * 2 * Math.PI;

    gems.forEach((gem, index) => {
      // Chia đều 4 viên đá ra 4 góc
      const phaseOffset = index * (Math.PI / 2);
      const currentT = t + phaseOffset;

      // Tính toạ độ X, Y trên elip 2D phẳng
      const x = radiusX * Math.cos(currentT);
      const y = radiusY * Math.sin(currentT);

      // Xoay toạ độ để tạo độ nghiêng 3D
      const rotatedX = x * Math.cos(tiltAngle) - y * Math.sin(tiltAngle);
      const rotatedY = x * Math.sin(tiltAngle) + y * Math.cos(tiltAngle);

      // Áp dụng vị trí
      gem.style.left = `calc(50% + ${rotatedX}%)`;
      gem.style.top = `calc(50% + ${rotatedY}%)`;

      // Khử góc xoay gốc của CSS để label chữ cái luôn đứng thẳng
      gem.style.transform = "translate(-50%, -50%)";

      // Xử lý chiều sâu 3D (Đá lặn ra sau lưng hành tinh ở nửa vòng sau)
      if (y > 0) {
        gem.style.zIndex = "3"; // Nổi lên trước
      } else {
        gem.style.zIndex = "-1"; // Lặn ra sau
      }
    });

    requestAnimationFrame(animateOrbit);
  }

  requestAnimationFrame(animateOrbit);
});
