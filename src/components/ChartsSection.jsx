import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ZAxis
} from 'recharts';

const COLORS = ['#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f43f5e', '#84cc16'];

const ChartWrapper = ({ title, children, className = "", extra = null }) => (
  <div className={`card glass chart-container ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ 
        fontFamily: 'Outfit', 
        fontSize: '1.25rem', 
        fontWeight: 700, 
        color: 'var(--text-main)',
        letterSpacing: '-0.01em'
      }}>{title}</h3>
      {extra}
    </div>
    <div style={{ width: '100%', flex: 1, minHeight: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

export const ChartsSection = ({ chartsData }) => {
  const [timeMode, setTimeMode] = useState('day');

  const getTimeTrendData = () => {
    switch (timeMode) {
      case 'week': return chartsData.weeklyTrend;
      case 'month': return chartsData.monthlyTrend;
      default: return chartsData.dailyTrend;
    }
  };

  const timeTrendData = getTimeTrendData();

  return (
    <div className="charts-grid">
      {/* 1. Revenue Trend (Day/Week/Month) */}
      <ChartWrapper 
        title={`Xu hướng doanh thu (${timeMode === 'day' ? 'Ngày' : timeMode === 'week' ? 'Tuần' : 'Tháng'})`} 
        className="full"
        extra={
          <div className="toggle-group glass" style={{ display: 'flex', gap: '0.5rem', padding: '0.25rem', borderRadius: '8px' }}>
            <button 
              className={`btn-mini ${timeMode === 'day' ? 'active' : ''}`} 
              onClick={() => setTimeMode('day')}
              style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer', background: timeMode === 'day' ? 'var(--primary-color)' : 'transparent', color: timeMode === 'day' ? 'white' : 'var(--text-muted)' }}
            >
              Ngày
            </button>
            <button 
              className={`btn-mini ${timeMode === 'week' ? 'active' : ''}`} 
              onClick={() => setTimeMode('week')}
              style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer', background: timeMode === 'week' ? 'var(--primary-color)' : 'transparent', color: timeMode === 'week' ? 'white' : 'var(--text-muted)' }}
            >
              Tuần
            </button>
            <button 
              className={`btn-mini ${timeMode === 'month' ? 'active' : ''}`} 
              onClick={() => setTimeMode('month')}
              style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer', background: timeMode === 'month' ? 'var(--primary-color)' : 'transparent', color: timeMode === 'month' ? 'white' : 'var(--text-muted)' }}
            >
              Tháng
            </button>
          </div>
        }
      >
        <LineChart data={timeTrendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            fontSize={12}
            tickFormatter={(str) => {
               if (timeMode === 'day') return str.split('-').slice(1).join('/');
               return str;
            }}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickFormatter={(val) => `${(val / 1000000).toFixed(1)}Tr`}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'var(--surface-color)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ color: 'var(--primary-color)', fontWeight: 600 }}
            labelStyle={{ color: 'var(--text-main)', fontWeight: 700, marginBottom: '4px' }}
          />
          <Line
            name="Doanh thu"
            type="monotone"
            dataKey="amount"
            stroke="#38bdf8"
            strokeWidth={3}
            dot={{ r: 4, fill: '#38bdf8', strokeWidth: 2, stroke: '#0f172a' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ChartWrapper>

      {/* 2. Region Revenue Comparison */}
      <ChartWrapper title="So sánh doanh thu các khu vực" className="full">
        <BarChart data={chartsData.regionRevenue}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={11}
            angle={-15}
            textAnchor="end"
            height={60}
          />
          <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `${(val / 1000000).toFixed(1)}Tr`} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--surface-color)', 
              border: '1px solid var(--border-color)',
              borderRadius: '12px'
            }}
            itemStyle={{ color: 'var(--primary-color)', fontWeight: 600 }}
            labelStyle={{ color: 'var(--text-main)', fontWeight: 700 }}
          />
          <Bar name="Doanh thu" dataKey="value" radius={[4, 4, 0, 0]}>
            {chartsData.regionRevenue.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index < 3 ? '#38bdf8' : '#64748b'} />
            ))}
          </Bar>
        </BarChart>
      </ChartWrapper>

      {/* 3. Top Products High & Low */}
      <ChartWrapper title="Top 10 Sản phẩm doanh thu cao" className="half">
        <BarChart data={chartsData.topProductsHigh} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={120} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--surface-color)', 
              border: '1px solid var(--border-color)',
              borderRadius: '12px'
            }}
            itemStyle={{ color: 'var(--success-color)', fontWeight: 600 }}
            labelStyle={{ color: 'var(--text-main)', fontWeight: 700 }}
          />
          <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ChartWrapper>

      <ChartWrapper title="Top 10 Sản phẩm doanh thu thấp" className="half">
        <BarChart data={chartsData.topProductsLow} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={120} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--surface-color)', 
              border: '1px solid var(--border-color)',
              borderRadius: '12px'
            }}
            itemStyle={{ color: 'var(--danger-color)', fontWeight: 600 }}
            labelStyle={{ color: 'var(--text-main)', fontWeight: 700 }}
          />
          <Bar dataKey="value" fill="#f43f5e" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ChartWrapper>

      {/* 4. Top Categories High & Low */}
      <ChartWrapper title="Top Danh mục doanh thu cao" className="half">
        <BarChart data={chartsData.topCategoriesHigh} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={120} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--surface-color)', 
              border: '1px solid var(--border-color)',
              borderRadius: '12px'
            }}
            itemStyle={{ color: 'var(--primary-color)', fontWeight: 600 }}
            labelStyle={{ color: 'var(--text-main)', fontWeight: 700 }}
          />
          <Bar dataKey="value" fill="#38bdf8" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ChartWrapper>

      <ChartWrapper title="Top Danh mục doanh thu thấp" className="half">
        <BarChart data={chartsData.topCategoriesLow} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={120} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--surface-color)', 
              border: '1px solid var(--border-color)',
              borderRadius: '12px'
            }}
            itemStyle={{ color: 'var(--warning-color)', fontWeight: 600 }}
            labelStyle={{ color: 'var(--text-main)', fontWeight: 700 }}
          />
          <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ChartWrapper>

      {/* 5. Category Contribution */}
      <ChartWrapper title="Đóng góp của danh mục vào doanh thu" className="full">
        <PieChart>
          <Pie
            data={chartsData.categoryContribution}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
          >
            {chartsData.categoryContribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'var(--surface-color)', 
              border: '1px solid var(--border-color)',
              borderRadius: '12px'
            }}
            itemStyle={{ color: 'var(--text-main)', fontWeight: 600 }}
            labelStyle={{ color: 'var(--text-main)', fontWeight: 700 }}
            formatter={(value) => `${(value / 1000000).toFixed(2)} Tr VNĐ`}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ChartWrapper>
    </div>
  );
};
