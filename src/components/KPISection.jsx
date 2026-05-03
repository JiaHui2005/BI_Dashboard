import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Percent, CreditCard, Activity } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const KPICard = ({ title, value, trend, icon: Icon, unit = '', data = [] }) => {
  const isPositive = trend >= 0;
  
  return (
    <div className="card glass kpi-card">
      <div className="kpi-header">
        <div className="kpi-icon">
          <Icon size={20} />
        </div>
        <div className={`kpi-trend ${isPositive ? 'trend-up' : 'trend-down'}`}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {Math.abs(trend).toFixed(1)}%
        </div>
      </div>
      <div>
        <div className="kpi-title">{title}</div>
        <div className="kpi-value">
          {unit}{typeof value === 'number' ? value.toLocaleString() : value}
        </div>
      </div>
      <div className="mini-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={isPositive ? '#10b981' : '#ef4444'} 
              strokeWidth={2} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const KPISection = ({ stats, timeTrend }) => {
  const dummyTrend = timeTrend.slice(-7).map(d => ({ value: d.amount }));

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
        title="Tăng trưởng DT" 
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
        title="Tỷ lệ chuyển đổi" 
        value={`${stats.conversionRate.toFixed(1)}%`} 
        trend={-1.4} 
        icon={Percent}
        data={[{value: 10}, {value: 15}, {value: 12}, {value: 18}, {value: 16}]}
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
