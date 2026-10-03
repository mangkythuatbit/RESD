document.addEventListener("DOMContentLoaded", async () => {
    // ==========================================
    // 1. TẠO TOOLTIP ĐỘNG KHÔNG BỊ CHE KHUẤT
    // ==========================================
    const tooltip = document.createElement("div");
    tooltip.className = "star-tooltip"; // Sẽ dùng CSS đã cấp ở bước trước
    tooltip.innerHTML = `
        <h4 id="tt-name">Tên Nhân Sự</h4>
        <p><span>Ngày sinh:</span> <strong id="tt-dob"></strong></p>
        <div class="zodiac-tag" id="tt-zodiac"></div>
    `;
    // Thêm thẳng vào body để tránh lỗi overflow: hidden của container
    document.body.appendChild(tooltip);

    const ttName = tooltip.querySelector('#tt-name');
    const ttDob = tooltip.querySelector('#tt-dob');
    const ttZodiac = tooltip.querySelector('#tt-zodiac');

    // Các thành phần DOM
    const starsContainer = document.getElementById('stars-container');
    const paths = document.querySelectorAll('.logo-path');
    const btnToggle = document.getElementById('toggleShapeBtn');
    const loadingOverlay = document.getElementById('starmapLoading');
    
    let isGalaxyMode = false;
    let allStarElements = [];

    // ==========================================
    // 2. HÀM TÍNH CUNG HOÀNG ĐẠO (Giữ nguyên logic của bạn)
    // ==========================================
    function getZodiacSign(day, month) {
        if ((month == 1 && day <= 19) || (month == 12 && day >= 22)) return "Ma Kết (Capricorn)";
        if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Bảo Bình (Aquarius)";
        if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "Song Ngư (Pisces)";
        if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Bạch Dương (Aries)";
        if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Kim Ngưu (Taurus)";
        if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Song Tử (Gemini)";
        if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cự Giải (Cancer)";
        if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Sư Tử (Leo)";
        if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Xử Nữ (Virgo)";
        if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Thiên Bình (Libra)";
        if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Thiên Yết (Scorpio)";
        if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Nhân Mã (Sagittarius)";
        return "Tinh tú ẩn danh";
    }

    // ==========================================
    // 3. ĐỌC VÀ XỬ LÝ DỮ LIỆU CSV (Bổ sung tính năng Sort)
    // ==========================================
    async function loadUserData() {
        try {
            const response = await fetch('assets/data/Danh_sach_sinh_nhat.csv');
            const data = await response.text();
            const rows = data.split('\n');
            const users = [];

            for (let i = 1; i < rows.length; i++) {
                const cols = rows[i].split(',');
                if (cols.length >= 2 && cols[0].trim() !== '') {
                    const name = cols[0].trim();
                    const dob = cols[1].trim();
                    const [day, month] = dob.split('/');
                    users.push({
                        name: name,
                        dob: dob,
                        day: parseInt(day),
                        month: parseInt(month),
                        zodiac: getZodiacSign(parseInt(day), parseInt(month))
                    });
                }
            }
            // QUAN TRỌNG: Sắp xếp danh sách theo Ngày/Tháng sinh chuẩn Chòm sao
            users.sort((a, b) => a.month !== b.month ? a.month - b.month : a.day - b.day);
            return users;
            
        } catch (e) {
            console.warn("Không tìm thấy file CSV. Khởi tạo dữ liệu mẫu...");
            let fallbackUsers = Array.from({length: 150}).map((_, i) => {
                const d = (i % 28) + 1;
                const m = (i % 12) + 1;
                return {
                    name: `Thành viên BIT ${i+1}`,
                    dob: `${d.toString().padStart(2,'0')}/${m.toString().padStart(2,'0')}/2004`,
                    day: d, month: m,
                    zodiac: getZodiacSign(d, m)
                }
            });
            fallbackUsers.sort((a, b) => a.month !== b.month ? a.month - b.month : a.day - b.day);
            return fallbackUsers;
        }
    }

    // ==========================================
    // 4. HÀM KHỞI TẠO BẢN ĐỒ SAO
    // ==========================================
    async function init() {
        const users = await loadUserData();
        
        // Tính tổng chiều dài của tất cả các nét vẽ Logo (B, I, T, Mũi tên)
        let totalLength = 0;
        let pathLengths = [];
        paths.forEach(path => {
            const len = path.getTotalLength();
            totalLength += len;
            pathLengths.push(len);
        });

        // Tính khoảng cách đều đặn giữa các nhân sự trên đường Path
        const distancePerStar = totalLength / users.length;
        let currentPathIndex = 0;
        let currentLengthOnPath = 0;

        users.forEach((user) => {
            // Xác định ngôi sao này nằm ở Path nào (chữ B, I hay T,...)
            let path = paths[currentPathIndex];
            while (currentLengthOnPath > pathLengths[currentPathIndex] && currentPathIndex < paths.length - 1) {
                currentLengthOnPath -= pathLengths[currentPathIndex];
                currentPathIndex++;
                path = paths[currentPathIndex];
            }

            // Lấy Toạ độ Vector 100% chính xác
            const point = path.getPointAtLength(currentLengthOnPath);
            const logoX = point.x;
            const logoY = point.y;
            
            // Lấy Toạ độ Ngân hà (vị trí ngẫu nhiên lúc rã đông)
            const galaxyX = Math.random() * 1000;
            const galaxyY = Math.random() * 500;

            // Tạo cấu trúc SVG Ngôi sao
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttribute('class', 'star-group');
            group.style.transform = `translate(${logoX}px, ${logoY}px)`; // Vị trí mặc định là Logo
            
            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttribute('href', '#star-def');
            use.setAttribute('transform', `scale(${0.5 + Math.random() * 0.8})`); // Kích thước to nhỏ tự nhiên

            group.appendChild(use);
            if (starsContainer) starsContainer.appendChild(group);

            allStarElements.push({ group, logoX, logoY, galaxyX, galaxyY });
            currentLengthOnPath += distancePerStar;

            // --- TÍNH NĂNG HOVER HIỂN THỊ THÔNG TIN ---
            group.addEventListener('mouseenter', () => {
                ttName.textContent = user.name;
                ttDob.textContent = user.dob;
                ttZodiac.textContent = user.zodiac;
                tooltip.style.opacity = '1';
                group.style.zIndex = "10";
            });

            group.addEventListener('mousemove', (e) => {
                // Tracking chuột mượt mà, đẩy tooltip lên trên 25px để không đè vào chuột
                tooltip.style.left = e.clientX + 'px';
                tooltip.style.top = (e.clientY - 25) + 'px';
            });

            group.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                group.style.zIndex = "1";
            });
        });

        // Ẩn màn hình Loading và kích hoạt nút
        if(loadingOverlay) loadingOverlay.style.display = 'none';
        if(btnToggle) {
            btnToggle.disabled = false;
            btnToggle.innerHTML = "Khám phá dải ngân hà BIT";
            
            // Xử lý sự kiện bấm Nút
            btnToggle.addEventListener('click', () => {
                isGalaxyMode = !isGalaxyMode;
                btnToggle.innerHTML = isGalaxyMode ? "Tụ hợp thành Logo BIT" : "Khám phá dải ngân hà BIT";
                
                // Ẩn/Hiện đường kẻ đứt
                paths.forEach(p => p.style.opacity = isGalaxyMode ? '0' : '1');

                // Di chuyển toàn bộ các vì sao
                allStarElements.forEach(star => {
                    const targetX = isGalaxyMode ? star.galaxyX : star.logoX;
                    const targetY = isGalaxyMode ? star.galaxyY : star.logoY;
                    star.group.style.transform = `translate(${targetX}px, ${targetY}px)`;
                });
            });
        }
    }

    // Bắt đầu khởi chạy hệ thống sau 0.5s để đảm bảo layout HTML đã load xong kích thước
    setTimeout(init, 500); 
});