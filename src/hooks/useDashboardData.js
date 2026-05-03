import { useMemo } from 'react';
import { parseISO, format, isWithinInterval, startOfDay, subDays, differenceInDays } from 'date-fns';
import rawData from '../data.json';

export const useDashboardData = (filters) => {
  const transformedData = useMemo(() => {
    return rawData.map(order => ({
      ...order,
      total_amount: parseFloat(order.total_amount),
      date: parseISO(order.created_at.replace(' ', 'T')), // Normalize for date-fns
      dateStr: format(parseISO(order.created_at.replace(' ', 'T')), 'yyyy-MM-dd'),
      region: order.shipping_address.includes(',') 
        ? order.shipping_address.split(',').pop().trim() 
        : order.shipping_address.length > 20 
          ? order.shipping_address.substring(0, 15) + '...' 
          : order.shipping_address
    }));
  }, []);

  const filteredData = useMemo(() => {
    return transformedData.filter(order => {
      const dateMatch = !filters.dateRange.start || !filters.dateRange.end || 
        isWithinInterval(order.date, { 
          start: startOfDay(parseISO(filters.dateRange.start)), 
          end: startOfDay(parseISO(filters.dateRange.end)) 
        });
      const statusMatch = filters.status === 'all' || order.status === filters.status;
      const paymentMatch = filters.paymentStatus === 'all' || order.payment_status === filters.paymentStatus;
      const regionMatch = filters.region === 'all' || order.region === filters.region;
      const searchMatch = !filters.search || 
        order.order_code.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.recipient_name.toLowerCase().includes(filters.search.toLowerCase());

      return dateMatch && statusMatch && paymentMatch && regionMatch && searchMatch;
    });
  }, [transformedData, filters]);

  const stats = useMemo(() => {
    const totalRevenue = filteredData.reduce((sum, o) => sum + o.total_amount, 0);
    const totalOrders = filteredData.length;
    const paidOrders = filteredData.filter(o => o.payment_status === 'paid').length;
    const conversionRate = totalOrders > 0 ? (paidOrders / totalOrders) * 100 : 0;
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Growth calculation (comparing with previous period of same length)
    // For simplicity in this demo, we'll just show trend based on the latest 7 days vs previous 7 days
    const latestDate = new Date();
    const periodLength = 7;
    const currentPeriodStart = subDays(latestDate, periodLength);
    const prevPeriodStart = subDays(currentPeriodStart, periodLength);

    const currentRev = transformedData
      .filter(o => isWithinInterval(o.date, { start: currentPeriodStart, end: latestDate }))
      .reduce((sum, o) => sum + o.total_amount, 0);
    
    const prevRev = transformedData
      .filter(o => isWithinInterval(o.date, { start: prevPeriodStart, end: currentPeriodStart }))
      .reduce((sum, o) => sum + o.total_amount, 0);
    
    const revenueGrowth = prevRev > 0 ? ((currentRev - prevRev) / prevRev) * 100 : 0;

    return {
      totalRevenue,
      totalOrders,
      conversionRate,
      aov,
      revenueGrowth,
      paidOrders
    };
  }, [filteredData, transformedData]);

  const chartsData = useMemo(() => {
    // Time Trend
    const timeTrend = filteredData.reduce((acc, o) => {
      acc[o.dateStr] = (acc[o.dateStr] || 0) + o.total_amount;
      return acc;
    }, {});
    
    const timeTrendArray = Object.entries(timeTrend)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Region Revenue
    const regionRev = filteredData.reduce((acc, o) => {
      acc[o.region] = (acc[o.region] || 0) + o.total_amount;
      return acc;
    }, {});
    
    const regionRevArray = Object.entries(regionRev)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Status Distribution
    const statusDist = filteredData.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});
    
    const statusDistArray = Object.entries(statusDist).map(([name, value]) => ({ name, value }));

    // Paid vs Pending Stacked
    const paymentStacked = filteredData.reduce((acc, o) => {
      const date = o.dateStr;
      if (!acc[date]) acc[date] = { date, paid: 0, pending: 0 };
      if (o.payment_status === 'paid') acc[date].paid += o.total_amount;
      else acc[date].pending += o.total_amount;
      return acc;
    }, {});

    const paymentStackedArray = Object.values(paymentStacked).sort((a, b) => a.date.localeCompare(b.date));

    return {
      timeTrend: timeTrendArray,
      regionRevenue: regionRevArray,
      statusDistribution: statusDistArray,
      paymentStacked: paymentStackedArray,
      scatterData: filteredData.map(o => ({
        time: o.date.getTime(),
        value: o.total_amount,
        code: o.order_code
      }))
    };
  }, [filteredData]);

  const uniqueRegions = useMemo(() => {
    return ['all', ...new Set(transformedData.map(o => o.region))];
  }, [transformedData]);

  return {
    filteredData,
    stats,
    chartsData,
    uniqueRegions
  };
};
