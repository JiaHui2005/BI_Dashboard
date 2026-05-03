# Sales Performance BI Dashboard

Dự án này là một BI Dashboard (Bảng điều khiển Phân tích Kinh doanh) hiệu suất cao được xây dựng bằng **ReactJS** và **Recharts**, được thiết kế để cung cấp các thông tin chi tiết, có thể thực hiện được về doanh thu bán hàng, tăng trưởng và hiệu quả vận hành.

## 🚀 Tính năng chính
- **Theo dõi KPI thời gian thực**: 5 chỉ số chính với các chỉ số xu hướng và biểu đồ đường mini (sparklines).
- **Trực quan hóa dữ liệu tương tác**: 
  - Xu hướng doanh thu (Biểu đồ đường)
  - Phân tích theo khu vực (Biểu đồ cột)
  - Phân bổ trạng thái vận hành (Biểu đồ tròn)
  - Phát hiện các điểm bất thường (Biểu đồ phân tán)
  - Trạng thái dòng tiền (Biểu đồ cột chồng)
- **Bộ lọc nâng cao**: Các bộ lọc phản ứng (reactive filters) cho ngày tháng, trạng thái, thanh toán và khu vực.
- **Phân tích sâu (Drill-down)**: Bảng dữ liệu có thể tìm kiếm và sắp xếp để kiểm tra chi tiết từng đơn hàng.
- **Thiết kế cao cấp**: Thẩm mỹ chế độ tối (dark mode) với hiệu ứng kính (glassmorphism) và các chuyển động mượt mà.
- **Chế độ Sáng/Tối**: Tích hợp nút chuyển đổi giao diện linh hoạt.

## 🛠 Công nghệ sử dụng
- **Frontend**: React 18, Vite
- **Biểu đồ**: Recharts
- **Icon**: Lucide-React
- **Xử lý thời gian**: date-fns
- **Styling**: Vanilla CSS (CSS Variables, Grid, Flexbox)

## 📦 Bắt đầu nhanh

### Yêu cầu hệ thống
- Node.js (phiên bản 16 trở lên)
- npm hoặc yarn

### Cài đặt
1. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```

2. Chạy máy chủ phát triển:
   ```bash
   npm run dev
   ```

3. Xây dựng bản sản xuất:
   ```bash
   npm run build
   ```

## 📊 Logic BI & Lớp ra quyết định

Dashboard được cấu trúc để hỗ trợ ba cấp độ ra quyết định:

### 1. Cấp độ Vận hành (Theo dõi thời gian thực)
- **Thông tin chi tiết**: Khối lượng lớn đơn hàng "Đang chờ" (Pending) hoặc thanh toán "Đang chờ".
- **Hành động**: Theo dõi thanh toán hoặc kiểm tra các điểm nghẽn tại kho nếu trạng thái "Đã giao" (Shipped) bị chậm.
- **Chỉ số**: Tổng đơn hàng & Phân bổ trạng thái.

### 2. Cấp độ Chiến thuật (Tối ưu hóa vận hành)
- **Thông tin chi tiết**: Các khu vực cụ thể có doanh thu cao nhưng giá trị đơn hàng trung bình (AOV) thấp.
- **Hành động**: Tối ưu hóa lộ trình giao hàng hoặc khởi động các chương trình khuyến mãi theo gói tại các khu vực đó để tăng AOV.
- **Chỉ số**: Doanh thu theo khu vực & AOV.

### 3. Cấp độ Chiến lược (Lập kế hoạch dài hạn)
- **Thông tin chi tiết**: Xu hướng tăng trưởng doanh thu và các mẫu hình theo mùa.
- **Hành động**: Phân bổ nguồn lực cho quý tiếp theo, lập kế hoạch tồn kho và xác định cơ hội mở rộng thị trường.
- **Chỉ số**: Tổng doanh thu & % Tăng trưởng.

---
*Được thực hiện bởi Nhóm Tứ Linh*
