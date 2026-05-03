import React, { useMemo, useState } from 'react';
import { User, DollarSign, ShoppingBag, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export const CustomerTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'totalSpent', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const customerData = useMemo(() => {
    const customers = data.reduce((acc, order) => {
      const name = order.recipient_name;
      if (!acc[name]) {
        acc[name] = {
          name,
          totalSpent: 0,
          orderCount: 0,
          lastOrder: order.created_at,
          phone: order.phone_number
        };
      }
      acc[name].totalSpent += order.total_amount;
      acc[name].orderCount += 1;
      if (new Date(order.created_at) > new Date(acc[name].lastOrder)) {
        acc[name].lastOrder = order.created_at;
      }
      return acc;
    }, {});
    
    return Object.values(customers).sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const totalPages = Math.ceil(customerData.length / itemsPerPage);
  const paginatedData = customerData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  return (
    <div className="card glass table-container">
      <div className="chart-header">
        <h3>Phân tích khách hàng</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>Khách hàng</th>
            <th>Số điện thoại</th>
            <th onClick={() => requestSort('totalSpent')} style={{ cursor: 'pointer' }}>
              Tổng chi tiêu {sortConfig.key === 'totalSpent' && (sortConfig.direction === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
            </th>
            <th onClick={() => requestSort('orderCount')} style={{ cursor: 'pointer' }}>
              Số đơn hàng {sortConfig.key === 'orderCount' && (sortConfig.direction === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
            </th>
            <th>Giao dịch gần nhất</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((customer, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={16} color="var(--primary-color)" />
                  {customer.name}
                </div>
              </td>
              <td style={{ color: 'var(--text-muted)' }}>{customer.phone}</td>
              <td style={{ color: 'var(--success-color)', fontWeight: 600 }}>
                {customer.totalSpent.toLocaleString()}₫
              </td>
              <td>{customer.orderCount}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Clock size={14} />
                  {customer.lastOrder}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button 
          className="pagination-btn" 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Trước
        </button>
        <div className="pagination-info">
          Trang {currentPage} / {totalPages || 1}
        </div>
        <button 
          className="pagination-btn" 
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Sau
        </button>
      </div>
    </div>
  );
};
