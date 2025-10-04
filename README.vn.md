Dưới đây là bản dịch tiếng Việt đầy đủ và chuyên nghiệp cho README của dự án CultureLinkVN:

🌏 CultureLinkVN
English README  Tiếng Việt
CultureLinkVN là một ứng dụng bản đồ tương tác, giới thiệu các di sản thế giới UNESCO tại Việt Nam.
Dự án cho phép người dùng tìm kiếm, lọc theo tỉnh/thành, xem thống kê và biểu đồ, cũng như nhận chỉ đường đến từng địa điểm di sản.

✨ Tính năng
- 🗺️ Hiển thị tất cả các di sản UNESCO tại Việt Nam trên bản đồ Leaflet.
- 🔍 Tìm kiếm theo tên di sản hoặc tỉnh/thành phố.
- 🎛️ Lọc danh sách di sản theo tỉnh/thành.
- 📊 Xem thống kê và biểu đồ tương tác (sử dụng Chart.js).
- 📌 Marker popup hiển thị thông tin chi tiết: mô tả, hình ảnh, liên kết Wikipedia/Wikidata, và nút chỉ đường Google Maps.
- 📈 Bảng thống kê có thể thu gọn/kéo lên xuống.
- 📱 Thiết kế đáp ứng tốt trên cả máy tính và thiết bị di động.

📂 Cấu trúc dự án
CultureLinkVN/
│
├─ index.html          # Giao diện chính
├─ style.css           # Tệp định dạng giao diện
├─ app.js              # Logic chính của ứng dụng
├─ README.md
│
├─ data/
│   ├─ heritage.json   # Dữ liệu đã xử lý dùng cho web
│   ├─ query.json      # Dữ liệu thô từ Wikidata
│
├─ scripts/
│   ├─ reFormData.py   # Script Python xử lý dữ liệu JSON
│   ├─ wikiDataQuery.txt # Truy vấn SPARQL



🚀 Bắt đầu sử dụng
1. Clone dự án về máy:
git clone https://github.com/<username>/CultureLinkVN.git
cd CultureLinkVN


2. Chuẩn bị dữ liệu:
- Mở scripts/wikiDataQuery.txt và sao chép truy vấn SPARQL.
- Truy cập Wikidata Query Service, dán truy vấn và chạy.
- Xuất kết quả dưới dạng JSON và lưu thành data/query.json.
- Xử lý dữ liệu bằng Python:
python scripts/reFormData.py


- Tệp data/heritage.json sẽ được tạo để sử dụng trong web app.
3. Chạy ứng dụng:
- Cách nhanh: mở index.html trực tiếp bằng trình duyệt (Chrome/Edge/Firefox).
- Cách khuyến nghị: chạy server cục bộ để tải JSON ổn định:
python -m http.server


- Sau đó truy cập http://localhost:8000

🖱️ Hướng dẫn sử dụng
- Tìm kiếm di sản theo tên hoặc tỉnh/thành.
- Lọc danh sách bằng menu dropdown.
- Khám phá bảng thống kê và biểu đồ.
- Kéo bảng thống kê lên/xuống để mở rộng hoặc thu gọn.
- Nhấn “Chỉ đường” trong popup để mở Google Maps.
- Để cập nhật dữ liệu, lặp lại bước 2.

⚙️ Yêu cầu hệ thống
- Trình duyệt hiện đại hỗ trợ ES6 và Geolocation API.
- Python 3 để chạy script xử lý dữ liệu.
- Kết nối Internet để tải Leaflet, Chart.js và Google Maps.

📜 Giấy phép
Giấy phép MIT © 2024 CultureLinkVN

📬 Liên hệ
Nếu có lỗi, đề xuất hoặc muốn đóng góp, vui lòng mở issue hoặc pull request trên GitHub, hoặc liên hệ nhóm phát triển qua email.
