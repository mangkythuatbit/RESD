document.addEventListener("DOMContentLoaded", async () => {
    const canvas = document.getElementById("starCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true }); // Hỗ trợ nền trong suốt

    // Tạo Tooltip hiển thị thông tin
    const tooltip = document.createElement("div");
    tooltip.id = "star-tooltip";
    document.body.appendChild(tooltip);

    // CSS cho Tooltip
    const style = document.createElement("style");
    style.innerHTML = `
        #star-tooltip {
            position: absolute;
            background: rgba(7, 19, 35, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
            color: #fff;
            padding: 12px 16px;
            border-radius: 8px;
            pointer-events: none;
            opacity: 0;
            transform: translate(-50%, -100%);
            transition: opacity 0.2s ease;
            z-index: 9999;
            font-family: 'Be Vietnam Pro', sans-serif;
            min-width: 200px;
        }
        #star-tooltip h4 { margin: 0 0 5px 0; font-size: 16px; color: #b9f6ff; }
        #star-tooltip p { margin: 0; font-size: 13px; color: #ddd; }
        #star-tooltip .zodiac { margin-top: 8px; font-weight: bold; font-size: 12px; display: inline-block; padding: 3px 8px; background: rgba(255,255,255,0.1); border-radius: 4px;}
    `;
    document.head.appendChild(style);

    // Biến toàn cục
    let particles = [];
    let isGalaxyMode = false;
    let canvasRect = canvas.getBoundingClientRect();
    let mouse = { x: -1000, y: -1000, hoverParticle: null };

    // Cấu hình
    const CONFIG = {
        starColor: "rgba(255, 255, 255, 0.9)",
        lineColor: "rgba(255, 255, 255, 0.15)",
        hoverColor: "#b9f6ff",
        connectionDistance: 35, // Khoảng cách nối các vì sao với nhau
        maxConnections: 3 // Số kết nối tối đa mỗi sao để tạo nét chòm sao không bị rối
    };

    // Hàm thay đổi kích thước Canvas
    function resizeCanvas() {
        canvasRect = canvas.parentElement.getBoundingClientRect();
        canvas.width = canvasRect.width;
        canvas.height = canvasRect.height;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Hàm tính Cung hoàng đạo
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

    // 1. Đọc và phân tích file CSV
    async function loadUserData() {
        try {
            const response = await fetch('assets/data/Danh_sach_sinh_nhat.csv');
            const data = await response.text();
            const rows = data.split('\n');
            const users = [];

            for (let i = 1; i < rows.length; i++) { // Bỏ qua dòng header (nếu có)
                const cols = rows[i].split(',');
                if (cols.length >= 2 && cols[0].trim() !== '') {
                    const name = cols[0].trim();
                    const dob = cols[1].trim();
                    const [day, month] = dob.split('/');
                    users.push({
                        name: name,
                        dob: dob,
                        zodiac: getZodiacSign(parseInt(day), parseInt(month))
                    });
                }
            }
            return users;
        } catch (e) {
            console.warn("Không tìm thấy file Danh_sach_sinh_nhat.csv. Sử dụng dữ liệu mẫu.");
            // Dữ liệu mẫu nếu không có file CSV để test
            return Array.from({length: 1000}).map((_, i) => ({
                name: `Thành viên BIT ${i+1}`,
                dob: `${(i%28)+1}/${(i%12)+1}/2004`,
                zodiac: getZodiacSign((i%28)+1, (i%12)+1)
            }));
        }
    }

    // 2. Đọc ảnh Logo và lấy Toạ độ Pixel
    function getLogoCoordinates(imageSrc, numPoints, canvasW, canvasH) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => {
                const offCanvas = document.createElement("canvas");
                const offCtx = offCanvas.getContext("2d");
                
                // Tính toán tỷ lệ để logo nằm vừa và giữa màn hình
                const scale = Math.min((canvasW * 0.7) / img.width, (canvasH * 0.7) / img.height);
                const drawW = img.width * scale;
                const drawH = img.height * scale;
                
                offCanvas.width = drawW;
                offCanvas.height = drawH;
                offCtx.drawImage(img, 0, 0, drawW, drawH);

                const imgData = offCtx.getImageData(0, 0, drawW, drawH).data;
                let validCoords = [];

                // Quét pixel (bỏ qua những pixel trong suốt)
                for (let y = 0; y < drawH; y += 2) {
                    for (let x = 0; x < drawW; x += 2) {
                        const alpha = imgData[(y * drawW + x) * 4 + 3];
                        if (alpha > 128) {
                            validCoords.push({ 
                                x: x + (canvasW - drawW) / 2, // Căn giữa X
                                y: y + (canvasH - drawH) / 2  // Căn giữa Y
                            });
                        }
                    }
                }

                // Xáo trộn toạ độ
                validCoords = validCoords.sort(() => Math.random() - 0.5);
                
                // Lấy ra số toạ độ tương ứng với số User (nếu user nhiều hơn pixel thì lặp lại pixel)
                const finalCoords = [];
                for (let i = 0; i < numPoints; i++) {
                    finalCoords.push(validCoords[i % validCoords.length]);
                }
                resolve(finalCoords);
            };
        });
    }

    // Class Ngôi sao
    class Particle {
        constructor(user, targetX, targetY) {
            this.user = user;
            // Trạng thái Logo
            this.targetX = targetX;
            this.targetY = targetY;
            // Trạng thái Galaxy (ngẫu nhiên)
            this.galaxyX = Math.random() * canvas.width;
            this.galaxyY = Math.random() * canvas.height;
            // Vị trí hiện tại (Lúc khởi tạo render thẳng vào logo)
            this.x = this.targetX + (Math.random() - 0.5) * 20; 
            this.y = this.targetY + (Math.random() - 0.5) * 20;
            // Thuộc tính vẽ
            this.size = Math.random() * 1.5 + 0.5;
            this.baseSize = this.size;
            // Chuyển động lơ lửng (idle)
            this.angle = Math.random() * Math.PI * 2;
            this.speed = Math.random() * 0.02 + 0.01;
            // Các điểm nối
            this.connections = [];
        }

        update() {
            // Xác định đích đến dựa trên chế độ (Logo hay Galaxy)
            let destX = isGalaxyMode ? this.galaxyX : this.targetX;
            let destY = isGalaxyMode ? this.galaxyY : this.targetY;

            // Idle animation (lơ lửng nhẹ)
            this.angle += this.speed;
            destX += Math.cos(this.angle) * 5;
            destY += Math.sin(this.angle) * 5;

            // Easing (Di chuyển mượt mà tới đích)
            this.x += (destX - this.x) * 0.05;
            this.y += (destY - this.y) * 0.05;

            // Xử lý Hover
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 15) {
                this.size = this.baseSize * 3;
                mouse.hoverParticle = this;
            } else {
                this.size = this.baseSize;
            }
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = mouse.hoverParticle === this ? CONFIG.hoverColor : CONFIG.starColor;
            ctx.fill();
        }
    }

    // 3. Khởi tạo toàn bộ dữ liệu
    async function init() {
        const users = await loadUserData();
        const coords = await getLogoCoordinates('assets/images/logo-khoa-trang.png', users.length, canvas.width, canvas.height);

        particles = [];
        for (let i = 0; i < users.length; i++) {
            particles.push(new Particle(users[i], coords[i].x, coords[i].y));
        }

        // Tối ưu hoá O(n): Tính toán kết nối chòm sao 1 lần duy nhất lúc khởi tạo dựa trên targetX/Y
        for (let i = 0; i < particles.length; i++) {
            let count = 0;
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].targetX - particles[j].targetX;
                const dy = particles[i].targetY - particles[j].targetY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONFIG.connectionDistance) {
                    particles[i].connections.push(particles[j]);
                    count++;
                    if (count >= CONFIG.maxConnections) break; // Giới hạn nối để không tạo thành mảng đặc
                }
            }
        }

        // Ẩn loading và bật nút điều khiển
        document.getElementById('starmapLoading').style.display = 'none';
        const btn = document.getElementById('toggleShapeBtn');
        btn.innerHTML = "Khám phá dải ngân hà BIT";
        btn.disabled = false;
        
        btn.addEventListener('click', () => {
            isGalaxyMode = !isGalaxyMode;
            btn.innerHTML = isGalaxyMode ? "Tụ hợp thành Logo BIT" : "Khám phá dải ngân hà BIT";
        });

        animate();
    }

    // 4. Vòng lặp Animation
    function animate() {
        // Clear background hoàn toàn để giữ thuộc tính transparent
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        mouse.hoverParticle = null;

        // Cập nhật tọa độ
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }

        // Vẽ các đường nối chòm sao
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = CONFIG.lineColor;
        ctx.beginPath();
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            for (let j = 0; j < p.connections.length; j++) {
                const conn = p.connections[j];
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(conn.x, conn.y);
            }
        }
        ctx.stroke();

        // Vẽ các ngôi sao
        for (let i = 0; i < particles.length; i++) {
            particles[i].draw(ctx);
        }

        // Cập nhật Tooltip
        if (mouse.hoverParticle) {
            const p = mouse.hoverParticle.user;
            tooltip.innerHTML = `
                <h4>${p.name}</h4>
                <p>Ngày sinh: ${p.dob}</p>
                <div class="zodiac">${p.zodiac}</div>
            `;
            // Định vị tooltip ngay trên con trỏ chuột
            tooltip.style.left = (mouse.pageX) + 'px';
            tooltip.style.top = (mouse.pageY - 15) + 'px';
            tooltip.style.opacity = '1';
            canvas.style.cursor = 'crosshair';
        } else {
            tooltip.style.opacity = '0';
            canvas.style.cursor = 'default';
        }

        requestAnimationFrame(animate);
    }

    // Lắng nghe sự kiện chuột
    canvas.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX - canvasRect.left;
        mouse.y = e.clientY - canvasRect.top;
        mouse.pageX = e.pageX;
        mouse.pageY = e.pageY;
    });

    canvas.addEventListener("mouseleave", () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // Bắt đầu chạy
    init();
});