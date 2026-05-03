import React, { useMemo, useState } from 'react';
import { MapPin, TrendingUp, ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';

export const RegionTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'revenue', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const regionData = useMemo(() => {
    const regions = data.reduce((acc, order) => {
      const name = order.region;
      if (!acc[name]) {
        acc[name] = {
          name,
          revenue: 0,
          orders: 0,
          avgValue: 0
        };
      }
      acc[name].revenue += order.total_amount;
      acc[name].orders += 1;
      return acc;
    }, {});
    
    const regionArray = Object.values(regions).map(r => ({ ...r, avgValue: r.revenue / r.orders }));
    
    return regionArray.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const totalPages = Math.ceil(regionData.length / itemsPerPage);
  const paginatedData = regionData.slice(
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
        <h3>Phân tích khu vực</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>Khu vực</th>
            <th onClick={() => requestSort('revenue')} style={{ cursor: 'pointer' }}>
              Doanh thu {sortConfig.key === 'revenue' && (sortConfig.direction === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
            </th>
            <th onClick={() => requestSort('orders')} style={{ cursor: 'pointer' }}>
              Số đơn hàng {sortConfig.key === 'orders' && (sortConfig.direction === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
            </th>
            <th onClick={() => requestSort('avgValue')} style={{ cursor: 'pointer' }}>
              Giá trị TB / Đơn {sortConfig.key === 'avgValue' && (sortConfig.direction === 'asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}
            </th>
            <th>Hiệu suất</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((region, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} color="var(--primary-color)" />
                  {region.name}
                </div>
              </td>
              <td style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                {region.revenue.toLocaleString()}₫
              </td>
              <td>{region.orders}</td>
              <td>{Math.round(region.avgValue).toLocaleString()}₫</td>
              <td>
                <div style={{ width: '100%', height: '6px', background: 'var(--surface-hover)', borderRadius: '10px', overflow: 'hidden' }}>
                   <div style={{ 
                     width: `${(region.revenue / regionData[0].revenue) * 100}%`, 
                     height: '100%', 
                     background: 'var(--primary-color)' 
                   }} />
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
