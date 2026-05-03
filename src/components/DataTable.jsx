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
      <div className="chart-header">
        <h3>Danh sách đơn hàng</h3>
        <div className="filter-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            style={{ minWidth: '250px' }}
          />
        </div>
      </div>

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
            <div className="chart-header">
              <h2>Chi tiết đơn hàng: {selectedOrder.order_code}</h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
              <div>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Thông tin khách hàng</h4>
                <p><strong>Họ tên:</strong> {selectedOrder.recipient_name}</p>
                <p><strong>Điện thoại:</strong> {selectedOrder.phone_number}</p>
                <p><strong>Địa chỉ:</strong> {selectedOrder.shipping_address}</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Thông tin thanh toán</h4>
                <p><strong>Số tiền:</strong> {selectedOrder.total_amount.toLocaleString()}₫</p>
                <p><strong>Phương thức:</strong> {selectedOrder.payment_method}</p>
                <p><strong>Trạng thái:</strong> {selectedOrder.payment_status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}</p>
              </div>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>BI Insight (Gợi ý phân tích)</h4>
              <p style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--primary-color)' }}>
                {selectedOrder.status === 'pending'
                  ? "Đơn hàng đang chờ xử lý. Hành động vận hành: Kiểm tra tồn kho và xác nhận giao hàng."
                  : selectedOrder.payment_status === 'pending'
                    ? "Chưa hoàn tất thanh toán. Hành động chiến thuật: Gửi nhắc nhở thanh toán hoặc kiểm tra cổng thanh toán."
                    : "Đơn hàng đã hoàn tất thành công. Nhận định: Giá trị vòng đời khách hàng (LTV) đang tăng."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
