document.addEventListener("DOMContentLoaded", () => {
    // 1. Cấu hình đường dẫn tới file Excel trên Host của bạn
    const EXCEL_URL = 'assets/data/Danh-sach-sinh-nhat.xlsx'; 
    const LOGO_URL = 'assets/images/logo-khoa-trang.png';

    const canvas = document.getElementById('starCanvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    const tooltip = document.getElementById('starTooltip');
    const toggleBtn = document.getElementById('toggleShapeBtn');
    const loadingOverlay = document.getElementById('starmapLoading');
    const loadingText = document.getElementById('loadingText');

    let stars = [];
    let logoPixels = [];
    let isLogoMode = false;
    let animationFrameId;
    let mouse = { x: -1000, y: -1000 };
    
    const FRICTION = 0.92;
    const SPRING = 0.05;

    // --- Xử lý Resize ---
    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        if (rect.width > 0) {
            canvas.width = rect.width;
            canvas.height = rect.height;
        }
        if(isLogoMode) recalculateLogoPositions();
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // --- Logic Cung Hoàng Đạo ---
    const ZODIAC_DATA = [
        { sign: "Capricorn (Ma Kết)", type: "Earth", color: "#8b4513", glow: "#d2b48c", endMonth: 1, endDay: 19 },
        { sign: "Aquarius (Bảo Bình)", type: "Air", color: "#e0ffff", glow: "#ffffff", endMonth: 2, endDay: 18 },
        { sign: "Pisces (Song Ngư)", type: "Water", color: "#1e90ff", glow: "#00bfff", endMonth: 3, endDay: 20 },
        { sign: "Aries (Bạch Dương)", type: "Fire", color: "#ff4500", glow: "#ff8c00", endMonth: 4, endDay: 19 },
        { sign: "Taurus (Kim Ngưu)", type: "Earth", color: "#2e8b57", glow: "#3cb371", endMonth: 5, endDay: 20 },
        { sign: "Gemini (Song Tử)", type: "Air", color: "#ffd700", glow: "#ffff00", endMonth: 6, endDay: 20 },
        { sign: "Cancer (Cự Giải)", type: "Water", color: "#4682b4", glow: "#87ceeb", endMonth: 7, endDay: 22 },
        { sign: "Leo (Sư Tử)", type: "Fire", color: "#ff0000", glow: "#ffa500", endMonth: 8, endDay: 22 },
        { sign: "Virgo (Xử Nữ)", type: "Earth", color: "#556b2f", glow: "#8fbc8f", endMonth: 9, endDay: 22 },
        { sign: "Libra (Thiên Bình)", type: "Air", color: "#ffb6c1", glow: "#ffc0cb", endMonth: 10, endDay: 22 },
        { sign: "Scorpio (Thiên Yết)", type: "Water", color: "#000080", glow: "#4169e1", endMonth: 11, endDay: 21 },
        { sign: "Sagittarius (Nhân Mã)", type: "Fire", color: "#ff8c00", glow: "#ffa07a", endMonth: 12, endDay: 21 },
        { sign: "Capricorn (Ma Kết)", type: "Earth", color: "#8b4513", glow: "#d2b48c", endMonth: 12, endDay: 31 }
    ];

    function getZodiacInfo(day, month) {
        for (let i = 0; i < ZODIAC_DATA.length; i++) {
            if (month < ZODIAC_DATA[i].endMonth || (month === ZODIAC_DATA[i].endMonth && day <= ZODIAC_DATA[i].endDay)) {
                return ZODIAC_DATA[i];
            }
        }
        return ZODIAC_DATA[0];
    }

    // --- BỘ PHÂN TÍCH NGÀY THÁNG CỰC KỲ MẠNH MẼ VÀ CHỐNG LỖI ---
    function parseRobustDate(value) {
        if (!value) return null;
        
        // 1. Nếu SheetJS trả về chuẩn JS Date (Ưu tiên Dùng UTC để chống lệch múi giờ của Việt Nam)
        if (value instanceof Date) {
            if (isNaN(value.getTime())) return null;
            return { 
                day: value.getUTCDate(), 
                month: value.getUTCMonth() + 1, 
                str: `${String(value.getUTCDate()).padStart(2, '0')}/${String(value.getUTCMonth() + 1).padStart(2, '0')}/${value.getUTCFullYear()}`
            };
        }
        
        // 2. Nếu người nhập liệu nhầm thành text (VD: "8 /9/2006")
        if (typeof value === 'string') {
            let cleanStr = value.replace(/\s+/g, ''); // Cắt sạch khoảng trắng
            let parts = cleanStr.split(/[-/]/);
            if (parts.length >= 2) {
                let d = parseInt(parts[0], 10);
                let m = parseInt(parts[1], 10);
                let y = parts.length === 3 ? parts[2] : "";
                if (!isNaN(d) && !isNaN(m)) {
                    return { day: d, month: m, str: `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}${y ? '/' + y : ''}` };
                }
            }
        }
        
        // 3. Nếu là số Serial thuần của Excel
        if (typeof value === 'number') {
            const date = new Date(Math.round((value - 25569) * 86400 * 1000));
            return { day: date.getUTCDate(), month: date.getUTCMonth() + 1, str: `${String(date.getUTCDate()).padStart(2, '0')}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${date.getUTCFullYear()}` };
        }
        return null;
    }

    // --- Lớp định hình Ngôi sao ---
    class Star {
        constructor(name, dobInfo) {
            this.name = name;
            this.dobStr = dobInfo.str;
            this.zodiac = getZodiacInfo(dobInfo.day, dobInfo.month);
            
            this.radius = Math.random() * 1.5 + 1;
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.targetX = this.x;
            this.targetY = this.y;
        }

        update() {
            if (isLogoMode) {
                let dx = this.targetX - this.x;
                let dy = this.targetY - this.y;
                this.vx += dx * SPRING;
                this.vy += dy * SPRING;
                this.vx *= FRICTION;
                this.vy *= FRICTION;
            } else {
                const maxSpeed = 0.5;
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > maxSpeed) {
                    this.vx = (this.vx / speed) * maxSpeed;
                    this.vy = (this.vy / speed) * maxSpeed;
                }
                this.vx += (Math.random() - 0.5) * 0.05;
                this.vy += (Math.random() - 0.5) * 0.05;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            this.x += this.vx;
            this.y += this.vy;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.zodiac.glow;
            ctx.fill();
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.zodiac.color;
        }
    }

    // --- Phân tích điểm ảnh từ hình Logo ---
    function processLogoImage() {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = LOGO_URL; 
            
            img.onload = () => {
                const offCanvas = document.createElement('canvas');
                const offCtx = offCanvas.getContext('2d');
                
                const scale = Math.min((canvas.width * 0.8) / img.width, (canvas.height * 0.6) / img.height);
                const w = Math.floor(img.width * scale);
                const h = Math.floor(img.height * scale);
                
                offCanvas.width = w;
                offCanvas.height = h;
                offCtx.drawImage(img, 0, 0, w, h);
                
                const imgData = offCtx.getImageData(0, 0, w, h).data;
                logoPixels = [];
                
                let step = 3; 
                for (let y = 0; y < h; y += step) {
                    for (let x = 0; x < w; x += step) {
                        const alpha = imgData[(y * w + x) * 4 + 3];
                        if (alpha > 128) {
                            logoPixels.push({ x: x, y: y, baseW: w, baseH: h });
                        }
                    }
                }
                
                for (let i = logoPixels.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [logoPixels[i], logoPixels[j]] = [logoPixels[j], logoPixels[i]];
                }
                resolve();
            };
            img.onerror = () => reject(new Error("Lỗi tải ảnh logo."));
        });
    }

    function recalculateLogoPositions() {
        if(logoPixels.length === 0 || stars.length === 0) return;
        const offsetX = (canvas.width - logoPixels[0].baseW) / 2;
        const offsetY = (canvas.height - logoPixels[0].baseH) / 2;

        stars.forEach((star, index) => {
            const p = logoPixels[index % logoPixels.length];
            star.targetX = p.x + offsetX + (Math.random() - 0.5) * 2;
            star.targetY = p.y + offsetY + (Math.random() - 0.5) * 2;
        });
    }

    // --- Main Rendering Loop ---
    function animate() {
        ctx.fillStyle = 'rgba(7, 19, 35, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let hoveredStar = null;
        let minDist = 15;

        stars.forEach(star => {
            star.update();
            star.draw();
            
            if (mouse.x > 0 && mouse.y > 0) {
                const dx = mouse.x - star.x;
                const dy = mouse.y - star.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < minDist) {
                    minDist = dist;
                    hoveredStar = star;
                }
            }
        });

        if (hoveredStar) {
            tooltip.style.opacity = 1;
            tooltip.style.left = mouse.x + 'px';
            tooltip.style.top = (mouse.y - 15) + 'px';
            document.getElementById('ttName').innerText = hoveredStar.name;
            document.getElementById('ttDob').innerText = "Ngày sinh: " + hoveredStar.dobStr;
            const signEl = document.getElementById('ttSign');
            signEl.innerText = hoveredStar.zodiac.sign;
            signEl.style.color = hoveredStar.zodiac.glow;
            
            ctx.beginPath();
            ctx.arc(hoveredStar.x, hoveredStar.y, hoveredStar.radius + 5, 0, Math.PI * 2);
            ctx.strokeStyle = hoveredStar.zodiac.glow;
            ctx.stroke();
        } else {
            tooltip.style.opacity = 0;
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    // --- Mouse Listeners ---
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

    toggleBtn.addEventListener('click', () => {
        isLogoMode = !isLogoMode;
        if(isLogoMode) {
            recalculateLogoPositions();
            toggleBtn.querySelector('span').innerText = "Trở về dải ngân hà";
        } else {
            stars.forEach(star => {
                star.vx = (Math.random() - 0.5) * 4;
                star.vy = (Math.random() - 0.5) * 4;
            });
            toggleBtn.querySelector('span').innerText = "Tạo hình Logo BIT";
        }
    });

    // --- HỆ THỐNG TỰ ĐỘNG FETCH DATA (KHÔNG DÙNG UPLOAD) ---
    async function loadDataAndStart() {
        try {
            // Chống Cache để luôn có data mới nhất từ Admin:
            const noCacheUrl = EXCEL_URL + '?t=' + new Date().getTime();
            
            loadingText.innerText = "Đang tải dữ liệu tinh tú từ máy chủ...";
            
            const [excelResponse, _] = await Promise.all([
                fetch(noCacheUrl),
                processLogoImage()
            ]);
            
            if (!excelResponse.ok) throw new Error("Không thể tải file Excel từ server.");
            
            const arrayBuffer = await excelResponse.arrayBuffer();
            loadingText.innerText = "Đang giải mã chòm sao...";
            
            // Ép đọc Dates chuẩn để tránh lỗi serial string
            const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            stars = [];
            
            // Xử lý dữ liệu rỗng thông minh, bỏ qua hàng 0 (Header)
            for(let i = 1; i < json.length; i++) {
                const row = json[i];
                if (!Array.isArray(row) || row.length < 2) continue; 
                if (row[0] === undefined || row[0] === null || row[1] === undefined || row[1] === null) continue;
                
                const name = String(row[0]).trim();
                if (name === "") continue; 
                
                const dobInfo = parseRobustDate(row[1]);
                if (dobInfo) {
                    stars.push(new Star(name, dobInfo));
                }
            }
            
            loadingOverlay.style.display = 'none';
            toggleBtn.disabled = false;
            toggleBtn.querySelector('span').innerText = "Tạo hình Logo BIT";
            
            if (!animationFrameId) animate();
            
        } catch (err) {
            console.error(err);
            loadingText.innerText = "Lỗi hệ thống: Không thể đồng bộ bản đồ sao.";
            loadingText.style.color = "#ff799b"; // Đổi qua đỏ báo lỗi
        }
    }

    // Khởi chạy ngay khi load xong cấu trúc trang
    loadDataAndStart();
});