# KẾ HOẠCH BẺ NHỎ TỪNG TASK DỰ ÁN VN34MG (VIỆT NAM 34 MẢNH GHÉP)
> **Căn cứ tài liệu đặc tả:**
> 1. *Bản mô tả ý tưởng dự án - VN34MG*
> 2. *VN34MG Web Spec (11 trang)*
> 3. *VN34MG Web Spec Bổ sung 4 công cụ (20 trang)*

---

## 🏗️ CẤU TRÚC KIẾN TRÚC FRONTEND - BACKEND

* **Frontend (`/frontend`)**: Next.js 15 (App Router), Tailwind CSS, shadcn/ui, Leaflet (hoặc MapLibre GL), Lucide Icons, Canvas API (Pointer Events).
* **Backend (`/backend` / Convex)**: Convex Backend (Real-time Database, Serverless Functions, Full-text Search, File Storage).

---

## 📋 DANH SÁCH CÁC GIAI ĐOẠN & BREAKDOWN CHI TIẾT TỪNG TASK

### GIAI ĐOẠN 1: DỮ LIỆU GIS & BẢN ĐỒ NỀN ĐỘC LẬP (MỤC 3 SPEC GỐC)
* **Task 1.1 - Xử lý & Tối ưu hoá GeoJSON 34 tỉnh thành**:
  * Tách và nén đa giác `vnm_admin1.geojson` (từ 48MB xuống còn ~2–3MB bằng Mapshaper / TopoJSON).
  * Bảo đảm giữ nguyên vẹn 100% hình học quần đảo **Hoàng Sa** (thuộc Đà Nẵng) và **Trường Sa** (thuộc Khánh Hòa).
  * Kiểm tra và chuẩn hoá mã `provinceCode` (34 tỉnh/thành theo danh mục Nghị quyết sắp xếp).
* **Task 1.2 - Xây dựng Canvas Bản đồ 2D "Chỉ có Việt Nam"**:
  * Thiết lập Leaflet/MapLibre hiển thị ranh giới 34 tỉnh mà **không tải raster tile nước ngoài** (không hiện đất liền, tên đường, tên nước láng giềng).
  * Nền trung tính chuẩn cho Biển Đông và biên giới.
  * Tích hợp cơ chế Inset Map (ô bản đồ phụ góc) cho 2 quần đảo Hoàng Sa và Trường Sa nếu tỉ lệ thu phóng trên màn hình nhỏ.

---

### GIAI ĐOẠN 2: BỐ CỤC KHUNG LÀM VIỆC & WINDOW MANAGER (MỤC 2, 6, 7 SPEC GỐC)
* **Task 2.1 - Header UI-01**:
  * Logo VN34MG, ô tìm kiếm nhanh (gợi ý tiếng Việt có dấu/không dấu), avatar tài khoản.
* **Task 2.2 - Sidebar Menu Hamburger UI-02**:
  * Nút menu 3 gạch sát mép trái (56–64px khi gập), mở trượt menu danh sách 4 công cụ: Chatbox, Bộ câu hỏi, Ghi chú, Học và kiểm tra.
* **Task 2.3 - Hệ thống Quản lý Cửa sổ Linh hoạt (Window Manager)**:
  * Cho phép các công cụ nổi dạng Modal Window: Di chuyển (drag), đổi kích cỡ (resize), thu nhỏ (minimize), đóng.
  * Tính năng Snap/Ghim: Ghim 1/2 màn hình (trái/phải) hoặc 1/4 màn hình (góc).
  * Ràng buộc diện tích: Bản đồ luôn giữ tối thiểu 40% diện tích quan sát, không bị che kín. Nút "Đặt lại bố cục".

---

### GIAI ĐOẠN 3: TƯƠNG TÁC BẢN ĐỒ & BẢNG THÔNG TIN CHI TIẾT (MỤC 4, 5, 8, 9 SPEC GỐC)
* **Task 3.1 - 3 Tab Chế độ Bản đồ (Tabs Bar trên Map)**:
  * **Hành chính (Mặc định)**: Thể hiện ranh giới 34 tỉnh thành.
  * **Tự nhiên**: Phân nhóm 7 khu vực tra cứu tự nhiên.
  * **Kinh tế – Xã hội**: Tô màu phân tầng 6 vùng kinh tế – xã hội.
* **Task 3.2 - Tương tác Hover (S1) & Click (S2)**:
  * **Hover (S1)**: Đổi viền/độ sáng tỉnh, hiển thị Tooltip ngắn (tên + 1-2 đặc trưng trong 2-3 dòng).
  * **Click (S2)**: Highlight tỉnh, tự động re-fit khung nhìn bản đồ, mở Panel chi tiết bên phải (320–360px).
* **Task 3.3 - Dải Thẻ Ảnh Vùng (Dynamic Regions Strip)**:
  * Khi Panel chi tiết đóng: Danh sách thẻ ảnh vùng nằm dọc ở cột bên phải.
  * Khi Panel chi tiết mở: Tự động chuyển xuống dải cuộn ngang bên dưới bản đồ.
* **Task 3.4 - Panel Chi tiết Địa phương (5 Tab Nội dung)**:
  * Tab 1: Tổng quan (vị trí, diện tích, tiếp giáp).
  * Tab 2: Tự nhiên (địa hình, khí hậu, sông ngòi, thiên tai).
  * Tab 3: Kinh tế – Xã hội (dân cư, nông nghiệp, công nghiệp, dịch vụ, du lịch).
  * Tab 4: Hình ảnh đặc trưng (ảnh cảnh quan có nguồn).
  * Tab 5: Nguồn kiểm chứng (dẫn nguồn tài liệu chính thức).

---

### GIAI ĐOẠN 4: THIẾT LẬP BACKEND CONVEX & DỮ LIỆU ĐỊA LÍ (MỤC 11, 16.7 SPEC BỔ SUNG)
* **Task 4.1 - Cấu hình Convex Schema**:
  * Các bảng: `provinces`, `regions`, `source_catalog`, `chat_sessions`, `chat_messages`, `question_bank`, `notes`, `study_sets`, `study_attempts`.
* **Task 4.2 - Seed Dữ liệu Cơ bản**:
  * Nạp thông tin định danh 34 tỉnh thành, 6 vùng kinh tế, 7 khu vực tự nhiên.
  * Tích hợp Source Catalog cho các số liệu thống kê.

---

### GIAI ĐOẠN 5: CÔNG CỤ 1 – CHATBOX HỎI ĐÁP ĐỊA LÍ (MỤC 16.2 SPEC BỔ SUNG)
* **Task 5.1 - Giao diện Chat Assistant**:
  * Khung chat bong bóng (user/assistant), ô nhập liệu nhiều dòng, nút gửi, xem lịch sử chat.
* **Task 5.2 - Đồng bộ Ngữ cảnh Bản đồ (Context Sync)**:
  * Thẻ header: "Đang tìm hiểu: [Tên tỉnh/vùng]" (ví dụ: Thành phố Huế), cho phép Đổi/Bỏ ngữ cảnh hoặc chọn "Toàn Việt Nam".
  * Gợi ý câu hỏi tự động theo tỉnh/vùng đang chọn.
* **Task 5.3 - Trích dẫn Nguồn Kiểm chứng (Citations)**:
  * Mỗi câu trả lời về số liệu, ranh giới đều đính kèm Citations trỏ về bảng nguồn tài liệu, không sinh dữ liệu giả.

---

### GIAI ĐOẠN 6: CÔNG CỤ 2 – BỘ CÂU HỎI TRA CỨU THEO CHỦ ĐỀ (MỤC 16.3 SPEC BỔ SUNG)
* **Task 6.1 - Hệ thống Phân loại 5 Cấp (Naugh Milk IELTS Taxonomy)**:
  * Cấp 1 (Lĩnh vực lớn) $\rightarrow$ Cấp 2 (Chuyên đề) $\rightarrow$ Cấp 3 (Phạm vi) $\rightarrow$ Cấp 4 (Mức độ) $\rightarrow$ Cấp 5 (Câu hỏi).
* **Task 6.2 - Breadcrumb & Bộ lọc Đa tiêu chí**:
  * Điều hướng nhiều cấp không mất dữ liệu, lọc linh hoạt theo chủ đề và tỉnh thành.
* **Task 6.3 - Chi tiết Câu hỏi & Tương tác Bản đồ**:
  * Xem gợi ý, xem lời giải chuẩn kèm nguồn.
  * Nút "Xem trên bản đồ": Tự động highlight và định vị camera bản đồ tới tỉnh/vùng liên quan.
  * Nút "Lưu vào Học và kiểm tra".

---

### GIAI ĐOẠN 7: CÔNG CỤ 3 – GHI CHÚ / NOTE (MỤC 16.4 SPEC BỔ SUNG)
* **Task 7.1 - Dual-mode Note Editor**:
  * Chế độ 1: Gõ văn bản (Text blocks) có định dạng cơ bản.
  * Chế độ 2: Vẽ tay / Bút cảm ứng (Canvas Pointer Events): Bút viết, bút dạ quang highlight trong suốt, tẩy nét, lasso chọn & di chuyển, undo/redo.
* **Task 7.2 - Tích hợp Bản đồ vào Ghi chú**:
  * Nút "Chụp / Chèn ảnh bản đồ đang xem vào ghi chú".
  * Tự động liên kết ghi chú với tỉnh/thành đang được chọn.
* **Task 7.3 - Lưu trữ & Xuất tệp**:
  * Tự động lưu (Auto-save) vào LocalStorage / Convex.
  * Hỗ trợ xuất PDF / PNG.

---

### GIAI ĐOẠN 8: CÔNG CỤ 4 – HỌC VÀ KIỂM TRA (MỤC 16.5 SPEC BỔ SUNG)
* **Task 8.1 - Chế độ Flashcards (Thẻ ghi nhớ)**:
  * Hiển thị thẻ lớn mặt trước (thuật ngữ/địa danh/ảnh bản đồ) - lật mặt sau (định nghĩa/đặc trưng). Đánh dấu Đã nhớ/Chưa nhớ.
* **Task 8.2 - Chế độ Learn (Luyện tập)**:
  * Trắc nghiệm, đúng/sai, điền ngắn. Phản hồi đáp án ngay lập tức kèm giải thích và nguồn.
* **Task 8.3 - Chế độ Test (Kiểm tra)**:
  * Làm bài kiểm tra tính điểm theo thời gian, chấm điểm chuẩn, phân tích danh sách câu sai.
  * Nút "Xem vị trí trên bản đồ" sau các câu trả lời sai để học lại không gian địa lí.
* **Task 8.4 - Chế độ Match (Ghép cặp)**:
  * Kéo thả ghép địa phương với đặc trưng tương ứng.

---

### GIAI ĐOẠN 9: KIỂM THỬ TOÀN DIỆN & NGHIỆM THU (MỤC 12 & 16.9 SPEC)
* **Task 9.1 - Kiểm thử Bản đồ & Giao diện Cốt lõi (T01 - T20)**:
  * Đạt đầy đủ tiêu chí không méo biên giới, đủ 34 tỉnh, đúng Hoàng Sa - Trường Sa, hover/click, dải thẻ vùng, ghim cửa sổ.
* **Task 9.2 - Kiểm thử 4 Công cụ Học tập (T21 - T48)**:
  * Kiểm tra tính độc lập, đồng bộ ngữ cảnh tỉnh/vùng, lưu trữ và bảo mật dữ liệu học sinh.
