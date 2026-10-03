#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bộ sinh trang tĩnh cho cổng thông tin R.E.S.D.

Vì sao có file này: navbar và footer lặp lại ở 15 trang HTML. Sửa tay từng
trang rất dễ lệch. Toàn bộ nội dung ban và mảng khai báo ở BANS bên dưới,
chạy một lệnh là sinh lại tất cả:

    python3 tools/build_pages.py

Website chạy được mà KHÔNG cần file này. Đây chỉ là công cụ bảo trì.

CẢNH BÁO: nếu bạn sửa trực tiếp file .html rồi chạy lại script, thay đổi đó sẽ
bị ghi đè. Muốn đổi nội dung thì sửa trong CONTENT rồi chạy lại.
"""

import html
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BS_CSS = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
BS_JS = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
FONTS = ("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800"
         "&family=Space+Grotesk:wght@500;700&display=swap")

DRAFT = ('<span class="draft-badge" title="Nội dung mẫu, chờ Ban chuyên môn duyệt">'
         'Nội dung mẫu · chờ duyệt</span>')

# Tên giữ chỗ. Lời nhắn nào còn mang tên này nghĩa là nội dung mẫu do máy viết.
PLACEHOLDER_NAME = "Chờ cập nhật"


def draft_flag(voices):
    """Trả về nhãn 'chờ duyệt' nếu còn ít nhất một lời nhắn chưa có tên thật."""
    if any((v.get("who") or "").strip() in ("", PLACEHOLDER_NAME) for v in voices):
        return DRAFT
    return ""


def e(text):
    return html.escape(str(text), quote=True)


# =============================================================================
# NỘI DUNG
# =============================================================================

BANS = [
    {
        "id": "tcxd",
        "slug": "ban-to-chuc-xay-dung",
        "stamp": "tcxd",
        "gem": "Sapphire",
        "color": "#6fa8ff",
        "soft": "#6fa8ff22",
        "name": "Ban Tổ chức - Xây dựng",
        "short": "TC-XD",
        "tagline": "Một chương sách được trau dồi, gắn kết từ trong ra ngoài, và được vận hành trơn tru. "
                   "Tổ chức - Xây dựng là nơi dựng phần đó: con người, nguồn lực và sân khấu.",
        "mission": [
            "Ban Tổ chức - Xây dựng là ban quản lý và gắn kết nhân sự; đồng thời xây dựng, duy trì mối quan hệ "
            "với nhà tài trợ và các Câu lạc bộ, Đội, Nhóm khác,"
            "thúc đẩy các giải pháp hiệu quả hơn cho công tác Đoàn - Hội đến sinh viên.",
            "Ba mảng Nhân sự, Đối ngoại và Kỹ thuật cùng tạo nên nền vận hành cho các hoạt động "
            "của Đoàn - Hội khoa.",
        ],
        "duties": [
            "<b>Quản lý và gắn kết nhân sự</b>: dữ liệu sinh viên và cộng tác viên, phân bổ công việc, hồ sơ.",
            "<b>Thiết lập và duy trì quan hệ hợp tác</b> với nhà tài trợ và đơn vị đối tác.",
            "<b>Tổ chức hoạt động nội bộ</b>: lễ kỷ niệm, sinh nhật và training kỹ năng.",
            "<b>Quản lý và phát triển sản phẩm số</b>: website Đoàn - Hội khoa BIT và các công cụ nội bộ.",
            "<b>Training chuyên môn nội bộ</b>: chia sẻ kinh nghiệm học phần cơ sở ngành và kỹ thuật chương trình.",
        ],
        "programs": [
            {"name": "Chào đón Tân sinh viên", "meta": "Gắn kết",
             "desc": "Cầu nối giúp sinh viên khóa mới làm quen môi trường học tập, tìm hiểu chuyên ngành và khám phá hoạt động Đoàn - Hội.",
             "img": "assets/images/programs/tcxd-chao-tan-sinh-vien.jpg"},
            {"name": "Hoạt động nội bộ", "meta": "Nhân sự",
             "desc": "Lễ kỷ niệm, sinh nhật và các buổi training kỹ năng dành cho thành viên.",
             "img": "assets/images/programs/tcxd-hoat-dong-noi-bo.jpg"},
            {"name": "Sản phẩm số Đoàn - Hội BIT", "meta": "Kỹ thuật",
             "desc": "Quản lý và phát triển các sản phẩm số, website Đoàn - Hội khoa BIT.",
             "img": "assets/images/programs/tcxd-san-pham-so.jpg"},
        ],
        "must": ["Giao tiếp tốt", "Chủ động trong công việc", "Làm việc nhóm", "Tinh thần trách nhiệm cao"],
        "plus": ["Viết email", "Mail merge / Mailchimp", "Từng vận động gây quỹ", "Hiểu cơ bản cấu thành trang web"],
        "stats": [("Kết nối", "Tinh thần đồng đội"), ("Duy trì", "Sự gắn bó dài hạn"), ("Sapphire", "viên đá đại diện")],
        "voices": [
            {"q": "Mình vào ban vì nghĩ tổ chức sự kiện là chạy quanh sân khấu. Hoá ra phần khó nhất "
                  "là ngồi trước một file phân công và tưởng tượng ra hết những gì có thể hỏng.",
             "who": "Tập thể Ban", "role": "Ban Tổ chức - Xây dựng"},
            {"q": "Cảm giác đứng cuối hội trường nhìn chương trình chạy đúng kịch bản mình dựng, "
                  "không ai biết mình là ai, mà vẫn thấy đáng.",
             "who": "Tập thể Ban", "role": "Ban Tổ chức - Xây dựng"},
        ],
        "people": [("Lê Bảo Ngọc", "Trưởng ban"), ("Huỳnh Bảo Nhi", "Trưởng mảng Nhân sự"),("Nguyễn Võ Lan Thanh", "Phó mảng Nhân sự"), ("Phạm Thị Ngọc Diệu", "Trưởng mảng Đối ngoại"), ("Lê Viết Bảo", "Trưởng mảng Kỹ thuật")],
        "mangs": [
            {
                "code": "NS", "id": "ns", "name": "Nhân sự",
                "lede": "Mảng chuyên trách về vòng đời nhân sự và các hoạt động gắn kết nội bộ ",
                "duties": [
                    "Quản lý dữ liệu sinh viên và cộng tác viên.",
                    "Phân bổ công việc và quản lý hồ sơ.",
                    "Tổ chức các hoạt động nội bộ như lễ kỷ niệm, sinh nhật và training kỹ năng.",
                ],
                "programs": [
                    {"name": "Các đợt tuyển Cộng tác viên, Ban Chấp hành", "meta": "Định kỳ hàng năm",
                     "desc": "Từ mở đơn tới buổi gặp mặt đầu tiên của thành viên mới.",
                     "img": "assets/images/programs/tcxd-ns-tuyen-ctv.jpg"},
                    {"name": "Rèn luyện kỹ năng chuyên môn nội bộ", "meta": "Định kỳ",
                     "desc": "Các buổi chia sẻ ngắn về tổ chức sự kiện, giao tiếp và làm việc nhóm.",
                     "img": "assets/images/programs/tcxd-ns-training.jpg"},
                    {"name": "Các hoạt động nội bộ gắn kết", "meta": "Gắn kết",
                     "desc": "Giữ lửa cho đội khi lịch học và lịch hoạt động bắt đầu chồng nhau.",
                     "img": "assets/images/programs/tcxd-ns-teambuilding.jpg"},
                ],
                "must": ["Giao tiếp rõ ràng", "Giữ bí mật thông tin cá nhân", "Công bằng", "Chủ động hỏi han"],
                "plus": ["Từng làm lớp trưởng / ban cán sự", "Quen Google Sheets", "Tổ chức trò chơi tập thể"],
                "voices": [
                    {"q": "Việc khó nhất không phải xếp lịch, mà là nhắn cho một bạn đã im lặng hai tuần "
                          "và hỏi bạn ấy có ổn không.",
                     "who": "Tập thể mảng", "role": "mảng Nhân sự"},
                ],
                "people": [("Huỳnh Bảo Nhi", "Trưởng mảng"), ("Nguyễn Võ Lan Thanh", "Phó mảng")],
            },
            {
                "code": "ĐN", "id": "dn", "name": "Đối ngoại",
                "lede": "Mảng chuyên trách tìm tài trợ, giữ quan hệ đối tác và đại diện cho "
                        "Đoàn - Hội khoa khi làm việc với bên thứ ba.",
                "duties": [
                    "Tìm kiếm và tiếp cận các doanh nghiệp tiềm năng.",
                    "Trao đổi trực tiếp và duy trì mối quan hệ với doanh nghiệp, đối tác.",
                    "Xây dựng và duy trì mối quan hệ với các Khoa, Viện, Câu lạc bộ, Đội, Nhóm khác.",
                ],
                "programs": [
                    {"name": "Hồ sơ tài trợ chương trình", "meta": "Theo mùa sự kiện",
                     "desc": "Xây bộ hồ sơ từ ý tưởng chương trình thành đề xuất mà doanh nghiệp đọc được.",
                     "img": "assets/images/programs/tcxd-dn-ho-so.jpg"},
                    {"name": "Kết nối bảo trợ chuyên môn", "meta": "Dài hạn",
                     "desc": "Đảm bảo mối quan hệ chuyên môn bền vững cho các chương trình trọng điểm",
                     "img": "assets/images/programs/tcxd-dn-bao-tro.jpg"},
                    {"name": "Cộng tác cùng các khách mời", "meta": "Sau mỗi chương trình",
                     "desc": "Xây dựng mối quan hệ với khách mời, diễn giả và các đơn vị hợp tác trong chương trình.",
                     "img": "assets/images/programs/tcxd-dn-khach-moi.jpg"},
                ],
                "must": ["Không ngại mở lời trước", "Viết email lịch sự", "Giữ lời hứa", "Kiên trì theo đuổi"],
                "plus": ["Tiếng Anh giao tiếp", "Biết làm proposal", "Từng đi xin tài trợ", "Mạng lưới quan hệ rộng"],
                "voices": [
                    {"q": "Mình gửi hai mươi thư ngỏ và nhận về hai lời hẹn. Lúc đó mới hiểu "
                          "vì sao mảng này cần lì hơn cần giỏi nói.",
                     "who": "Tập thể mảng", "role": "mảng Đối ngoại"},
                ],
                "people": [("Phạm Thị Ngọc Diệu", "Trưởng mảng"), ("Nguyễn Thu Trang", "Phó mảng"), ("Võ Trần Ngọc Ánh", "Phó mảng")],
            },
            {
                "code": "KT", "id": "kt", "name": "Kỹ thuật",
                "lede": "Mảng chuyên trách công nghệ và chia sẻ kinh nghiệm nền tảng của Đoàn - Hội khoa: sản phẩm số, "
                        "website, và kiến thức cơ sở ngành để chương trình vận hành đúng kỹ thuật.",
                "duties": [
                    "Quản lý và phát triển các sản phẩm số, website Đoàn - Hội khoa BIT.",
                    "Training nội bộ các công tác chuyên môn mảng và chia sẻ kinh nghiệm về học phần cơ sở ngành tại UEH.",
                    "Phụ trách kỹ thuật các chương trình.",
                ],
                "programs": [
                    {"name": "Dự án website Lửa dệt Sử đỏ", "meta": "Sản phẩm số",
                     "desc": "Phát triển, cập nhật và bảo trì kênh thông tin các hoạt động về nguồn của Đoàn - Hội khoa.",
                     "img": "assets/images/programs/tcxd-kt-lua-det-su-do.jpg"},
                    {"name": "Chuyên đề chia sẻ nội bộ về UI/UX", "meta": "Chuyên môn",
                     "desc": "Chia sẻ kinh nghiệm về các học phần cơ sở ngành tại UEH cho thành viên trong ban.",
                     "img": "assets/images/programs/tcxd-kt-uiux.jpg"},
                    {"name": "Dự án chuyển đổi số xã Tân Vĩnh Lộc", "meta": "Cộng tác kỹ thuật",
                     "desc": "Cộng tác cùng đơn vị xã thực hiện cải tiến hành chính.",
                     "img": "assets/images/programs/tcxd-kt-chuyen-doi-so.jpg"},
                ],
                "must": ["Cẩn thận với công cụ và dữ liệu", "Chịu học công nghệ mới", "Đúng deadline", "Bình tĩnh xử lý sự cố kỹ thuật"],
                "plus": ["Biết HTML/CSS/JS cơ bản", "Quen Google Workspace / Sheets", "Nắm chắc học phần cơ sở ngành", "Từng vận hành website hoặc công cụ nội bộ"],
                "voices": [
                    {"q": "Không ai để ý mảng Kỹ thuật cho tới khi trang web lỗi giữa đợt tuyển. "
                          "Việc của mình là làm sao để không ai phải để ý tới điều đó.",
                     "who": "Những người con yêu tinh", "role": "Tập thể mảng Kỹ thuật"},
                ],
                "people": [("Hồ Thị Diễm Trang", "Trưởng mảng"), ("Đinh Viết Quân", "Phó mảng")],
            },
        ],
    },
    {
        "id": "pttn",
        "slug": "ban-phong-trao-tinh-nguyen",
        "stamp": "pttn",
        "gem": "Diamond",
        "color": "#b9f6ff",
        "soft": "#b9f6ff1f",
        "name": "Ban Phong trào - Tình nguyện",
        "short": "PT-TN",
        "tagline": "Phần đời sinh viên mà sau này người ta kể lại nhiều nhất thường nằm ở đây: "
                   "một sân chơi, một chuyến đi, một buổi tối để nhớ nhau nhiều hơn.",
        "mission": [
            "Ban Phong trào - Tình nguyện tạo ra không khí. Ban giữ cho đời sống sinh viên BIT không chỉ có lịch học, "
            "bằng những sân chơi đủ vui để người ta rủ nhau đi.",
            "Đồng thời ban đóng vai trò chủ chốt trong các hoạt động tình nguyện, phong trào cấp khoa và cấp UEH "
            "góp phần kiến tạo cộng đồng sinh viên năng động, sáng tạo và có trách nhiệm.",
        ],
        "duties": [
            "<b>Tổ chức hoạt động phong trào</b>: thể thao, văn hoá, văn nghệ dành cho sinh viên.",
            "<b>Đồng hành và hỗ trợ sinh viên</b> trong các hoạt động nâng cao nhận thức, chăm sóc sức khoẻ tinh thần.",
            "<b>Phụ trách hoạt động tình nguyện</b>, phục vụ cộng đồng.",
            "<b>Giữ an toàn</b> cho người tham gia trong mọi hoạt động ngoài trời.",
            "<b>Gìn giữ tinh thần tập thể</b> giữa các khoá và các lớp.",
        ],
        "programs": [
            {"name": "Hội trại Truyền thống", "meta": "Văn hoá - văn nghệ - thể thao",
             "desc": "Sân chơi gắn kết giúp sinh viên khóa mới hòa nhập, thể hiện cá tính và sáng tạo.",
             "img": "assets/images/programs/pttn-hoi-trai.jpg"},
            {"name": "Việt Phục 2025: Hành trình xuyên thời gian", "meta": "Văn hoá",
             "desc": "Chương trình giúp sinh viên tìm hiểu lịch sử, nguồn gốc Việt phục và sự sáng tạo trong trang phục truyền thống.",
             "img": "assets/images/programs/pttn-viet-phuc.jpg"},
            {"name": "UEH League", "meta": "Thể thao",
             "desc": "Hoạt động thể thao trong nhóm chương trình văn hóa - văn nghệ - thể thao của ban.",
             "img": "assets/images/programs/pttn-ueh-league.jpg"},
            {"name": "Xuân tình nguyện", "meta": "Tình nguyện vì cộng đồng",
             "desc": "Chiến dịch mang đến những hoạt động ý nghĩa, giúp đỡ các hoàn cảnh kém may mắn trong dịp xuân.",
             "img": "assets/images/programs/pttn-xuan-tinh-nguyen.jpg"},
            {"name": "Vui hội Trăng Rằm", "meta": "Tình nguyện vì cộng đồng",
             "desc": "Hoạt động dịp Trung thu dành cho trẻ em có hoàn cảnh khó khăn, hướng tới một mùa Trung thu trọn vẹn.",
             "img": "assets/images/programs/pttn-trung-thu.jpg"},
            {"name": "Mùa hè xanh", "meta": "Tình nguyện vì cộng đồng",
             "desc": "Chiến dịch tình nguyện thường niên của Đoàn Thanh niên - Hội Sinh viên UEH.",
             "img": "assets/images/programs/pttn-mua-he-xanh.jpg"},
        ],
        "must": ["Nhiệt huyết, năng động", "Tư duy sáng tạo", "Lên kế hoạch", "Linh động xử lý tình huống"],
        "plus": ["Giao tiếp tốt", "Làm việc nhóm", "Nắm bắt xu hướng", "Dễ hòa nhập và sẻ chia"],
        "stats": [("Trọng điểm", "Các chiến dịch tình nguyện"), ("Đa dạng", "không gian phong trào"), ("Diamond", "viên đá đại diện")],
        "voices": [
            {"q": "Chuyến tình nguyện đầu tiên dạy mình rằng đến với một nơi xa lạ"
                  ", không phải để làm thay cho người ta, mà là để cùng họ làm. ",
             "who": "Tập thể Ban", "role": "Ban Phong trào - Tình nguyện"},
        ],
        "people": [("Đỗ Trọng Khanh", "Trưởng ban"),("Trần Thị Ngọc Lan", "Trưởng ban"),("Dương Thúy Hiền", "Phó ban"), ("Hồ Minh Khang", "Phó ban")],
        "mangs": [],
    },
    {
        "id": "tt",
        "slug": "ban-truyen-thong",
        "stamp": "tt",
        "gem": "Ruby",
        "color": "#ff799b",
        "soft": "#ff799b22",
        "name": "Ban Truyền thông",
        "short": "TT",
        "tagline": "Một hoạt động không được kể lại thì chỉ tồn tại với những người có mặt. "
                   "Truyền thông là nơi biến nó thành thứ người khác muốn tham gia lần sau.",
        "mission": [
            "Ban Truyền thông giữ giọng nói và gương mặt của Đoàn - Hội BIT. Từ một dòng caption tới một "
            "bộ ấn phẩm, ban quyết định người ngoài nhìn thấy gì khi họ gặp khoa lần đầu.",
            "Ban cũng là nơi lưu lại ký ức: mỗi tấm ảnh, mỗi thước phim là tài sản của khoá này "
            "để lại cho khoá sau.",
        ],
        "duties": [
            "<b>Sáng tạo hình ảnh, nội dung</b> cho các chương trình của Đoàn - Hội khoa.",
            "<b>Phối hợp, hỗ trợ</b> hoạt động và sự kiện cùng các ban chuyên môn khác.",
            "<b>Giữ nhận diện</b>: màu sắc, kiểu chữ, giọng văn thống nhất trên mọi kênh.",
            "<b>Vận hành kênh</b>: lên lịch đăng, theo dõi tương tác, trả lời bình luận và tin nhắn.",
        ],
        "programs": [
            {"name": "Radio Não Cá vàng", "meta": "Podcast thu âm",
             "desc": "Podcast chia sẻ kinh nghiệm học tập, kỹ năng mềm và đời sống sinh viên BIT.",
             "img": "assets/images/programs/tt-radio.jpg"},
            {"name": "Chuỗi truyền thông Đoàn - Hội khoa", "meta": "Truyền thông sáng tạo",
             "desc": "Các bài đăng, video và ấn phẩm truyền thông cho các chương trình, hoạt động của khoa.",
             "img": "assets/images/programs/tt-chuoi-truyen-thong.jpg"},
            {"name": "Phụ trách công tác truyền thông chương trình các ban", "meta": "IDEA",
             "desc": "Hỗ trợ các ban chuyên môn khác trong việc lên ý tưởng, thiết kế và vận hành truyền thông cho chương trình.",
             "img": "assets/images/programs/tt-ho-tro.jpg"},
        ],
        "must": ["Chịu được deadline gấp", "Nhận góp ý mà không tự ái", "Chỉn chu chính tả", "Đúng hẹn giao bài"],
        "plus": ["Canva / Adobe", "Viết tốt", "Chụp ảnh", "Dựng video", "Hiểu thuật toán mạng xã hội"],
        "stats": [("Sáng tạo", "Truyền cảm hứng tích cực"), ("Năng động", "Từng nhịp sản xuất"), ("Ruby", "Viên đá đại diện")],
        "voices": [
            {"q": "Mọi thứ đều có thể bắt đầu từ một ý tưởng rất vu vơ, một câu chữ chợt nghĩ ra, một layout muốn thử, hay đơn giản là một lần tự hỏi: 'Nếu làm khác đi thì sao?' "
                  "Đến với Ban Truyền thông, hãy mang theo sự tò mò với một cái đầu đầy ý tưởng và một chút can đảm để thử những điều chưa từng làm. Còn việc biến những ý tưởng ấy thành những hình hài, màu sắc và câu chuyện, hãy để tụi mình cùng nhau!",
             "who": "Tập thể Ban", "role": "Ban Truyền thông"},
        ],
        "people": [("Hoàng Kim Tùng", "Trưởng ban"), ("Lê Viết Bảo", "Phó ban"), ("Nguyễn Thị Ánh Hằng", "Phó ban")],
        "mangs": [
            {
                "code": "IDEA", "id": "content", "name": "Nội dung",
                "lede": "Mảng viết: bài đăng, caption, kịch bản, thông cáo và mọi con chữ "
                        "mang tên Đoàn - Hội BIT.",
                "duties": [
                    "Sáng tạo nội dung cho các chương trình, hoạt động của khoa.",
                    "Quản lý timeline truyền thông cho các hoạt động của khoa.",
                ],
                "programs": [
                    {"name": "Phụ trách các tuyến bài chương trình", "meta": "Định kỳ",
                     "desc": "Các bài đăng, caption, thông cáo và ấn phẩm truyền thông cho các chương trình, hoạt động của khoa.",
                     "img": "assets/images/programs/tt-idea-tuyen-bai.jpg"},
                    {"name": "Sáng tạo kịch bản video", "meta": "Phối hợp DEP",
                     "desc": "Từ outline tới lời thoại cuối cùng trước khi quay.",
                     "img": "assets/images/programs/tt-idea-kich-ban.jpg"},
                    {"name": "Tham gia sáng tác podcast", "meta": "Radio, podcast",
                     "desc": "Các tập podcast chia sẻ kinh nghiệm học tập, kỹ năng mềm và đời sống sinh viên BIT.",
                     "img": "assets/images/programs/tt-idea-podcast.jpg"},
                ],
                "must": ["Viết đúng chính tả", "Đọc kỹ đề bài", "Giao bài đúng hạn", "Chịu sửa nhiều vòng"],
                "plus": ["Từng viết cho page hoặc báo trường", "Biết SEO cơ bản", "Viết được tiếng Anh", "Có gu đọc rộng"],
                "voices": [
                    {"q": "Câu mình tâm đắc nhất thường là câu bị cắt đầu tiên. "
                          "Viết cho người đọc chứ không viết cho mình.",
                     "who": "Những người yêu deadline", "role": "Thành viên mảng IDEA"},
                ],
                "people": [
                  ("Hoàng Kim Tùng", "Trưởng ban"), ("Lê Viết Bảo", "Phó ban"), ("Nguyễn Thị Ánh Hằng", "Phó ban")],
            },
            {
                "code": "DEP", "id": "dep", "name": "Thiết kế - Hình ảnh",
                "lede": "Mảng làm hình: poster, ấn phẩm, ảnh và video. Thứ người ta nhìn thấy "
                        "trước khi đọc bất kỳ chữ nào.",
                "duties": [
                    "Thiết kế poster, ấn phẩm số và ấn phẩm in cho từng chương trình.",
                    "Edit video, xử lý âm thanh cho các clip của chương trình.",
                    "Thu âm cho các video chương trình, hoạt động.",
                    "Chụp ảnh cho các hoạt động, dự án của khoa.",
                ],
                "programs": [
                    {"name": "Chuỗi truyền thông Sinh viên 5 tốt", "meta": "Truyền thông",
                     "desc": "Các ấn phẩm truyền thông cho phong trào Sinh viên 5 tốt của khoa.",
                     "img": "assets/images/programs/tt-dep-sv5t.jpg"},
                    {"name": "Chiến dịch Xuân tình nguyện 2026: Gom nắng gieo xuân", "meta": "Truyền thông",
                     "desc": "Các ấn phẩm truyền thông cho chiến dịch Xuân tình nguyện 2026 của khoa.",
                     "img": "assets/images/programs/tt-dep-xtn.jpg"},
                    {"name": "Sắc Hoa Tri Ân", "meta": "Truyền thông",
                     "desc": "Các ấn phẩm truyền thông nội bộ cho chương trình chào mừng 20/11 của khoa.",
                     "img": "assets/images/programs/tt-dep-2011.jpg"},
                ],
                "must": ["Biết ít nhất một công cụ thiết kế", "Giữ file gốc gọn gàng", "Nhận feedback tốt", "Đúng deadline"],
                "plus": ["Photoshop / Illustrator", "Premiere / CapCut", "Có máy ảnh", "Biết motion graphics", "Có portfolio"],
                "voices": [
                    {"q": "Cái khó không phải làm đẹp, mà làm đẹp trong đúng bộ màu và đúng "
                          "kích thước mà mỗi kênh yêu cầu.",
                     "who": "Tình yêu với Canva", "role": "Thành viên mảng DEP"},
                ],
                "people": [("Hoàng Kim Tùng", "Trưởng ban"), ("Lê Viết Bảo", "Phó ban"), ("Nguyễn Thị Ánh Hằng", "Phó ban")],
            },
        ],
    },
    {
        "id": "htnckh",
        "slug": "ban-hoc-tap-nckh",
        "stamp": "htnckh",
        "gem": "Emerald",
        "color": "#6ce8ae",
        "soft": "#6ce8ae22",
        "name": "Ban Học tập - Nghiên cứu khoa học",
        "short": "HT-NCKH",
        "tagline": "Emerald biến việc học thành năng lực và sự tò mò thành những đề tài nghiên cứu có giá trị.",
        "mission": [
            "Ban Học tập - Nghiên cứu khoa học biến kiến thức rời rạc thành thứ dùng được: tài liệu ôn tập, workshop kỹ năng, "
            "và những buổi chia sẻ từ người đã đi trước.",
            "Ban cũng là cửa vào nghiên cứu khoa học cho sinh viên BIT, nơi một câu hỏi tò mò "
            "có thể trở thành niềm đam mê cho hành trình nghiên cứu khoa học tương lai.",
        ],
        "duties": [
            "<b>Tổ chức và quản lý</b> các giải thưởng, cuộc thi học thuật - NCKH.",
            "<b>Tổ chức hoạt động hỗ trợ</b> học tập - NCKH cho sinh viên.",
            "<b>Khuyến khích, giám sát và hỗ trợ</b> Chi đoàn - Chi hội, CLB ET, CLB DSC tổ chức các chương trình học tập - NCKH.",
            "<b>Lên kế hoạch</b> chương trình tuyên dương và trao giải cho sinh viên.",
        ],
        "programs": [
            {"name": "Hội thi rèn nghề", "meta": "Học tập",
             "desc": "Sân chơi học thuật giúp sinh viên rèn kỹ năng nghề nghiệp cốt lõi.",
             "img": "assets/images/programs/htnckh-ren-nghe.jpg"},
            {"name": "Chuỗi hoạt động định hướng nghề nghiệp", "meta": "Học tập",
             "desc": "Chuỗi chia sẻ giúp sinh viên hình dung rõ hơn con đường sự nghiệp sau này.",
             "img": "assets/images/programs/htnckh-dinh-huong.jpg"},
            {"name": "BIT Genesis Research Award", "meta": "NCKH",
             "desc": "Giải thưởng nghiên cứu khoa học của khoa, có lễ tổng kết và trao giải riêng.",
             "img": "assets/images/programs/htnckh-genesis.jpg"},
        ],
        "must": ["Học lực ổn định", "Đọc hiểu tài liệu dài", "Cẩn thận với nguồn", "Sẵn sàng giải thích cho người khác"],
        "plus": ["Đã tham gia NCKH", "Biết dùng công cụ thống kê", "Đọc được tài liệu tiếng Anh", "Kỹ năng thuyết trình"],
        "stats": [("Hoạt bát", "trong học thuật"), ("Cường tráng", "Trí tuệ khoa học"), ("Emerald", "Viên đá đại diện")],
        "voices": [
            {"q": "Mình từng nghĩ ban học tập là đi phát đề cương. Thực ra phần lớn thời gian "
                  "là ngồi đọc và kiểm xem tài liệu có sai chỗ nào không.",
             "who": "Tập thể Ban", "role": "Ban Học tập - NCKH"},
            {"q": "Những ý tưởng đầu tiên của tụi mình bị nhận xét là quá rộng. Sửa bốn lần mới ra "
                  "một câu hỏi đủ hẹp để trả lời được.",
             "who": "Tập thể Ban", "role": "Ban Học tập - NCKH"},
        ],
        "people": [("Nguyễn Thị Thúy Vân", "Trưởng ban"), ("Nguyễn Hồng Phúc", "Phó ban"), ("Nguyễn Đinh Thảo Nhi", "Phó ban")],
        "mangs": [
            {
                "code": "HT", "id": "ht", "name": "Học tập",
                "lede": "Mảng lo phần học hằng ngày của sinh viên khoa: tài liệu, workshop "
                        "và thông tin học vụ.",
                "duties": [
                    "Tổ chức Hội thi rèn nghề và Chuỗi Định hướng nghề nghiệp.",
                    "Tổ chức chặng cấp khoa của Cuộc thi Tranh biện Sinh viên Kinh tế UEH Debate.",
                    "Tổ chức chặng cấp khoa của Chuỗi Bình luận Sự kiện Kinh tế.",
                    "Đồng tổ chức cuộc thi MIS Talent quy mô toàn quốc.",
                ],
                "programs": [
                    {"name": "Hội thi rèn nghề", "meta": "Học kỳ",
                     "desc": "Cuộc thi rèn kỹ năng nghề nghiệp cho sinh viên khoa.",
                     "img": "assets/images/programs/htnckh-ht-ren-nghe.jpg"},
                    {"name": "Chuỗi hoạt động định hướng nghề nghiệp", "meta": "Trong học kỳ",
                     "desc": "Chia sẻ từ người đi trước để sinh viên hình dung rõ hơn con đường sự nghiệp.",
                     "img": "assets/images/programs/htnckh-ht-dinh-huong.jpg"},
                    {"name": "UEH Debate & Chuỗi bình luận kinh tế", "meta": "Học thuật",
                     "desc": "Cuộc thi tranh biện sinh viên kinh tế và chuỗi bình luận các vấn đề kinh tế thời sự.",
                     "img": "assets/images/programs/htnckh-ht-debate.jpg"},
                ],
                "must": ["Nắm chương trình học", "Giải thích dễ hiểu", "Ngăn nắp", "Tôn trọng bản quyền tài liệu"],
                "plus": ["Điểm số tốt ở môn cốt lõi", "Từng làm trợ giảng", "Biết dựng slide", "Tổ chức lớp học nhóm"],
                "voices": [
                    {"q": "Giải được bài là một chuyện. Giải sao cho bạn ngồi cạnh hiểu "
                          "lại là một kỹ năng hoàn toàn khác.",
                     "who": "Tập thể mảng", "role": "mảng Học tập"},
                ],
                "people": [("Nguyễn Thị Thúy Vân", "Trưởng ban"), ("Nguyễn Hồng Phúc", "Phó ban"), ("Nguyễn Đinh Thảo Nhi", "Phó ban")],
            },
            {
                "code": "NCKH", "id": "nckh", "name": "Nghiên cứu khoa học",
                "lede": "Mảng đồng hành cùng sinh viên làm nghiên cứu: từ một câu hỏi tò mò "
                        "tới một đề tài có thể bảo vệ.",
                "duties": [
                    "Tổ chức Cuộc thi Nghiên cứu khoa học Khoa Công nghệ thông tin kinh doanh.",
                    "Tổ chức lớp phương pháp Nghiên cứu khoa học.",
                    "Tổ chức Lễ tổng kết và trao giải BIT Genesis Research Award.",
                ],
                "programs": [
                    {"name": "Giải thưởng Nghiên cứu khoa học", "meta": "Học kỳ",
                     "desc": "Giải thưởng NCKH thường niên dành cho sinh viên khoa.",
                     "img": "assets/images/programs/htnckh-nc-giai-thuong.jpg"},
                    {"name": "Lớp phương pháp Nghiên cứu", "meta": "Nhập môn",
                     "desc": "Trang bị phương pháp luận cơ bản trước khi bắt tay vào một đề tài.",
                     "img": "assets/images/programs/htnckh-nc-lop-phuong-phap.jpg"},
                    {"name": "BIT Genesis Research Award", "meta": "Lễ tổng kết",
                     "desc": "Lễ tổng kết và trao giải nghiên cứu khoa học của khoa.",
                     "img": "assets/images/programs/htnckh-nc-genesis.jpg"},
                ],
                "must": ["Kiên nhẫn với dữ liệu", "Trung thực học thuật", "Đọc hiểu tài liệu chuyên ngành", "Làm việc có phương pháp"],
                "plus": ["SPSS / R / Python", "Đọc paper tiếng Anh", "Biết trích dẫn chuẩn", "Từng dự thi NCKH"],
                "voices": [
                    {"q": "Nghiên cứu không hào nhoáng. Nhưng lần đầu số liệu của mình "
                          "nói ra một điều mình chưa từng nghĩ tới thì rất đáng.",
                     "who": "Tập thể mảng", "role": "mảng NCKH"},
                ],
                "people": [("Nguyễn Thị Thúy Vân", "Trưởng ban"), ("Nguyễn Hồng Phúc", "Phó ban"), ("Nguyễn Đinh Thảo Nhi", "Phó ban")],
            },
        ],
    },
]

BAN_BY_ID = {b["id"]: b for b in BANS}


def mang_slug(ban, m):
    """Tên file trang riêng của một mảng, ví dụ 'ban-to-chuc-xay-dung-ns'."""
    return f"{ban['slug']}-{m['id']}"


ALL_MANGS = [(ban, m) for ban in BANS for m in ban["mangs"]]


# =============================================================================
# KHUNG TRANG
# =============================================================================

def head(title, desc, css_vars="", extra_js=()):
    scripts = "\n".join(
        '  <script defer src="js/%s"></script>' % s for s in ("config.js", "site.js") + tuple(extra_js)
    )
    style = ('\n  <style>:root { %s }</style>' % css_vars) if css_vars else ""
    return f"""<!doctype html>
<html lang="vi" data-bs-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="{e(desc)}">
  <meta name="theme-color" content="#071323">
  <title>{e(title)}</title>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="{FONTS}">
  <link rel="stylesheet" href="{BS_CSS}" crossorigin="anonymous">
  <link rel="stylesheet" href="css/style.css">{style}
  <script defer src="{BS_JS}" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
{scripts}
</head>"""


def navbar(active):
    def link(href, label, key):
        cls = "nav-link active" if key == active else "nav-link"
        cur = ' aria-current="page"' if key == active else ""
        return f'<li class="nav-item"><a class="{cls}" href="{href}"{cur}>{label}</a></li>'

    groups = []
    for ban in BANS:
        label = f'<span><span class="gem-dot" style="--dot:{ban["color"]}"></span>{e(ban["gem"])} · {e(ban["short"])}</span>'
        if not ban["mangs"]:
            groups.append(f'<li><a class="dropdown-item" href="{ban["slug"]}.html">{label}</a></li>')
            continue
        subs = [f'<li><a class="dropdown-item" href="{ban["slug"]}.html">Tổng quan ban</a></li>']
        for m in ban["mangs"]:
            subs.append(
                f'<li><a class="dropdown-item" href="{mang_slug(ban, m)}.html">'
                f'{e(m["code"])} · {e(m["name"])}</a></li>'
            )
        groups.append(
            '<li class="nav-l3">'
            f'<a class="dropdown-item" href="{ban["slug"]}.html" role="button" aria-haspopup="true">'
            f'{label}</a>'
            f'<ul class="dropdown-menu">{"".join(subs)}</ul>'
            "</li>"
        )

    ban_active = " active" if active in BAN_BY_ID else ""
    return f"""  <header class="site-header">
    <div class="read-bar" aria-hidden="true"></div>
    <nav class="navbar navbar-expand-xxl container" aria-label="Điều hướng chính">
      <a class="navbar-brand brand header-brand" href="index.html" aria-label="Đoàn - Hội khoa Công nghệ thông tin kinh doanh | R.E.S.D — Trang chủ"><span class="header-bit"><img class="header-faculty-logo" src="assets/images/logo-khoa-trang.png" alt="" width="989" height="335"><span class="header-bit-copy"><small><span>ĐOÀN - HỘI</span><span>KHOA CÔNG NGHỆ THÔNG TIN KINH DOANH</span></small></span></span><span class="brand-divider" aria-hidden="true">|</span><span class="brand-resd">R.E.S.D</span></a>
      <div class="collapse navbar-collapse" id="main-nav">
        <ul class="navbar-nav ms-auto align-items-xxl-center gap-xxl-2">
          {link("index.html", "Trang chủ", "home")}
          {link("gioi-thieu.html", "R.E.S.D là gì", "gioi-thieu")}
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle{ban_active}" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Ban chuyên môn</a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><h6 class="dropdown-header">Bốn viên đá, bốn ban chuyên môn</h6></li>
              {"".join(groups)}
            </ul>
          </li>
          {link("test-dinh-huong.html", "Test định hướng", "test")}
          {link("lien-he.html", "Liên hệ", "lien-he")}
          <li class="nav-item"><button class="nav-tool" type="button" data-palette-open aria-label="Tìm kiếm nhanh trên toàn bộ cổng thông tin">Tìm nhanh <kbd>Ctrl</kbd><kbd>K</kbd></button></li>
        </ul>
      </div>
      <div class="header-actions">
        <a class="header-register" data-config-link="formOpenUrl">Đơn đăng ký</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-nav" aria-controls="main-nav" aria-expanded="false" aria-label="Mở menu điều hướng"><span class="navbar-toggler-icon"></span></button>
      </div>
    </nav>
  </header>"""


def palette():
    return """  <div class="palette" data-palette hidden role="dialog" aria-modal="true" aria-label="Tìm kiếm nhanh">
    <div class="palette-box">
      <input type="text" placeholder="Tìm ban, mảng hoặc trang…" aria-label="Từ khoá tìm kiếm" autocomplete="off">
      <ul class="palette-results"></ul>
      <p class="palette-empty" hidden>Không tìm thấy mục nào khớp. Thử từ khoá ngắn hơn, ví dụ "nhân sự" hoặc "thiết kế".</p>
      <div class="palette-foot"><span>↑ ↓ di chuyển</span><span>Enter mở</span><span>Esc đóng</span></div>
    </div>
  </div>"""


def footer():
    ban_links = "".join(
        f'<li><a href="{b["slug"]}.html">{e(b["gem"])} · {e(b["name"])}</a></li>' for b in BANS
    )
    return f"""  <footer class="site-footer">
    <div class="container"> 
  <div class="row gy-4"> 
    <!-- Cột 1: Chiếm đúng 5 phần trên màn hình lớn -->
    <div class="col-12 col-lg-5"> 
      <a class="navbar-brand brand footer-brand" href="index.html" aria-label="Đoàn - Hội khoa Công nghệ thông tin kinh doanh | R.E.S.D — Trang chủ">
        <span class="footer-faculty">
          <img class="footer-faculty-logo" src="assets/images/logo-khoa-trang.png" alt="" width="989" height="335">
          <span class="footer-faculty-copy"><span>ĐOÀN - HỘI</span><span>KHOA CÔNG NGHỆ THÔNG TIN KINH DOANH</span></span>
        </span>
        <span class="footer-divider" aria-hidden="true">|</span>
        <span class="footer-resd">R.E.S.D</span>
      </a> 
      <p class="mt-3">Cổng thông tin chương trình Tìm kiếm Cộng tác viên R.E.S.D của Đoàn - Hội khoa Công nghệ thông tin kinh doanh, Đại học Kinh tế TP.HCM.</p> 
    </div> 

    <!-- 3 Cột sau: Dùng col-lg để tự động chia đều 7 phần còn lại -->
    <div class="col-6 col-lg"> 
      <h4>Bốn viên đá</h4> 
      <ul>{ban_links}</ul> 
    </div> 

    <div class="col-6 col-lg"> 
      <h4>Hành trình</h4> 
      <ul> 
        <li><a href="gioi-thieu.html">R.E.S.D là gì</a></li> 
        <li><a href="gioi-thieu.html#so-sanh">Khám phá bốn ban</a></li>
        <li><a href="test-dinh-huong.html">Test định hướng</a></li> 
        <li><a href="lien-he.html">Câu hỏi thường gặp</a></li> 
      </ul> 
    </div> 

    <div class="col-6 col-lg"> 
      <h4>Kết nối</h4> 
      <ul> 
        <li><a data-config-link="fanpageUrl">Fanpage BIT.UEH</a></li> 
        <li><a data-config-link="bookletUrl">Booklet R.E.S.D</a></li> 
        <li><a data-config-link="formOpenUrl">Đơn đăng ký</a></li> 
        <li><a href="lien-he.html">Liên hệ trực tiếp</a></li> 
      </ul> 
    </div> 
  </div> 
  
  <div class="footer-bottom"> 
    <span> Cổng thông tin chương trình Tìm kiếm Cộng tác viên R.E.S.D · Đoàn - Hội khoa Công nghệ thông tin kinh doanh, UEH</span> 
  </div> 
</div>"""

def page(title, desc, active, stamp, body, css_vars="", extra_js=()):
    return "\n".join([
        head(title, desc, css_vars, extra_js),
        f'<body data-stamp="{stamp}">',
        '  <a class="skip-link" href="#main-content">Đến nội dung chính</a>',
        navbar(active),
        '  <main id="main-content" tabindex="-1">',
        body,
        "  </main>",
        footer(),
        palette(),
        "</body>",
        "</html>",
        "",
    ])


# =============================================================================
# KHỐI NỘI DUNG DÙNG LẠI
# =============================================================================

def section_head(kicker, title, sub=""):
    p = f"<p>{sub}</p>" if sub else ""
    return (f'<div class="section-head reveal"><p class="kicker">{e(kicker)}</p>'
            f"<h2>{title}</h2>{p}</div>")


def gem_list(items):
    return '<ul class="gem-list">' + "".join(f"<li>{i}</li>" for i in items) + "</ul>"


def program_initials(name):
    letters = [w[0] for w in re.findall(r"[^\W\d_]+", name, flags=re.UNICODE)[:2]]
    return "".join(letters).upper() or "•"


def programs_grid(items):
    """Lưới chương trình nổi bật: Load ảnh thật nếu được khai báo trong key 'img', 
    nếu không tự động lùi về khung giữ chỗ (fallback) chữ cái đầu."""
    cards = []
    for p in items:
        if p.get('img'):
            # Nếu có ảnh: render thẻ img. (style nội tuyến đảm bảo ảnh cover đẹp khung)
            media_html = f'<img src="{e(p["img"])}" alt="{e(p["name"])}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; display: block;">'
        else:
            # Nếu chưa có ảnh: render placeholder
            media_html = f"""
                <span class="program-ph">{e(program_initials(p['name']))}</span>
                <span class="program-ph-note">Ảnh minh hoạ · chờ cập nhật</span>
            """

        cards.append(f"""<article class="program-card reveal" tabindex="0" aria-label="{e(p['name'])}. {e(p['desc'])}">
          <div class="program-media" aria-hidden="true">
            {media_html}
          </div>
          <div class="program-caption"><p class="meta">{e(p['meta'])}</p><h4>{e(p['name'])}</h4></div>
          <div class="program-desc"><p>{e(p['desc'])}</p></div>
        </article>""")
        
    return f'<div class="card-grid grid-3 reveal">{"".join(cards)}</div>'


def skills_block(must, plus):
    m = "".join(f'<span class="chip is-gem">{e(s)}</span>' for s in must)
    p = "".join(f'<span class="chip">{e(s)}</span>' for s in plus)
    return f"""<div class="skill-split reveal">
        <div class="skill-box is-must">
          <h4>Cần có</h4>
          <p class="hint">Đây là phần chúng tôi thật sự nhìn vào khi phỏng vấn.</p>
          <div class="chip-row">{m}</div>
        </div>
        <div class="skill-box">
          <h4>Có thì càng tốt</h4>
          <p class="hint">Không có cũng không sao. Vào rồi học cũng kịp.</p>
          <div class="chip-row">{p}</div>
        </div>
      </div>"""


def voices_block(items):
    cards = "".join(
        f'<figure class="voice"><blockquote>{e(v["q"])}</blockquote>'
        f'<figcaption><span class="avatar" aria-hidden="true">?</span>'
        f'<span><span class="who d-block">{e(v["who"])}</span>'
        f'<span class="role">{e(v["role"])}</span></span></figcaption></figure>'
        for v in items
    )
    return f'<div class="card-grid grid-2 reveal">{cards}</div>'


def people_block(items):
    cards = []
    for name, pos in items:
        if name:
            initials = "".join(w[0] for w in name.split()[-2:]).upper()
            cards.append(f'<div class="person"><span class="initials" aria-hidden="true">{e(initials)}</span>'
                         f'<span class="name">{e(name)}</span><span class="pos">{e(pos)}</span></div>')
        else:
            cards.append('<div class="person is-empty"><span class="initials" aria-hidden="true">+</span>'
                         f'<span class="name">Đang cập nhật</span><span class="pos">{e(pos)}</span></div>')
    return f'<div class="people reveal">{"".join(cards)}</div>'


# =============================================================================
# TRANG BAN CHUYÊN MÔN
# =============================================================================

def mang_cards(ban):
    """Lưới thẻ tóm tắt các mảng trên trang tổng quan ban, dẫn sang trang riêng của từng mảng."""
    cards = "".join(f"""<a class="mang-card reveal" href="{mang_slug(ban, m)}.html" style="--gem:{ban['color']}">
          <span class="code">{e(m['code'])}</span>
          <h3>Mảng {e(m['name'])}</h3>
          <p>{e(m['lede'])}</p>
          <span class="go">Xem trang mảng ↗</span>
        </a>""" for m in ban["mangs"])
    return f'<div class="card-grid grid-{min(len(ban["mangs"]), 3)} reveal">{cards}</div>'


def mang_siblings(ban, current):
    """Thanh chuyển nhanh sang mảng khác cùng ban, hiện ở đầu trang mảng."""
    items = "".join(
        f'<a href="{mang_slug(ban, m)}.html"{" aria-current=\"page\" class=\"is-current\"" if m is current else ""}>'
        f'{e(m["code"])} · {e(m["name"])}</a>'
        for m in ban["mangs"]
    )
    return f'<nav class="mang-jump" aria-label="Các mảng khác của {e(ban["short"])}">{items}</nav>'


def build_mang(ban, m):
    """Trang riêng của một mảng chuyên môn."""
    body = f"""    <section class="page-hero">
      <div class="container">
        <p class="crumbs"><a href="index.html">Trang chủ</a> › <a href="{ban['slug']}.html">{e(ban['short'])}</a> › Mảng {e(m['name'])}</p>
        <p class="gem-label"><span class="gem-dot" style="--dot:{ban['color']}"></span>{e(ban['gem'])} · {e(ban['short'])} · {e(m['code'])}</p>
        <h1>Mảng {e(m['name'])}</h1>
        <p class="tagline">{e(m['lede'])}</p>
        {mang_siblings(ban, m)}
      </div>
    </section>

    <section class="section">
      <div class="container">
        {section_head("Nhiệm vụ", "Việc mảng này làm hằng tuần")}
        <div class="row gy-4">
          <div class="col-lg-7 reveal">{gem_list([e(d) for d in m['duties']])}</div>
          <div class="col-lg-5">
            <div class="panel reveal">
              <h3>Thuộc ban</h3>
              <p>Mảng {e(m['name'])} nằm trong <a href="{ban['slug']}.html">{e(ban['name'])}</a> ({e(ban['gem'])}).
              Đọc thêm về sứ mệnh chung của cả ban trước khi quyết định nguyện vọng.</p>
              <p class="mt-3"><a class="btn-ghost" href="{ban['slug']}.html">Xem tổng quan {e(ban['short'])}</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        {section_head("Chương trình nổi bật", f"Những gì mảng {e(m['name'])} đã và đang làm",
                      "Danh sách mang tính đại diện. Tên và quy mô chương trình cập nhật theo từng năm học.")}
        {programs_grid(m['programs'])}
      </div>
    </section>

    <section class="section">
      <div class="container">
        {section_head("Yêu cầu và kỹ năng", "Mảng tìm người như thế nào")}
        {skills_block(m['must'], m['plus'])}
      </div>
    </section>

    <section class="section">
      <div class="container">
        {section_head("Lời nhắn từ thành viên", f"Người trong mảng nói gì {draft_flag(m['voices'])}")}
        {voices_block(m['voices'])}
      </div>
    </section>

    <section class="section">
      <div class="container">
        {section_head("Nhân sự", f"Phụ trách mảng {e(m['code'])}",
                      "Danh sách cập nhật vào đầu mỗi nhiệm kỳ.")}
        {people_block(m['people'])}
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="panel reveal">
          <h3>Chưa chắc {e(m['code'])} có phải chỗ của bạn?</h3>
          <p>Làm bài kiểm tra định hướng 24 câu để xem bạn nghiêng về lựa chọn nào trong tám lựa chọn chuyên môn của R.E.S.D, rồi quay lại đọc kỹ gợi ý đó.</p>
          <div class="hero-actions mt-3">
            <a class="btn-gem" href="test-dinh-huong.html">Làm bài kiểm tra định hướng</a>
            <a class="btn-ghost" href="{ban['slug']}.html">Xem các mảng khác của {e(ban['short'])}</a>
          </div>
        </div>
      </div>
    </section>"""

    css_vars = f"--gem: {ban['color']}; --gem-soft: {ban['soft']};"
    return page(
        f"Mảng {m['name']} · {ban['short']} | R.E.S.D",
        m["lede"][:155],
        ban["id"], ban["stamp"], body, css_vars,
    )


def build_ban(ban):
    stats = "".join(f"<li><b>{e(v)}</b>{e(l)}</li>" for v, l in ban["stats"])
    jumps = "".join(
        f'<a href="{mang_slug(ban, m)}.html">{e(m["code"])} · {e(m["name"])}</a>' for m in ban["mangs"]
    )
    mang_nav = (
        f'        <nav class="mang-jump" aria-label="Các mảng của {e(ban["short"])}">{jumps}</nav>'
        if jumps else ""
    )
    mang_section = f"""    <section class="section">
      <div class="container">
        {section_head("Các mảng", f"{len(ban['mangs'])} mảng chuyên môn, mỗi mảng một trang riêng",
                      "Mỗi mảng có nhiệm vụ, chương trình và bộ kỹ năng riêng. Bạn đăng ký theo mảng, không đăng ký chung chung — bấm vào thẻ để đọc đầy đủ.")}
        {mang_cards(ban)}
      </div>
    </section>
""" if ban["mangs"] else ""
    mission = "".join(f"<p>{e(p)}</p>" for p in ban["mission"])

    body = f"""    <section class="page-hero">
      <div class="container">
        <p class="crumbs"><a href="index.html">Trang chủ</a> › <a href="gioi-thieu.html">Ban chuyên môn</a> › {e(ban['short'])}</p>
        <p class="gem-label"><span class="gem-dot" style="--dot:{ban['color']}"></span>{e(ban['gem'])} · {e(ban['short'])}</p>
        <h1>{e(ban['name'])}</h1>
        <p class="tagline">{e(ban['tagline'])}</p>
        <ul class="hero-stats">{stats}</ul>
{mang_nav}
      </div>
    </section>

    <section class="section">
      <div class="container">
        {section_head("Sứ mệnh", "Nhiệm vụ chung của ban", "Đọc kỹ phần này trước khi quyết định nguyện vọng.")}
        <div class="row gy-4">
          <div class="col-lg-7 reveal">{mission}</div>
          <div class="col-lg-5">
            <div class="panel reveal">
              <h3>Nhiệm vụ chính</h3>
              {gem_list(ban['duties'])}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        {section_head("Chương trình nổi bật", "Những gì ban đã và đang làm",
                      "Danh sách mang tính đại diện. Tên và quy mô chương trình cập nhật theo từng năm học.")}
        {programs_grid(ban['programs'])}
      </div>
    </section>

    <section class="section">
      <div class="container">
        {section_head("Yêu cầu chung", "Ban tìm người như thế nào")}
        {skills_block(ban['must'], ban['plus'])}
      </div>
    </section>

    <section class="section">
      <div class="container">
        {section_head("Lời nhắn nhủ", f"Người trong ban nói gì {draft_flag(ban['voices'])}")}
        {voices_block(ban['voices'])}
      </div>
    </section>

    <section class="section">
      <div class="container">
        {section_head("Nhân sự", "Ban điều hành",
                      "Danh sách cập nhật vào đầu mỗi nhiệm kỳ.")}
        {people_block(ban['people'])}
      </div>
    </section>

{mang_section}

    <section class="section">
      <div class="container">
        <div class="panel reveal">
          <h3>Chưa chắc {e(ban['short'])} có phải chỗ của bạn?</h3>
          <p>Làm bài kiểm tra định hướng 24 câu để xem bạn nghiêng về lựa chọn nào trong tám lựa chọn chuyên môn của R.E.S.D, rồi quay lại đọc kỹ gợi ý đó.</p>
          <div class="hero-actions mt-3">
            <a class="btn-gem" href="test-dinh-huong.html">Làm bài kiểm tra định hướng</a>
            <a class="btn-ghost" href="gioi-thieu.html#so-sanh">So sánh bốn ban</a>
          </div>
        </div>
      </div>
    </section>"""

    css_vars = f"--gem: {ban['color']}; --gem-soft: {ban['soft']};"
    return page(
        f"{ban['name']} ({ban['short']}) | R.E.S.D",
        ban["tagline"][:155],
        ban["id"], ban["stamp"], body, css_vars,
    )


# =============================================================================
# TRANG CHỦ
# =============================================================================

def starmap_csv():
    """Đọc CSV lúc build và nhúng vào trang CHỈ tên + số thứ tự cung hoàng đạo (đã xếp theo vòng hoàng đạo).
    Ngày sinh không đi vào HTML. Nên đặt CSV ở tools/ (cạnh file này) thay vì assets/ để không bị public."""
    import csv, datetime, json
    here = os.path.dirname(os.path.abspath(__file__))
    for path in (os.path.join(here, "Danh_sach_sinh_nhat.csv"),
                 os.path.join(ROOT, "assets", "data", "Danh_sach_sinh_nhat.csv")):
        if os.path.exists(path):
            break
    else:
        print("  CẢNH BÁO: không thấy Danh_sach_sinh_nhat.csv, bản đồ sao sẽ trống.")
        return "[]"
    starts = [(3, 21), (4, 20), (5, 21), (6, 21), (7, 23), (8, 23), (9, 23), (10, 23), (11, 22), (12, 22), (1, 20), (2, 19)]
    ref = datetime.date(2000, 3, 21)
    rows = []
    with open(path, encoding="utf-8-sig", newline="") as fh:
        for r in list(csv.reader(fh))[1:]:
            try:
                name, d, m = r[0].strip(), *map(int, r[1].strip().split("/")[:2])
                day = datetime.date(2000, m, d)
            except (IndexError, ValueError):
                continue
            if not name:
                continue
            key = (day - ref).days % 366
            sign = max(i for i, (sm, sd) in enumerate(starts) if (day - ref).days % 366 >= (datetime.date(2000, sm, sd) - ref).days % 366)
            rows.append((key, name, sign))
    rows.sort(key=lambda x: (x[0], x[1]))
    return json.dumps([[n, s] for _, n, s in rows], ensure_ascii=False).replace("</", "<\\/")


def build_home():
    cards = "".join(
        f'''<a class="planet-card reveal" href="{b['slug']}.html" style="--gem:{b['color']}">
            <div class="card-content">
                <span class="gem-name">{e(b['gem'])}</span>
                <h3>{e(b['name'])}</h3>
                <p>{e(b['tagline'].split('.')[0].rsplit(' ', 1)[0])}&nbsp;{e(b['tagline'].split('.')[0].split()[-1])}.</p>
            </div>
            <span class="go">Khám phá viên đá này</span>
        </a>''' 
        for b in BANS
    )

    body = f"""    <section class="hero" id="home" aria-labelledby="hero-title">
      <div class="container position-relative">
        <div class="row align-items-center gy-4">
          <div class="col-lg-6 hero-copy">
            <p class="eyebrow"><span class="status-dot" aria-hidden="true"></span> CỔNG THÔNG TIN CHƯƠNG TRÌNH</p>
            <h1 id="hero-title">R.E.S.D<span class="title-star" aria-hidden="true">✦</span></h1>
            <p class="hero-slogan">Mỗi sắc màu.<br>Một hành trình <span>toả sáng.</span></p>
            <p class="hero-description">Mừng bạn đến với Chương trình Tìm kiếm Cộng tác viên R.E.S.D thuộc Đoàn - Hội khoa Công nghệ thông tin kinh doanh. Chỉ với vài phút, bạn sẽ tự tin bước trên hành trình bứt phá. Đừng để tiềm năng dừng lại ở những đắn đo.</p>
            <div class="hero-actions">
              <a class="btn-gem" href="test-dinh-huong.html">Làm bài kiểm tra định hướng</a>
            </div>
            <p class="hero-note">Bốn viên đá quý. Chung một tinh thần BIT.</p>
          </div>
          <div class="col-lg-6">
            <div class="planet-scene" id="resd-planet" tabindex="-1" role="img" aria-label="Bốn viên đá quý R.E.S.D: Sapphire, Diamond, Emerald và Ruby.">
              <div class="orbit orbit-outer" aria-hidden="true"></div>
              <div class="orbit orbit-inner" aria-hidden="true"></div>
              <div class="planet" aria-hidden="true"><span class="planet-wordmark">R.E.S.D</span><span class="planet-caption">THE BIT UNIVERSE</span></div>
              <div class="planet-ring" aria-hidden="true"></div>
              <a class="gem gem-sapphire" href="ban-to-chuc-xay-dung.html" aria-label="Sapphire — Ban Tổ chức - Xây dựng"><i aria-hidden="true"></i><span>SAPPHIRE</span></a>
              <a class="gem gem-diamond" href="ban-phong-trao-tinh-nguyen.html" aria-label="Diamond — Ban Phong trào - Tình nguyện"><i aria-hidden="true"></i><span>DIAMOND</span></a>
              <a class="gem gem-emerald" href="ban-hoc-tap-nckh.html" aria-label="Emerald — Ban Học tập - Nghiên cứu khoa học"><i aria-hidden="true"></i><span>EMERALD</span></a>
              <a class="gem gem-ruby" href="ban-truyen-thong.html" aria-label="Ruby — Ban Truyền thông"><i aria-hidden="true"></i><span>RUBY</span></a>
              <span class="scene-spark spark-one" aria-hidden="true">✦</span>
              <span class="scene-spark spark-two" aria-hidden="true">✧</span>
            </div>
          </div>
        </div>
        <div class="hero-bottom" aria-hidden="true"><span>TRẠM ĐIỀU PHỐI R.E.S.D</span><span>KHỞI ĐẦU HÀNH TRÌNH <span class="bottom-star">✦</span></span></div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="row gy-4 align-items-stretch">
          <div class="col-lg-6">
            <div class="countdown reveal">
              <h3>Điểm hẹn gần nhất</h3>
              <p class="when" data-event-title>Hạn chót nhận đơn ứng tuyển</p>
              <div class="clock" data-countdown>
                <div><b data-unit="d">–</b><span>ngày</span></div>
                <div><b data-unit="h">–</b><span>giờ</span></div>
                <div><b data-unit="m">–</b><span>phút</span></div>
                <div><b data-unit="s">–</b><span>giây</span></div>
              </div>
              <p data-countdown-done hidden>Đã hết thời gian nhận đơn. Bạn vẫn có thể làm bài kiểm tra bất cứ lúc nào.</p>
              <ul class="disclaimer">
                <li>Vòng CV: 16/09–03/10/2026</li>
                <li>Phỏng vấn: 04/10–11/10/2026</li>
                <li>Công bố kết quả: 18/10/2026</li>
              </ul>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="panel reveal h-100">
              <h3>Bạn đã sẵn sàng bắt sóng thế hệ mới chưa?</h3>
              <p>Cổng thông tin được thiết kế để tối ưu hóa hành trình ứng tuyển của bạn. Chỉ qua vài bước định hướng, bạn sẽ dễ dàng xác định thế mạnh cá nhân và hoàn tất đơn đăng ký.</p>
              <p>Bốn viên đá phản chiếu 4 hành trình khác biệt, nhưng cùng hội tụ tại một tầm nhìn chung với BIT. Hãy bắt đầu hành trình bứt phá của bạn ngay hôm nay.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
  <div class="container">
    {section_head("Lộ trình", "Bốn bước, theo đúng thứ tự này")}
    <div class="row gy-4">
      
      <!-- Cột trái: Giảm xuống col-lg-6 -->
      <div class="col-lg-6">
        <ol class="journey reveal">
          <li><span class="dot">1</span><h4>Hiểu R.E.S.D là gì</h4><p>Đọc phần giới thiệu để biết chương trình này giải quyết chuyện gì và bạn sẽ nhận lại được gì. <a href="gioi-thieu.html">Đọc phần giới thiệu</a></p></li>
          <li><span class="dot">2</span><h4>Định vị bản thân</h4><p>Làm bài kiểm tra 24 câu về thói quen làm việc, thế mạnh và cách bạn tạo giá trị. Kết quả gợi ý ban hoặc mảng phù hợp. <a href="test-dinh-huong.html">Làm bài kiểm tra</a></p></li>
          <li><span class="dot">3</span><h4>Đọc kỹ lựa chọn được gợi ý</h4><p>Mỗi lựa chọn có trang riêng với nhiệm vụ, chương trình và bộ kỹ năng. Đọc xong hãy tự hỏi mình có muốn làm những việc đó hằng tuần không.</p></li>
          <li><span class="dot">4</span><h4>Điền đơn đăng ký</h4><p>Biểu mẫu ngay đầu trang cùng đường tới booklet đầy đủ.</p></li>
        </ol>
      </div>

      <!-- Cột phải: Rộng hơn bản cũ 1 số (từ col-lg-5 thành col-lg-6) -->
      <div class="col-lg-6">
        <div class="passport reveal" data-passport>
          <div class="passport-ring">
            <svg width="156" height="156" viewBox="0 0 156 156" aria-hidden="true">
              <circle class="track" cx="78" cy="78" r="66"></circle>
              <circle class="bar" cx="78" cy="78" r="66" stroke-dasharray="414" stroke-dashoffset="414"></circle>
            </svg>
            <div class="value"><b data-passport-count>0/8</b><span>trạm đã ghé</span></div>
          </div>
          <div class="passport-body">
            <h3>Hộ chiếu vũ trụ</h3>
            <p data-passport-note>Mỗi trang bạn mở sẽ được tự đóng dấu.</p>
            <ul class="stamps" data-passport-stamps></ul>
            <div class="passport-actions">
              <button class="btn-ghost" type="button" data-passport-reset>Xoá hộ chiếu</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

    <section class="section">
      <div class="container">
        {section_head("Bốn viên đá", "Chọn nơi bạn muốn bắt đầu",
                      "Mỗi viên đá đại diện cho một ban với màu sắc và cách làm việc riêng.")}
        <div class="card-grid grid-4">{cards}</div>
      </div>
    </section>
<!-- BẮT ĐẦU: BẢN ĐỒ SAO CÁ NHÂN -->
<section class="section" id="bit-star-map">
  <div class="container text-center">
    <div class="section-head mx-auto reveal">
      <p class="kicker">Hành trình bắt đầu từ một vì sao xa lạ</p>
      <h2 style="font-size: clamp(2rem, 5vw, 3rem); text-shadow: 0 0 15px var(--resd-cyan);">Những vì tinh tú BIT</h2>
      <p style="color: var(--resd-cyan); font-style: italic; margin-top: 10px;">
        "Cho dù bạn là ai, khi bạn chọn đồng hành cùng BIT, bạn sẽ luôn là một vì sao sáng nhất trong vũ trụ BIT."
      </p>
    </div>

    <div class="starmap-tools reveal">
      <div class="starmap-search">
        <label for="starSearch">Tìm ngôi sao của bạn</label>
        <input id="starSearch" type="search" placeholder="Gõ tên của bạn, không cần dấu" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="starResults" disabled>
        <ul id="starResults" class="starmap-results" role="listbox" hidden></ul>
      </div>
      <button class="btn-gem" id="toggleShapeBtn" type="button" disabled>Đang tải...</button>
    </div>

    <div class="starmap-container reveal">
      <svg id="starmap-svg" viewBox="-20 -20 1029 375" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Logo BIT được tạo thành từ các ngôi sao, mỗi ngôi sao là một thành viên"></svg>
      <div id="starmapLoading" class="starmap-loading" role="status"><span id="loadingText">Đang tải bản đồ sao...</span></div>
    </div>
    <script type="application/json" id="starmap-data">{starmap_csv()}</script>
  </div>
</section>
    <section class="section">
      <div class="container">
        <div class="panel reveal">
          <h3>Sẵn sàng định vị toạ độ của mình?</h3>
          <p>Bài kiểm tra mất khoảng sáu phút. Không có câu trả lời đúng hay sai, và bạn có thể tải kết quả về dưới dạng ảnh.</p>
          <div class="hero-actions mt-3">
            <a class="btn-gem" href="test-dinh-huong.html">Làm bài kiểm tra định hướng</a>
            <a class="btn-ghost" data-config-link="bookletUrl">Xem booklet R.E.S.D</a>
          </div>
        </div>
      </div>
    </section>"""

    return page(
        "R.E.S.D | Cổng thông tin chương trình — Đoàn - Hội BIT",
        "Cổng thông tin chương trình R.E.S.D: bốn ban chuyên môn, tám lựa chọn, bài kiểm tra định hướng và đơn đăng ký.",
        "home", "home", body, extra_js=("main.js","starmap.js"),
    )


# =============================================================================
# TRANG GIỚI THIỆU
# =============================================================================

def build_intro():
    rows = [
        ("Việc chính hằng tuần", ["Dựng kế hoạch, phân công, lo nguồn lực và thiết bị",
                                  "Tổ chức sân chơi, giải đấu và các chuyến tình nguyện",
                                  "Viết bài, thiết kế, chụp ảnh, dựng video",
                                  "Làm workshop, tổng hợp tài liệu, hỗ trợ đề tài"]),
        ("Nhịp việc", ["Dồn vào trước và trong sự kiện",
                       "Theo mùa hoạt động, nhiều việc ngoài trời",
                       "Đều đặn hằng tuần, cao điểm trước sự kiện",
                       "Theo học kỳ, bám lịch thi và lịch đăng ký đề tài"]),
        ("Bạn sẽ giỏi lên ở", ["Quản lý dự án, thương lượng, vận hành",
                               "Dẫn dắt đám đông, xử lý tình huống, làm việc cộng đồng",
                               "Viết, thiết kế, sản xuất nội dung",
                               "Nghiên cứu, phân tích, truyền đạt kiến thức"]),
        ("Hợp với bạn nếu", ["Bạn thấy an tâm khi mọi thứ có checklist",
                             "Bạn không ngồi yên được và thích ở giữa đám đông",
                             "Bạn có gu và muốn làm ra sản phẩm nhìn thấy được",
                             "Bạn thích đọc sâu và giải thích lại cho người khác"]),
        ("Sản phẩm để lại", ["Kế hoạch, hồ sơ tài trợ, sân khấu đã dựng",
                             "Giải đấu, đêm hội, chuyến đi có người thật được hưởng",
                             "Bộ nhận diện, bài viết, ảnh và video",
                             "Tài liệu, workshop, đề tài nghiên cứu"]),
    ]
    thead = "".join(
        f'<th scope="col" class="col-gem" style="--c:{b["color"]}">{e(b["gem"])}<br>{e(b["short"])}</th>'
        for b in BANS
    )
    tbody = "".join(
        f'<tr><th scope="row">{e(label)}</th>' + "".join(f"<td>{e(v)}</td>" for v in values) + "</tr>"
        for label, values in rows
    )

    body = f"""    <section class="page-hero">
      <div class="container">
        <p class="crumbs"><a href="index.html">Trang chủ</a> › R.E.S.D là gì</p>
        <p class="gem-label"><span class="gem-dot" aria-hidden="true"></span>Giới thiệu chương trình</p>
        <h1>R.E.S.D là gì</h1>
        <p class="tagline">Một chương trình để sinh viên BIT bước vào Đoàn - Hội khoa qua đúng cánh cửa của mình.</p>
        <ul class="hero-stats">
          <li><b>4</b>ban chuyên môn</li>
          <li><b>24</b>câu định hướng</li>
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="container">
        {section_head("Ý tưởng", "Bốn viên đá quý, một vũ trụ")}
        <div class="row gy-4">
          <div class="col-lg-5 reveal">
            <p>R.E.S.D mượn hình ảnh vũ trụ để ví von mỗi người hợp với một chỗ khác nhau. Bốn ban chuyên môn của Đoàn - Hội BIT được đặt thành bốn viên đá quý, mỗi viên một màu, một tính cách, một kiểu công việc. Toàn bộ cổng thông tin này được thiết kế quanh một câu hỏi: bạn hợp với ban hoặc mảng nào, và vì sao.</p>
          </div>
          <div class="col-lg-7">
            <div class="panel reveal">
              <h3>Bạn nhận được gì</h3>
              {gem_list([
                "<b>Mở rộng kiến thức chuyên môn</b> theo từng ban tham gia.",
                "<b>Training kỹ năng, workshop học thuật và teambuilding</b> dành cho cộng tác viên, thành viên.",
                "<b>Môi trường chuyên nghiệp, hòa đồng</b>, nơi các thành viên hỗ trợ lẫn nhau.",
                "<b>Trau dồi kỹ năng</b> quản lý công việc, dự án, hoạt động và sự kiện.",
              ])}
            </div>
          </div>
        </div>
        <div class="hero-actions reveal">
          <button class="btn-ghost" type="button" data-random-mang>Bốc ngẫu nhiên một lựa chọn để đọc thử</button>
        </div>
      </div>
    </section>

    <section class="section" id="so-sanh">
      <div class="container">
        {section_head("Khám phá", "Bốn ban đặt cạnh nhau",
                      "Bảng này để bạn thấy khác biệt thật giữa các ban trước khi quyết định.")}
        <div class="compare-wrap reveal">
          <table class="compare">
            <thead><tr><th scope="col">Tiêu chí</th>{thead}</tr></thead>
            <tbody>{tbody}</tbody>
          </table>
        </div>
        <div class="hero-actions mt-4 reveal">
          <a class="btn-gem" href="test-dinh-huong.html">Chưa rõ? Làm bài kiểm tra</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        {section_head("Nhận diện", "Vì sao lại là đá quý")}
        <div class="card-grid grid-4">
          {"".join(f'''<article class="panel reveal" style="--gem:{b['color']}">
            <h3 style="color:{b['color']}">{e(b['gem'])}</h3>
            <p><b>{e(b['name'])}</b></p>
            <p>{e(b['tagline'])}</p>
          </article>''' for b in BANS)}
        </div>
      </div>
    </section>"""

    return page(
        "R.E.S.D là gì | Cổng thông tin R.E.S.D",
        "Giới thiệu chương trình R.E.S.D, giá trị nhận được và bảng so sánh bốn ban chuyên môn của Đoàn - Hội BIT.",
        "gioi-thieu", "gioi-thieu", body,
    )


# =============================================================================
# TRANG TEST ĐỊNH HƯỚNG
# =============================================================================

def build_test():
    body = f"""    <section class="page-hero">
      <div class="container">
        <p class="crumbs"><a href="index.html">Trang chủ</a> › Test định hướng</p>
        <p class="gem-label"><span class="gem-dot" aria-hidden="true"></span>Bài kiểm tra định hướng</p>
        <h1>Viên đá nào gần với bạn?</h1>
        <p class="tagline">24 câu về thói quen làm việc, nguồn năng lượng và cách bạn tạo ra giá trị. Kết quả gồm một mã bốn chữ cái và các gợi ý để bạn đọc tiếp về từng ban, từng mảng của R.E.S.D.</p>
        <ul class="hero-stats">
          <li><b>24</b>câu hỏi</li>
          <li><b>~6</b>phút</li>
          <li><b>4</b>trục xu hướng</li>
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="quiz-shell" data-quiz>

          <!-- Màn hình mở đầu -->
          <div data-screen="intro" hidden>
            <div class="section-head">
              <p class="kicker">Trước khi bắt đầu</p>
              <h2>Bài này đo cái gì</h2>
              <p>Không phải đo bạn giỏi hay dở. Bài đo thiên hướng làm việc của bạn trên bốn trục độc lập, rồi đối chiếu với hồ sơ của tám lựa chọn chuyên môn.</p>
            </div>
            <div class="quiz-intro-points">
              <div class="panel"><h3>Nhịp làm việc</h3><p>Bạn cần kế hoạch trước, hay bật lên khi mọi thứ thay đổi?</p></div>
              <div class="panel"><h3>Nguồn năng lượng</h3><p>Bạn nạp năng lượng từ người khác, hay từ khoảng lặng một mình?</p></div>
              <div class="panel"><h3>Cách tạo giá trị</h3><p>Bạn thuyết phục bằng hình ảnh và câu chuyện, hay bằng số liệu và lập luận?</p></div>
              <div class="panel"><h3>Vị trí trong đội</h3><p>Bạn muốn đứng trước khán giả, hay giữ cho bộ máy chạy từ phía sau?</p></div>
            </div>
            {gem_list([
              "Chọn theo <b>con người thật của bạn</b>, không phải con người bạn nghĩ ban tuyển đang tìm.",
              "Không có câu đúng hay sai. Câu \"lưng chừng\" là lựa chọn hợp lệ.",
              "Toàn bộ tính toán chạy trong trình duyệt. <b>Không có dữ liệu nào được gửi đi.</b>",
              "Bài này <b>không phải công cụ tâm lý đã được kiểm định</b> và <b>không ảnh hưởng tới kết quả xét tuyển</b>.",
              "Kết quả là gợi ý để bạn đọc tiếp, <b>không thay cho buổi phỏng vấn</b>.",
            ])}
            <div class="quiz-nav">
              <span></span>
              <button class="btn-gem" type="button" data-quiz-start>Bắt đầu, 24 câu</button>
            </div>
          </div>

          <!-- Màn hình làm bài -->
          <div data-screen="quiz" hidden>
            <div class="quiz-progress">
              <div class="bar"><i data-quiz-bar></i></div>
              <div class="meta"><span data-quiz-step>Câu 1 / 24</span><span data-quiz-axis>Đã trả lời 0 câu</span></div>
            </div>
            <div class="question" data-question aria-live="polite"></div>
            <div class="quiz-nav">
              <button class="btn-ghost" type="button" data-quiz-prev>Câu trước</button>
              <button class="btn-gem" type="button" data-quiz-next>Câu tiếp theo</button>
            </div>
            <p class="mt-3" style="font-size:.78rem;color:var(--resd-dim)">Mẹo: bấm phím 1 đến 5 để chọn nhanh, mũi tên trái phải để chuyển câu.</p>
          </div>

          <!-- Màn hình kết quả -->
          <div data-screen="result" hidden>
            <div class="result-head">
              <div class="result-canvas-wrap">
                <canvas data-result-canvas width="1080" height="1350" role="img" aria-label="Thẻ kết quả định hướng R.E.S.D của bạn"></canvas>
              </div>
              <div>
                <p class="kicker" style="color:var(--resd-cyan);font-size:.74rem;font-weight:600;margin:0 0 6px">Mã định hướng của bạn</p>
                <strong class="code-badge" data-result-code>----</strong>
                <h2 class="result-title" data-result-name>Đang tính…</h2>
                <p class="result-summary" data-result-line></p>
                <h3 class="sub-head">Thế mạnh nổi bật</h3>
                <div class="chip-row" data-result-strong></div>
                <h3 class="sub-head">Điểm nên luyện thêm</h3>
                <p class="result-summary" data-result-grow></p>
                <div class="result-actions mt-4">
                  <button class="btn-gem" type="button" data-result-download>Tải ảnh kết quả</button>
                  <button class="btn-ghost" type="button" data-result-csv>Tải kết quả (CSV)</button>
                  <button class="btn-ghost" type="button" data-result-copy>Sao chép kết quả</button>
                  <button class="btn-ghost" type="button" data-result-retake>Làm lại</button>
                </div>
              </div>
            </div>

            <h3 class="sub-head mt-5">Bốn trục của bạn</h3>
            <div class="axis-chart" data-result-axes></div>

            <h3 class="sub-head mt-5">Gợi ý khám phá bốn ban</h3>
            <p class="result-summary">Các chỉ số bên dưới chỉ thể hiện độ tương đồng tham khảo giữa câu trả lời của bạn và hồ sơ mẫu của từng ban; đây không phải xác suất phù hợp hay kết quả xét tuyển.</p>
            <ul class="fit-list" data-result-bans></ul>
            <p class="lede mt-4" data-result-mang></p>

            <div class="section-head mt-5">
              <p class="kicker">Bước tiếp theo</p>
              <h2>Điền đơn đăng ký</h2>
              <p>Biểu mẫu nằm ngay bên dưới. Bạn có thể mở booklet ở tab khác để đối chiếu trong lúc điền.</p>
            </div>
            <div class="result-actions mb-4">
              <a class="btn-ghost" data-config-link="bookletUrl">Mở booklet R.E.S.D</a>
              <a class="btn-ghost" data-config-link="formOpenUrl">Mở biểu mẫu ở tab mới</a>
              <a class="btn-ghost" data-config-link="fanpageUrl">Hỏi qua fanpage</a>
            </div>
            <div class="form-embed" data-form-embed>
              <div class="form-fallback">
                <h3>Biểu mẫu chưa được gắn</h3>
                <p>Ban chuyên môn dán link Google Form vào <code>formEmbedUrl</code> trong <code>js/config.js</code> (dạng <code>.../viewform?embedded=true</code>) là biểu mẫu sẽ hiện ngay tại đây.</p>
                <p>Trong lúc chờ, bạn có thể đăng ký qua fanpage Đoàn - Hội khoa.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>"""

    return page(
        "Test định hướng | Cổng thông tin R.E.S.D",
        "Bài kiểm tra định hướng 24 câu của R.E.S.D: bốn trục thiên hướng làm việc, gợi ý ban và mảng chuyên môn phù hợp.",
        "test", "test", body, extra_js=("test-dinh-huong.js",),
    )


# =============================================================================
# TRANG LIÊN HỆ
# =============================================================================

FAQ = [
    ("Sinh viên năm mấy thì đăng ký được?",
     "Đợt R.E.S.D 2026 hướng tới sinh viên khóa 51 và 52 có nguyện vọng tham gia Ban chuyên môn."),
    ("Một người đăng ký được mấy mảng?",
     "Bạn nên chọn một mảng làm nguyện vọng chính và một mảng làm nguyện vọng phụ. "
     "Đăng ký dàn trải khiến ban khó xếp bạn vào đúng chỗ."),
    ("Không có kinh nghiệm thì có được nhận không?",
     "Mức độ kinh nghiệm cần thiết khác nhau theo từng mảng. Phần \"Cần có\" gồm cả thái độ, thói quen và nền tảng công việc; "
     "phần \"Có thì càng tốt\" là lợi thế bổ sung. Hãy đối chiếu booklet và trao đổi trực tiếp với Ban chuyên môn nếu bạn chưa chắc."),
    ("Mỗi tuần phải dành bao nhiêu thời gian?",
     "Tuỳ mảng và tuỳ mùa. Ngoài mùa sự kiện thường nhẹ, vào cao điểm chương trình thì nặng hơn đáng kể. "
     "Hãy hỏi thẳng điều này trong buổi phỏng vấn."),
    ("Kết quả bài kiểm tra định hướng có ảnh hưởng tới việc xét tuyển không?",
     "Không. Bài kiểm tra chạy hoàn toàn trong trình duyệt của bạn và không gửi dữ liệu đi đâu. "
     "Đây là công cụ để bạn tự định hướng, không phải vòng loại."),
    ("Bài kiểm tra có chính xác như MBTI không?",
     "Bài này lấy cảm hứng từ cách trình bày của các bài trắc nghiệm tính cách, nhưng được xây riêng cho tám lựa chọn chuyên môn của R.E.S.D "
     "và không phải một công cụ tâm lý đã được kiểm định. Hãy coi kết quả là gợi ý để đọc tiếp, không phải kết luận về con người bạn."),
]

def build_contact():
    faq = "".join(
        f'''<div class="accordion-item">
          <h3 class="accordion-header"><button class="accordion-button{"" if i == 0 else " collapsed"}" type="button" data-bs-toggle="collapse" data-bs-target="#faq{i}" aria-expanded="{"true" if i == 0 else "false"}" aria-controls="faq{i}">{e(q)}</button></h3>
          <div id="faq{i}" class="accordion-collapse collapse{" show" if i == 0 else ""}"><div class="accordion-body">{e(a)}</div></div>
        </div>''' for i, (q, a) in enumerate(FAQ)
    )

    body = f"""    <section class="page-hero">
      <div class="container">
        <p class="crumbs"><a href="index.html">Trang chủ</a> › Liên hệ</p>
        <p class="gem-label"><span class="gem-dot" aria-hidden="true"></span>Kênh liên lạc</p>
        <h1>Còn câu hỏi nào chưa được trả lời?</h1>
        <p class="tagline">Đọc trước phần câu hỏi thường gặp bên dưới. Nếu vẫn chưa rõ, nhắn thẳng cho fanpage Đoàn - Hội khoa, thường có người trực trong giờ hành chính.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="card-grid grid-3">
          <article class="panel reveal">
            <h3>Fanpage Đoàn - Hội BIT</h3>
            <p>Kênh chính thức. Nhắn tin trực tiếp để hỏi về đợt tuyển, ban chuyên môn hoặc lịch phỏng vấn.</p>
            <p class="mt-3"><a class="btn-ghost" data-config-link="fanpageUrl">Mở fanpage</a></p>
          </article>
          <article class="panel reveal">
            <h3>Booklet R.E.S.D</h3>
            <p>Tài liệu đầy đủ về chương trình, nhận diện và các ban.</p>
            <p class="mt-3"><a class="btn-ghost" data-config-link="bookletUrl">Mở booklet</a></p>
          </article>
          <article class="panel reveal">
            <h3>Đơn đăng ký</h3>
            <p>Nên làm bài kiểm tra định hướng trước khi điền, để chọn nguyện vọng có cơ sở hơn.</p>
            <p class="mt-3"><a class="btn-ghost" href="test-dinh-huong.html">Tới bài kiểm tra</a></p>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        {section_head("Câu hỏi thường gặp", "Sáu điều được hỏi nhiều nhất")}
        <div class="accordion reveal" id="faq">{faq}</div>
      </div>
    </section>

    """

    return page(
        "Liên hệ | Cổng thông tin R.E.S.D",
        "Kênh liên hệ của chương trình R.E.S.D và câu hỏi thường gặp về các ban chuyên môn, đợt tuyển và bài kiểm tra định hướng.",
        "lien-he", "lien-he", body,
    )


# =============================================================================
# CHẠY
# =============================================================================

def write(name, content):
    path = os.path.join(ROOT, name)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(content)
    print("  đã ghi  %-36s %6d byte" % (name, len(content.encode("utf-8"))))


def main():
    print("Sinh trang cho cổng thông tin R.E.S.D")
    write("index.html", build_home())
    write("gioi-thieu.html", build_intro())
    for ban in BANS:
        write(ban["slug"] + ".html", build_ban(ban))
        for m in ban["mangs"]:
            write(mang_slug(ban, m) + ".html", build_mang(ban, m))
    write("test-dinh-huong.html", build_test())
    write("lien-he.html", build_contact())
    print("Xong. Mở index.html bằng Live Server để kiểm tra.")


if __name__ == "__main__":
    main()