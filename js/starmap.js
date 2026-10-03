document.addEventListener("DOMContentLoaded", () => {
    // 1. Cấu hình đường dẫn
    const CSV_URL = 'assets/data/Danh_sach_sinh_nhat.csv'; 
    const LOGO_URL = 'assets/images/logo-khoa-trang.png';

    const canvas = document.getElementById('starCanvas');
    const ctx = canvas.getContext('2d');
    const toggleBtn = document.getElementById('toggleShapeBtn');
    const loadingOverlay = document.getElementById('starmapLoading');
    const loadingText = document.getElementById('loadingText');

    let stars = [];
    let logoPixels = [];
    let isLogoMode = false;
    let animationFrameId;
    let mouse = { x: -1000, y: -1000 };
    
    const FRICTION = 0.90;
    const SPRING = 0.04;
    const CONNECTION_DISTANCE = 45; // Khoảng cách để các sao nối dây với nhau

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

    const ZODIAC_DATA = [
        { sign: "Ma Kết", endMonth: 1, endDay: 19 }, { sign: "Bảo Bình", endMonth: 2, endDay: 18 },
        { sign: "Song Ngư", endMonth: 3, endDay: 20 }, { sign: "Bạch Dương", endMonth: 4, endDay: 19 },
        { sign: "Kim Ngưu", endMonth: 5, endDay: 20 }, { sign: "Song Tử", endMonth: 6, endDay: 20 },
        { sign: "Cự Giải", endMonth: 7, endDay: 22 }, { sign: "Sư Tử", endMonth: 8, endDay: 22 },
        { sign: "Xử Nữ", endMonth: 9, endDay: 22 }, { sign: "Thiên Bình", endMonth: 10, endDay: 22 },
        { sign: "Thiên Yết", endMonth: 11, endDay: 21 }, { sign: "Nhân Mã", endMonth: 12, endDay: 21 },
        { sign: "Ma Kết", endMonth: 12, endDay: 31 }
    ];

    function getZodiacInfo(day, month) {
        for (let i = 0; i < ZODIAC_DATA.length; i++) {
            if (month < ZODIAC_DATA[i].endMonth || (month === ZODIAC_DATA[i].endMonth && day <= ZODIAC_DATA[i].endDay)) {
                return ZODIAC_DATA[i];
            }
        }
        return ZODIAC_DATA[0];
    }

    function parseRobustDateCSV(value) {
        if (!value) return null;
        let cleanStr = value.replace(/\s+/g, '');
        let parts = cleanStr.split(/[-/]/);
        if (parts.length >= 2) {
            let d = parseInt(parts[0], 10);
            let m = parseInt(parts[1], 10);
            let y = parts.length === 3 ? parts[2] : "";
            if (!isNaN(d) && !isNaN(m)) {
                return { 
                    day: d, month: m, 
                    str: `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}${y ? '/' + y : ''}` 
                };
            }
        }
        return null;
    }

    class Star {
        constructor(name, dobInfo) {
            this.name = name;
            this.dobStr = dobInfo.str;
            this.zodiac = getZodiacInfo(dobInfo.day, dobInfo.month);
            this.radius = Math.random() * 1.2 + 0.8;
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
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
                const maxSpeed = 0.3;
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > maxSpeed) {
                    this.vx = (this.vx / speed) * maxSpeed;
                    this.vy = (this.vy / speed) * maxSpeed;
                }
                this.vx += (Math.random() - 0.5) * 0.03;
                this.vy += (Math.random() - 0.5) * 0.03;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            this.x += this.vx;
            this.y += this.vy;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff'; // Nâng cấp: Toàn bộ sao màu trắng
            ctx.fill();
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#ffffff';
        }
    }

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
                        if (imgData[(y * w + x) * 4 + 3] > 128) {
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

    function animate() {
        // Nâng cấp: Xóa frame cũ thay vì tô màu đen, giúp background website xuyên thấu
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let hoveredStar = null;
        let minDist = 20; // Vùng click/hover dễ chạm hơn

        // 1. Cập nhật vị trí & Vẽ đường nối (Constellation Lines)
        ctx.lineWidth = 0.4;
        for (let i = 0; i < stars.length; i++) {
            stars[i].update();
            
            for (let j = i + 1; j < stars.length; j++) {
                const dx = stars[i].x - stars[j].x;
                const dy = stars[i].y - stars[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < CONNECTION_DISTANCE) {
                    // Càng gần nét càng rõ
                    const opacity = 1 - (dist / CONNECTION_DISTANCE);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
                    ctx.beginPath();
                    ctx.moveTo(stars[i].x, stars[i].y);
                    ctx.lineTo(stars[j].x, stars[j].y);
                    ctx.stroke();
                }
            }
        }

        // 2. Vẽ điểm sao & Xét Hover
        stars.forEach(star => {
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

        // 3. Vẽ UI Thông tin trực tiếp trên Canvas (Chuẩn phong cách tinh hà)
        if (hoveredStar) {
            const hx = hoveredStar.x;
            const hy = hoveredStar.y;
            
            // Vẽ vòng highlight nét đứt xoay quanh sao
            ctx.beginPath();
            ctx.arc(hx, hy, hoveredStar.radius + 6, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 3]);
            ctx.stroke();
            ctx.setLineDash([]); // Reset
            
            // Vẽ đường dẫn Line UI
            ctx.beginPath();
            ctx.moveTo(hx, hy);
            ctx.lineTo(hx + 15, hy - 15);
            ctx.lineTo(hx + 130, hy - 15);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.stroke();
            
            // Vẽ Text Tên (In hoa mạnh mẽ)
            ctx.shadowBlur = 4;
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px "Space Grotesk", sans-serif';
            ctx.fillText(hoveredStar.name.toUpperCase(), hx + 18, hy - 20);
            
            // Vẽ Text Phụ (Ngày sinh & Chòm sao)
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.font = '10px "Space Grotesk", sans-serif';
            ctx.fillText(`${hoveredStar.dobStr} • ${hoveredStar.zodiac.sign}`, hx + 18, hy - 4);
        }
        
        animationFrameId = requestAnimationFrame(animate);
    }

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });
    // Tương thích với cả click (chạm trên mobile)
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    toggleBtn.addEventListener('click', () => {
        isLogoMode = !isLogoMode;
        if(isLogoMode) {
            recalculateLogoPositions();
            toggleBtn.querySelector('span').innerText = "TRỞ VỀ DẢI NGÂN HÀ";
        } else {
            stars.forEach(star => {
                star.vx = (Math.random() - 0.5) * 4;
                star.vy = (Math.random() - 0.5) * 4;
            });
            toggleBtn.querySelector('span').innerText = "TẠO HÌNH LOGO BIT";
        }
    });

    // --- LẤY DỮ LIỆU TỪ CSV ---
    async function loadDataAndStart() {
        try {
            const noCacheUrl = CSV_URL + '?t=' + new Date().getTime();
            
            const [csvResponse, _] = await Promise.all([
                fetch(noCacheUrl),
                processLogoImage()
            ]);
            
            if (!csvResponse.ok) throw new Error("HTTP Error");
            const csvText = await csvResponse.text();
            
            stars = [];
            const rows = csvText.split(/\r?\n/);
            
            for (let i = 1; i < rows.length; i++) {
                const rowStr = rows[i].trim();
                if (!rowStr) continue;
                
                const delimiter = rowStr.includes(';') ? ';' : ',';
                const cols = rowStr.split(delimiter);
                if (cols.length < 2) continue;
                
                const name = cols[0].replace(/^"|"$/g, '').trim();
                const dob = cols[1].replace(/^"|"$/g, '').trim();
                if (name === "") continue; 
                
                const dobInfo = parseRobustDateCSV(dob);
                if (dobInfo) {
                    stars.push(new Star(name, dobInfo));
                }
            }
            
            loadingOverlay.style.display = 'none';
            toggleBtn.disabled = false;
            toggleBtn.querySelector('span').innerText = "TẠO HÌNH LOGO BIT";
            
            if (!animationFrameId) animate();
            
        } catch (err) {
            console.error(err);
            loadingText.innerText = "LỖI HỆ THỐNG: KHÔNG THỂ ĐỒNG BỘ BẢN ĐỒ SAO.";
            loadingText.style.color = "#ff799b";
        }
    }

    loadDataAndStart();
});
