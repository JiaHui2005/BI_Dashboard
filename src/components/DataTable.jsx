import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Eye } from 'lucide-react';

export const DataTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAndSortedData = [...data]
    .filter(order =>
      order.order_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    document.querySelector('.table-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="card glass table-container">
      <div className="table-header">
        <h3>Danh sách đơn hàng</h3>
        <div className="table-search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm mã đơn, khách hàng..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="table-wrapper">

      <table>
        <thead>
          <tr>
            <th onClick={() => requestSort('order_code')} style={{ cursor: 'pointer' }}>
              Mã đơn hàng {sortConfig.key === 'order_code' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </th>
            <th onClick={() => requestSort('total_amount')} style={{ cursor: 'pointer' }}>
              Số tiền {sortConfig.key === 'total_amount' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </th>
            <th>Trạng thái</th>
            <th>Thanh toán</th>
            <th onClick={() => requestSort('created_at')} style={{ cursor: 'pointer' }}>
              Ngày tạo {sortConfig.key === 'created_at' && (sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
            </th>
            <th>Khu vực</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((order) => (
            <tr key={order.id} onClick={() => setSelectedOrder(order)} style={{ cursor: 'pointer' }}>
              <td style={{ fontWeight: 600 }}>{order.order_code}</td>
              <td style={{ color: '#38bdf8', fontWeight: 600 }}>
                {order.total_amount.toLocaleString()}₫
              </td>
              <td>
                <span className={`status-badge status-${order.status}`}>
                  {order.status === 'pending' ? 'Chờ xử lý' : order.status === 'shipped' ? 'Đang giao' : 'Đã giao'}
                </span>
              </td>
              <td>
                <span className={`payment-${order.payment_status}`}>
                  {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                </span>
              </td>
              <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                {order.created_at}
              </td>
              <td>{order.region}</td>
              <td>
                <button style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer' }}>
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div className="pagination">
        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Trước
        </button>
        <div className="pagination-info">
          Trang {currentPage} / {totalPages || 1}
        </div>
        <button
          className="pagination-btn"
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Sau
        </button>
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="glass modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>&times;</button>
            
            <div className="modal-body">
              <h2 style={{ fontFamily: 'Outfit', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                Chi tiết đơn hàng
              </h2>
              <p style={{ color: 'var(--primary-color)', fontWeight: 700, letterSpacing: '0.1em' }}>
                #{selectedOrder.order_code}
              </p>

              <div className="detail-grid">
                <div className="detail-section">
                  <h4>Thông tin khách hàng</h4>
                  <div className="detail-item">
                    <span className="detail-label">Họ tên</span>
                    <span className="detail-value">{selectedOrder.recipient_name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Điện thoại</span>
                    <span className="detail-value">{selectedOrder.phone_number}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Địa chỉ</span>
                    <span className="detail-value">{selectedOrder.shipping_address}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Khu vực</span>
                    <span className="detail-value">{selectedOrder.region}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Thông tin đơn hàng</h4>
                  <div className="detail-item">
                    <span className="detail-label">Tổng tiền</span>
                    <span className="detail-value" style={{ color: 'var(--primary-color)', fontSize: '1.25rem' }}>
                      {selectedOrder.total_amount.toLocaleString()}₫
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Ngày tạo</span>
                    <span className="detail-value">{selectedOrder.created_at}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Trạng thái</span>
                    <span className={`status-badge status-${selectedOrder.status}`}>
                      {selectedOrder.status === 'pending' ? 'Chờ xử lý' : selectedOrder.status === 'shipped' ? 'Đang giao' : 'Đã giao'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Thanh toán</span>
                    <span className={`payment-${selectedOrder.payment_status}`}>
                      {selectedOrder.payment_status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="insight-box">
                <h4 style={{ color: 'var(--primary-color)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Eye size={18} /> BI Analytics Insight
                </h4>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', fontWeight: 500 }}>
                  {selectedOrder.status === 'pending'
                    ? "Hệ thống khuyến nghị: Đơn hàng này đang ở trạng thái chờ. Cần kiểm tra tồn kho tại khu vực " + selectedOrder.region + " để tối ưu thời gian giao hàng."
                    : selectedOrder.payment_status === 'pending'
                      ? "Phân tích tài chính: Đơn hàng có giá trị cao nhưng chưa hoàn tất thanh toán. Đề xuất gửi thông báo nhắc nhở tự động sau 24h."
                      : "Nhận định kinh doanh: Khách hàng này đóng góp tích cực vào doanh thu khu vực " + selectedOrder.region + ". Đề xuất đưa vào danh sách khách hàng thân thiết."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
