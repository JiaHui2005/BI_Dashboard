import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Percent, CreditCard } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const KPICard = ({ title, value, trend, icon: Icon, unit = '', data = [] }) => {
  const isPositive = trend >= 0;
  
  return (
    <div className="card glass kpi-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="kpi-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="kpi-icon" style={{ 
          padding: '0.75rem', 
          borderRadius: '12px', 
          background: 'rgba(56, 189, 248, 0.1)', 
          color: 'var(--primary-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={24} />
        </div>
        <div className={`kpi-trend ${isPositive ? 'trend-up' : 'trend-down'}`} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.25rem', 
          fontSize: '0.85rem', 
          fontWeight: 700,
          padding: '0.25rem 0.75rem',
          borderRadius: '20px',
          background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
        }}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {Math.abs(trend).toFixed(1)}%
        </div>
      </div>
      <div>
        <div className="kpi-title" style={{ 
          color: 'var(--text-muted)', 
          fontSize: '0.9rem', 
          fontWeight: 600, 
          marginBottom: '0.25rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>{title}</div>
        <div className="kpi-value" style={{ 
          fontFamily: 'Outfit', 
          fontSize: '2.25rem', 
          fontWeight: 800, 
          color: 'var(--text-main)',
          lineHeight: 1
        }}>
          {unit}{typeof value === 'number' ? value.toLocaleString() : value}
        </div>
      </div>
      <div className="mini-chart" style={{ height: '60px', marginTop: '0.5rem', opacity: 0.8 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={isPositive ? 'var(--success-color)' : 'var(--danger-color)'} 
              strokeWidth={3} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const KPISection = ({ stats, timeTrend }) => {
  const dummyTrend = timeTrend.slice(-10).map(d => ({ value: d.amount }));

  return (
    <div className="kpi-grid">
      <KPICard 
        title="Tổng doanh thu" 
        value={stats.totalRevenue} 
        trend={stats.revenueGrowth} 
        icon={DollarSign} 
        unit="₫"
        data={dummyTrend}
      />
      <KPICard 
        title="Tăng trưởng" 
        value={`${stats.revenueGrowth.toFixed(1)}%`} 
        trend={stats.revenueGrowth} 
        icon={TrendingUp}
        data={dummyTrend}
      />
      <KPICard 
        title="Tổng đơn hàng" 
        value={stats.totalOrders} 
        trend={5.2} 
        icon={ShoppingBag}
        data={dummyTrend.map(d => ({ value: d.value / 100000 }))} 
      />
      <KPICard 
        title="Tỉ lệ chuyển đổi" 
        value={`${stats.conversionRate.toFixed(1)}%`} 
        trend={-1.4} 
        icon={Percent}
        data={[{value: 10}, {value: 15}, {value: 12}, {value: 18}, {value: 16}, {value: 14}, {value: 20}]}
      />
      <KPICard 
        title="Giá trị TB đơn" 
        value={Math.round(stats.aov)} 
        trend={2.8} 
        icon={CreditCard} 
        unit="₫"
        data={dummyTrend}
      />
    </div>
  );
};
