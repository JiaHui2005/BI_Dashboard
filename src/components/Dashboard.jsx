import React, { useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { KPISection } from './KPISection';
import { ChartsSection } from './ChartsSection';
import { DataTable } from './DataTable';
import { User, Sun, Moon } from 'lucide-react';

const Dashboard = ({ theme, toggleTheme }) => {
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    status: 'all',
    paymentStatus: 'all',
    region: 'all',
    search: ''
  });

  const { filteredData, stats, chartsData, uniqueRegions } = useDashboardData(filters);

  return (
    <div className="dashboard-container no-sidebar">
      <main className="main-content full-width">
        <header className="header glass">
          <div className="header-title">
            <h1>BI Performance Dashboard</h1>
            <p>Báo cáo hiệu suất kinh doanh tổng hợp</p>
          </div>
          
          <div className="header-actions">
             <button className="theme-toggle-btn" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <div className="user-profile">
                <div className="user-info">
                   <span className="user-name">Nhóm Tứ Linh</span>
                   <span className="user-dept">QTHTTT</span>
                </div>
                <div className="avatar">
                   <User size={20} />
                </div>
             </div>
          </div>
        </header>

        <div className="filter-bar glass">
          <div className="filter-group">
            <label>Từ ngày</label>
            <input type="date" value={filters.dateRange.start} onChange={(e) => setFilters(prev => ({...prev, dateRange: {...prev.dateRange, start: e.target.value}}))} />
          </div>
          <div className="filter-group">
            <label>Đến ngày</label>
            <input type="date" value={filters.dateRange.end} onChange={(e) => setFilters(prev => ({...prev, dateRange: {...prev.dateRange, end: e.target.value}}))} />
          </div>
          <div className="filter-group">
            <label>Trạng thái</label>
            <select value={filters.status} onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}>
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="shipped">Đang giao</option>
              <option value="delivered">Đã giao</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Khu vực</label>
            <select value={filters.region} onChange={(e) => setFilters(prev => ({...prev, region: e.target.value}))}>
              {uniqueRegions.map(r => (
                <option key={r} value={r}>{r === 'all' ? 'Tất cả khu vực' : r}</option>
              ))}
            </select>
          </div>
          <div className="filter-group search-group">
            <label>Tìm kiếm</label>
            <input 
              type="text" 
              placeholder="Mã đơn, khách hàng..." 
              value={filters.search} 
              onChange={(e) => setFilters(prev => ({...prev, search: e.target.value}))} 
            />
          </div>
          <div className="filter-group clear-btn">
            <button 
              className="btn-secondary" 
              onClick={() => setFilters({
                dateRange: { start: '', end: '' },
                status: 'all',
                paymentStatus: 'all',
                region: 'all',
                search: ''
              })}
            >
              Đặt lại
            </button>
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="no-data-container glass" style={{ 
            padding: '5rem 2rem', 
            textAlign: 'center', 
            marginTop: '2rem',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <div className="no-data-icon" style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-color)',
              marginBottom: '1rem'
            }}>
               <Moon size={40} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>Không có dữ liệu trong khoảng thời gian này</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '500px', lineHeight: 1.6 }}>
              Rất tiếc, hệ thống không tìm thấy bất kỳ đơn hàng nào từ ngày 
              <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}> {filters.dateRange.start || 'đầu'} </span> 
              đến 
              <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}> {filters.dateRange.end || 'nay'}</span>. 
              Vui lòng thử chọn một khoảng thời gian khác hoặc kiểm tra lại bộ lọc.
            </p>
            <button 
              className="btn-primary" 
              onClick={() => setFilters(prev => ({...prev, dateRange: { start: '', end: '' }}))}
              style={{ padding: '0.75rem 2rem', borderRadius: '12px', fontWeight: 600 }}
            >
              Đặt lại thời gian
            </button>
          </div>
        ) : (
          <>
            <section className="dashboard-section">
              <KPISection stats={stats} timeTrend={chartsData.dailyTrend} />
            </section>

            <section className="dashboard-section">
              <div className="section-header">
                <h2>Phân tích biểu đồ</h2>
              </div>
              <ChartsSection chartsData={chartsData} />
            </section>

            <section className="dashboard-section">
              <div className="section-header">
                <h2>Danh sách đơn hàng chi tiết</h2>
              </div>
              <DataTable data={filteredData} />
            </section>
          </>
        )}
        
        <footer className="footer glass" style={{ marginTop: '5rem', padding: '2rem', borderRadius: '20px 20px 0 0' }}>
          <p>© 2026 BI Performance System • Thiết kế bởi Nhóm Tứ Linh Implementation</p>
          <p style={{ marginTop: '0.5rem', opacity: 0.6 }}>Giải pháp phân tích dữ liệu kinh doanh thông minh thời gian thực.</p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
