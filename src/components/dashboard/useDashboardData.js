import { useMemo } from 'react';
import { BOUTIQUE, STATUS_META, HEBREW_MONTHS, toHebrewWineName } from './constants';

export function useDashboardData(bookings) {
  const revenueByMonth = useMemo(() => {
    const buckets = new Map();
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      buckets.set(key, {
        key,
        month: `${HEBREW_MONTHS[d.getMonth()]} '${String(d.getFullYear()).slice(-2)}`,
        year: d.getFullYear(),
        revenue: 0,
        orders: 0,
      });
    }

    bookings.forEach((b) => {
      if (!b?.created_at) return;
      const d = new Date(b.created_at);
      if (Number.isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = buckets.get(key);
      if (!bucket) return;
      bucket.revenue += parseFloat(b.total_price || 0);
      bucket.orders += 1;
    });

    return Array.from(buckets.values());
  }, [bookings]);

  const statusBreakdown = useMemo(() => {
    const counts = {};
    bookings.forEach((b) => {
      const name = b?.status?.name || 'unknown';
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        label: STATUS_META[name]?.label || name,
        color: STATUS_META[name]?.color || BOUTIQUE.muted,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [bookings]);

  const topProducts = useMemo(() => {
    const tally = new Map();
    bookings.forEach((b) => {
      (b?.items || []).forEach((item) => {
        const name = item?.product?.name;
        if (!name) return;
        const qty = parseInt(item.quantity || 0, 10);
        const revenue = parseFloat(item.total_price || (item.unit_price * qty) || 0);
        const prev = tally.get(name) || { name, quantity: 0, revenue: 0 };
        prev.quantity += qty;
        prev.revenue += revenue;
        tally.set(name, prev);
      });
    });
    return Array.from(tally.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
      .map((p) => {
        const hebrewName = toHebrewWineName(p.name);
        return {
          ...p,
          displayName: hebrewName.length > 28 ? `${hebrewName.slice(0, 28)}…` : hebrewName,
        };
      });
  }, [bookings]);

  const customerStats = useMemo(() => {
    const map = new Map();
    bookings.forEach((b) => {
      const u = b?.user;
      if (!u?.id) return;
      const key = u.id;
      const prev = map.get(key) || {
        id: u.id,
        name: u.name || 'לקוח אנונימי',
        email: u.email || '',
        revenue: 0,
        orders: 0,
        wines: new Map(),
      };
      prev.revenue += parseFloat(b.total_price || 0);
      prev.orders += 1;
      (b?.items || []).forEach((item) => {
        const wineName = item?.product?.name;
        if (!wineName) return;
        const qty = parseInt(item.quantity || 0, 10);
        prev.wines.set(wineName, (prev.wines.get(wineName) || 0) + qty);
      });
      map.set(key, prev);
    });
    return Array.from(map.values()).map((c) => {
      let favoriteWine = null;
      let maxQty = 0;
      c.wines.forEach((qty, name) => {
        if (qty > maxQty) {
          maxQty = qty;
          favoriteWine = name;
        }
      });
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        revenue: Math.round(c.revenue),
        orders: c.orders,
        favoriteWine: favoriteWine ? toHebrewWineName(favoriteWine) : null,
      };
    });
  }, [bookings]);

  const topCustomers = useMemo(
    () => [...customerStats].sort((a, b) => b.revenue - a.revenue).slice(0, 10),
    [customerStats],
  );

  const customerKpis = useMemo(() => {
    const activeCustomers = customerStats.length;
    const totalRevenue = customerStats.reduce((sum, c) => sum + c.revenue, 0);
    const avgRevenue = activeCustomers > 0 ? totalRevenue / activeCustomers : 0;
    const returningCustomers = customerStats.filter((c) => c.orders >= 2).length;
    const returningRate = activeCustomers > 0 ? (returningCustomers / activeCustomers) * 100 : 0;
    return {
      activeCustomers,
      avgRevenue: Math.round(avgRevenue),
      returningRate: Math.round(returningRate),
    };
  }, [customerStats]);

  const revenueRangeLabel = useMemo(() => {
    if (revenueByMonth.length === 0) return '12 החודשים האחרונים';
    const first = revenueByMonth[0];
    const last = revenueByMonth[revenueByMonth.length - 1];
    return `${first.month} ← ${last.month}`;
  }, [revenueByMonth]);

  const totalOrders = statusBreakdown.reduce((sum, s) => sum + s.value, 0);

  return {
    revenueByMonth,
    statusBreakdown,
    topProducts,
    topCustomers,
    customerKpis,
    revenueRangeLabel,
    totalOrders,
    hasData: totalOrders > 0,
    hasItems: topProducts.length > 0,
    hasCustomers: topCustomers.length > 0,
  };
}
