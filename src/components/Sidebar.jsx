import React from 'react';
import { LayoutDashboard, ShoppingBag, Users, Map, Settings, Filter, RefreshCw } from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="sidebar glass" style={{ borderRight: '1px solid var(--border-color)', borderRadius: 0, padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
        <div style={{ background: 'var(--primary-color)', padding: '0.5rem', borderRadius: '8px' }}>
          <Activity color="white" size={24} />
        </div>
        <h2 style={{ fontSize: '1.25rem' }}>BI Dashboard</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Hệ thống</div>
        
        <button 
          onClick={() => setActiveTab('overview')} 
          className={`sidebar-btn ${activeTab === 'overview' ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} /> Tổng quan
        </button>
        
        <button 
          onClick={() => setActiveTab('charts')} 
          className={`sidebar-btn ${activeTab === 'charts' ? 'active' : ''}`}
        >
          <Activity size={20} /> Biểu đồ
        </button>
        
        <button 
          onClick={() => setActiveTab('orders')} 
          className={`sidebar-btn ${activeTab === 'orders' ? 'active' : ''}`}
        >
          <ShoppingBag size={20} /> Đơn hàng
        </button>
        
        <button 
          onClick={() => setActiveTab('customers')} 
          className={`sidebar-btn ${activeTab === 'customers' ? 'active' : ''}`}
        >
          <Users size={20} /> Khách hàng
        </button>
        
        <button 
          onClick={() => setActiveTab('regions')} 
          className={`sidebar-btn ${activeTab === 'regions' ? 'active' : ''}`}
        >
          <Map size={20} /> Khu vực
        </button>

      </nav>
    </aside>
  );
};

import { Activity } from 'lucide-react';
