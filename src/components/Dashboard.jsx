import React, { useState, useRef } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { KPISection } from './KPISection';
import { ChartsSection } from './ChartsSection';
import { DataTable } from './DataTable';
import { CustomerTable } from './CustomerTable';
import { RegionTable } from './RegionTable';
import { Sidebar } from './Sidebar';
import { Calendar, Bell, User, Sun, Moon } from 'lucide-react';

const Dashboard = ({ theme, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    dateRange: { start: '2026-04-25', end: '2026-05-03' },
    status: 'all',
    paymentStatus: 'all',
    region: 'all',
    search: ''
  });

  const { filteredData, stats, chartsData, uniqueRegions } = useDashboardData(filters);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <KPISection stats={stats} timeTrend={chartsData.timeTrend} />;
      case 'charts':
        return <ChartsSection chartsData={chartsData} />;
      case 'orders':
        return <DataTable data={filteredData} />;
      case 'customers':
        return <CustomerTable data={filteredData} />;
      case 'regions':
        return <RegionTable data={filteredData} />;
      default:
        return <KPISection stats={stats} timeTrend={chartsData.timeTrend} />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        regions={uniqueRegions} 
      />
      
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
              {activeTab === 'overview' ? 'Tổng quan doanh thu' : 
               activeTab === 'charts' ? 'Phân tích biểu đồ' : 
               activeTab === 'orders' ? 'Danh sách đơn hàng' : 
               activeTab === 'customers' ? 'Dữ liệu khách hàng' : 'Phân tích khu vực'}
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Báo cáo hiệu suất kinh doanh thời gian thực.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <button className="theme-toggle-btn" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Nhóm Tứ Linh</div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>QTHTTT</div>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--primary-color)' }}>
                   <User size={20} color="var(--primary-color)" />
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
              <option value="all">Tất cả</option>
              <option value="pending">Chờ xử lý</option>
              <option value="shipped">Đang giao</option>
              <option value="delivered">Đã giao</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Khu vực</label>
            <select value={filters.region} onChange={(e) => setFilters(prev => ({...prev, region: e.target.value}))}>
              {uniqueRegions.map(r => (
                <option key={r} value={r}>{r === 'all' ? 'Tất cả' : r}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="tab-content" style={{ animation: 'fadeIn 0.4s ease' }}>
          {renderContent()}
        </div>
        
        <footer style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
          © 2026 BI Performance System • Nhóm Tứ Linh Implementation
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
