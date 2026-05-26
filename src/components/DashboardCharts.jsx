import React from 'react';
import { useDashboardData } from './dashboard/useDashboardData';
import RevenueChart from './dashboard/RevenueChart';
import OrderStatusChart from './dashboard/OrderStatusChart';
import TopWinesChart from './dashboard/TopWinesChart';
import TopCustomersChart from './dashboard/TopCustomersChart';

export default function DashboardCharts({ bookings = [] }) {
  const {
    revenueByMonth,
    statusBreakdown,
    topProducts,
    topCustomers,
    customerKpis,
    revenueRangeLabel,
    totalOrders,
    hasData,
    hasItems,
    hasCustomers,
  } = useDashboardData(bookings);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart data={revenueByMonth} rangeLabel={revenueRangeLabel} />
        <OrderStatusChart
          data={statusBreakdown}
          totalOrders={totalOrders}
          hasData={hasData}
        />
      </div>

      <TopWinesChart data={topProducts} hasItems={hasItems} />

      <TopCustomersChart
        data={topCustomers}
        kpis={customerKpis}
        hasCustomers={hasCustomers}
      />
    </div>
  );
}
