import { useMemo } from 'react';
import { parseISO, format, isWithinInterval, startOfDay, endOfDay, subDays, differenceInDays } from 'date-fns';
import rawData from '../data.json';
import orderItems from '../data/order_items.json';
import products from '../data/products.json';
import categories from '../data/categories.json';

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
      // Date filter logic
      let dateMatch = true;
      if (filters.dateRange.start && filters.dateRange.end) {
        dateMatch = isWithinInterval(order.date, { 
          start: startOfDay(parseISO(filters.dateRange.start)), 
          end: endOfDay(parseISO(filters.dateRange.end)) 
        });
      } else if (filters.dateRange.start) {
        dateMatch = order.date >= startOfDay(parseISO(filters.dateRange.start));
      } else if (filters.dateRange.end) {
        dateMatch = order.date <= endOfDay(parseISO(filters.dateRange.end));
      }

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
    // Time Trend (Daily)
    const dailyTrend = filteredData.reduce((acc, o) => {
      acc[o.dateStr] = (acc[o.dateStr] || 0) + o.total_amount;
      return acc;
    }, {});
    
    const dailyTrendArray = Object.entries(dailyTrend)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Weekly Trend
    const weeklyTrend = filteredData.reduce((acc, o) => {
      const week = format(o.date, 'yyyy-ww');
      acc[week] = (acc[week] || 0) + o.total_amount;
      return acc;
    }, {});
    const weeklyTrendArray = Object.entries(weeklyTrend)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Monthly Trend
    const monthlyTrend = filteredData.reduce((acc, o) => {
      const month = format(o.date, 'yyyy-MM');
      acc[month] = (acc[month] || 0) + o.total_amount;
      return acc;
    }, {});
    const monthlyTrendArray = Object.entries(monthlyTrend)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Region Revenue Comparison (High vs Low)
    const regionRev = filteredData.reduce((acc, o) => {
      acc[o.region] = (acc[o.region] || 0) + o.total_amount;
      return acc;
    }, {});
    
    const regionRevArray = Object.entries(regionRev)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Product Revenue
    const filteredOrderIds = new Set(filteredData.map(o => o.id));
    const productRevenueMap = orderItems
      .filter(item => filteredOrderIds.has(item.order_id))
      .reduce((acc, item) => {
        const prodId = item.product_id;
        const rev = parseFloat(item.price_at_purchase) * item.quantity;
        acc[prodId] = (acc[prodId] || 0) + rev;
        return acc;
      }, {});

    const productNames = products.reduce((acc, p) => {
      acc[p.id] = p.name;
      return acc;
    }, {});

    const productRevenueArray = Object.entries(productRevenueMap)
      .map(([id, value]) => ({ 
        id, 
        name: productNames[id] || `Sản phẩm ${id}`, 
        value 
      }))
      .sort((a, b) => b.value - a.value);

    // Category Revenue
    const productCategories = products.reduce((acc, p) => {
      acc[p.id] = p.parent_id;
      return acc;
    }, {});

    const categoryNames = categories.reduce((acc, c) => {
      acc[c.id] = c.name;
      return acc;
    }, {});

    const categoryRevenueMap = Object.entries(productRevenueMap).reduce((acc, [prodId, rev]) => {
      const catId = productCategories[prodId];
      if (catId) {
        acc[catId] = (acc[catId] || 0) + rev;
      }
      return acc;
    }, {});

    const categoryRevenueArray = Object.entries(categoryRevenueMap)
      .map(([id, value]) => ({ 
        id, 
        name: categoryNames[id] || `Danh mục ${id}`, 
        value 
      }))
      .sort((a, b) => b.value - a.value);

    // Status Distribution
    const statusDist = filteredData.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});
    
    const statusDistArray = Object.entries(statusDist).map(([name, value]) => ({ name, value }));

    // Top Products (High & Low)
    const topProductsHigh = productRevenueArray.slice(0, 10);
    const topProductsLow = [...productRevenueArray].reverse().slice(0, 10);

    // Top Categories (High & Low)
    const topCategoriesHigh = categoryRevenueArray.slice(0, 10);
    const topCategoriesLow = [...categoryRevenueArray].reverse().slice(0, 10);

    return {
      dailyTrend: dailyTrendArray,
      weeklyTrend: weeklyTrendArray,
      monthlyTrend: monthlyTrendArray,
      regionRevenue: regionRevArray,
      statusDistribution: statusDistArray,
      topProductsHigh,
      topProductsLow,
      topCategoriesHigh,
      topCategoriesLow,
      categoryContribution: categoryRevenueArray
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
