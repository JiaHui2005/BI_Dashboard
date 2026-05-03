import { format } from 'date-fns';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ZAxis
} from 'recharts';

const COLORS = ['#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const ChartWrapper = ({ title, children, className = "" }) => (
  <div className={`card glass chart-container ${className}`}>
    <div className="chart-header">
      <h3>{title}</h3>
    </div>
    <div style={{ width: '100%', height: '320px' }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

export const ChartsSection = ({ chartsData }) => {
  return (
    <div className="charts-grid">
      {/* Line Chart: Daily Revenue */}
      <ChartWrapper title="Xu hướng doanh thu (Ngày)" className="full">
        <LineChart data={chartsData.timeTrend}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            fontSize={12}
            tickFormatter={(str) => str.split('-').slice(1).join('/')}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickFormatter={(val) => `${(val / 1000000).toFixed(1)}Tr`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#38bdf8' }}
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

      {/* Bar Chart: Region Revenue */}
      <ChartWrapper title="Doanh thu theo khu vực" className="half">
        <BarChart data={chartsData.regionRevenue} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            stroke="#94a3b8"
            fontSize={10}
            width={100}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <Bar name="Doanh thu" dataKey="value" fill="#38bdf8" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ChartWrapper>

      {/* Pie Chart: Status Distribution */}
      <ChartWrapper title="Phân bổ trạng thái đơn hàng" className="half">
        <PieChart>
          <Pie
            data={chartsData.statusDistribution}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {chartsData.statusDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ChartWrapper>

      {/* Scatter Plot: Order Value vs Time (Outliers) */}
      <ChartWrapper title="Phân tích đơn hàng ngoại lai" className="half">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            type="number"
            dataKey="time"
            name="Thời gian"
            stroke="#94a3b8"
            tickFormatter={(unix) => format(new Date(unix), 'dd/MM')}
          />
          <YAxis
            type="number"
            dataKey="value"
            name="Giá trị"
            stroke="#94a3b8"
            tickFormatter={(val) => `${val / 1000}k`}
          />
          <ZAxis range={[60, 400]} />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }}
          />
          <Scatter name="Đơn hàng" data={chartsData.scatterData} fill="#8b5cf6" />
        </ScatterChart>
      </ChartWrapper>

      {/* Stacked Bar: Paid vs Pending Revenue */}
      <ChartWrapper title="Doanh thu Đã trả vs Chờ trả" className="half">
        <BarChart data={chartsData.paymentStacked}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            fontSize={12}
            tickFormatter={(str) => str.split('-').slice(1).join('/')}
          />
          <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `${val / 1000000}Tr`} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} />
          <Legend />
          <Bar name="Đã thanh toán" dataKey="paid" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
          <Bar name="Chờ thanh toán" dataKey="pending" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartWrapper>
    </div>
  );
};
