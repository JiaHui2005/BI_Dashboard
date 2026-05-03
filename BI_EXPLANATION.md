# Tầng Logic BI & Ra Quyết Định Chiến Lược

Với vai trò là Chuyên gia Phân tích BI Cao cấp, Dashboard này được thiết kế để chuyển đổi dữ liệu đơn hàng thô thành các thông tin có giá trị chiến lược. Dưới đây là phân tích chi tiết về logic và các quyết định mà hệ thống này hỗ trợ.

## 1. Logic KPI (Các chỉ số sinh tồn)
- **Tổng doanh thu (Total Revenue)**: Chỉ số sức khỏe quan trọng nhất.
  - *Quyết định*: Chúng ta có đang đạt được mục tiêu doanh thu đề ra không?
- **Tăng trưởng doanh thu (%)**: Tính toán sự chênh lệch giữa kỳ hiện tại và kỳ trước.
  - *Quyết định*: Tốc độ tăng trưởng đang nhanh hay chậm lại? (Điều chỉnh chiến lược vĩ mô).
- **Tỷ lệ chuyển đổi (Thanh toán/Tổng)**: Đo lường hiệu quả chuyển đổi từ quan tâm sang dòng tiền thực tế.
  - *Quyết định*: Nếu thấp, cần kiểm tra lại các lỗi ở cổng thanh toán hoặc lòng tin khách hàng.
- **Giá trị đơn hàng trung bình (AOV)**: Đo lường mức chi tiêu của khách hàng trên mỗi giao dịch.
  - *Quyết định*: Có nên áp dụng "Miễn phí vận chuyển cho đơn trên X" hoặc "Mua theo combo" để đẩy con số này lên không?

## 2. Logic Hình ảnh hóa (Chẩn đoán dữ liệu)
- **Biểu đồ Đường (Xu hướng ngày)**: Xác định các giai đoạn cao điểm bán hàng.
  - *Phát hiện*: Các cú sụt giảm đột ngột có thể do lỗi hệ thống hoặc kết thúc một chiến dịch Marketing.
- **Biểu đồ Cột (Doanh thu khu vực)**: Chỉ ra chính xác vị thế của thương hiệu ở các vùng miền.
  - *Phát hiện*: Các khu vực tiềm năng nhưng doanh thu thấp cần được tăng cường Marketing địa phương.
- **Biểu đồ Tròn (Phân bổ trạng thái)**: Giám sát sức khỏe chuỗi cung ứng.
  - *Phát hiện*: Lượng lớn đơn ở trạng thái "Chờ xử lý" báo hiệu sự tắc nghẽn trong khâu xác nhận hoặc kho bãi.
- **Biểu đồ Phân tán (Ngoại lai)**: Xác định các khách hàng "Cá mập" (Whales) hoặc các giao dịch bất thường.
  - *Phát hiện*: Các đơn hàng giá trị cực cao (Ví dụ: 42 triệu VNĐ) cần được chăm sóc đặc biệt hoặc kiểm tra tính xác thực.
- **Biểu đồ Cột Chồng (Đã trả vs Chờ trả)**: Quản lý dòng tiền (Cash flow).
  - *Phát hiện*: Nếu doanh thu "Chờ trả" chiếm tỷ trọng lớn, doanh nghiệp đang đối mặt với rủi ro thanh khoản.

## 3. Các cấp độ tổ chức

### Vận hành (Trưởng nhóm / Kho bãi)
- **Trọng tâm**: "Điều gì đang xảy ra *ngay bây giờ*?"
    - **Hành động**: Giải phóng các đơn hàng bị kẹt ở trạng thái 'Chờ xử lý'. Đẩy nhanh tiến độ chuyển từ 'Đang giao' sang 'Đã giao'.

### Chiến thuật (Quản lý Marketing / Sales)
- **Trọng tâm**: "Làm thế nào để tối ưu hóa *tháng này*?"
    - **Hành động**: Chuyển ngân sách quảng cáo sang các khu vực có AOV cao (như TP.HCM, Hà Nội). Khuyến khích khách hàng thanh toán trước để giảm tỷ lệ "Chờ thanh toán".

### Chiến lược (Ban Giám đốc / Nhà sáng lập)
- **Trọng tâm**: "Chúng ta sẽ đi về đâu trong *năm nay*?"
    - **Hành động**: Đánh giá xu hướng tăng trưởng (như đỉnh tăng trưởng vào cuối tháng 4) để quyết định mở rộng quy mô, tuyển dụng hoặc tiến quân vào các thị trường mới.

---
**Nhận định từ Dữ liệu thực tế (`data.json`):**
Sau khi phân tích dữ liệu mới cập nhật, chúng ta thấy một xu hướng tăng trưởng rõ rệt từ giữa tháng 4 đến đầu tháng 5/2026.
1. **Khách hàng VIP**: Xu hiện các khách hàng như **Minh Anh** (Đơn hàng 42tr) và **Nguyễn Quốc Xanh** (Đơn hàng 31tr). Đây là nhóm khách hàng cần áp dụng chương trình khách hàng thân thiết (Loyalty Program).
2. **Thị trường trọng điểm**: **TP.HCM** đang chiếm tỷ trọng doanh thu cao nhất, trong khi **Hải Phòng** và **Cần Thơ** bắt đầu xuất hiện những đơn hàng giá trị lớn, cho thấy tiềm năng mở rộng tại đây.
3. **Dòng tiền**: Tỷ lệ đơn hàng **Đã thanh toán (Paid)** đang duy trì ở mức 70%, giúp doanh nghiệp có dòng tiền ổn định để tái đầu tư. Tuy nhiên, vẫn cần theo dõi các đơn hàng COD lớn để tránh rủi ro hoàn hàng.
