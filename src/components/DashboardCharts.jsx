import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, Trophy, Users, Crown, Repeat, Wallet, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from './Card';

const BOUTIQUE = {
  burgundy: '#5C2430',
  burgundyDark: '#3D1520',
  gold: '#C9A962',
  goldLight: '#E8D5A3',
  goldMuted: '#A68B4B',
  ink: '#2C2825',
  charcoal: '#1A1614',
  muted: '#8A8278',
  linen: '#E8E2D8',
  parchment: '#F0EBE3',
  cream: '#FAF7F2',
};

const STATUS_META = {
  pending:   { label: 'ממתין לאישור', color: BOUTIQUE.goldMuted },
  approved:  { label: 'אושר',         color: BOUTIQUE.gold },
  delivered: { label: 'נשלח',          color: BOUTIQUE.ink },
  completed: { label: 'הושלם',         color: BOUTIQUE.burgundy },
};

const HEBREW_MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];

const WINE_HEBREW_NAMES = {
  'Cabernet Sauvignon': 'קברנה סוביניון',
  'Merlot': 'מרלו',
  'Chardonnay': 'שרדונה',
  'Rosé Wine': 'יין רוזה',
  'Pinot Noir': 'פינו נואר',
  'Sauvignon Blanc': 'סוביניון בלאן',
  'Shiraz': 'שירז',
  'Malbec': 'מלבק',
  'Gewürztraminer': 'גוורצטרמינר',
  'Riesling': 'ריזלינג',
  'Moscato': 'מוסקטו',
  'Zinfandel': 'זינפנדל',
  'Syrah Reserve': 'סירה רזרב',
  'White Blend': 'בלנד לבן',
  'Red Blend': 'בלנד אדום',
  'Sparkling Brut': 'יין מבעבע ברוט',
  'Prosecco': 'פרוסקו',
  'Port Wine': 'יין פורט',
  'Dessert Wine': 'יין קינוח',
  'Petit Verdot': 'פטיט ורדו',
  'Viognier': 'ויונייה',
  'Grenache': 'גרנש',
  'Tempranillo': 'טמפרניו',
  'Barbera': 'ברברה',
  'Chianti': 'קיאנטי',
  'Cava Brut': 'קאווה ברוט',
  'Ice Wine': 'יין קרח',
  'Organic Red Wine': 'יין אדום אורגני',
  'Organic White Wine': 'יין לבן אורגני',
  'Premium Rosé': 'רוזה פרימיום',
};

function toHebrewWineName(name) {
  if (!name) return '';
  return WINE_HEBREW_NAMES[name] || name;
}

const currencyFmt = new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
  maximumFractionDigits: 0,
});

function CustomTooltip({ active, payload, label, valueLabel = 'הכנסות' }) {
  if (!active || !payload?.length) return null;
  const isCurrency = valueLabel === 'הכנסות';
  return (
    <div
      dir="rtl"
      className="bg-boutique-charcoal/95 border border-boutique-gold/40 text-boutique-cream px-4 py-3 rounded-sm shadow-boutique-lg font-sans"
    >
      {label && (
        <p className="text-[10px] uppercase tracking-luxury text-boutique-gold-light/80 mb-1.5">
          {label}
        </p>
      )}
      {payload.map((entry, idx) => (
        <p key={idx} className="text-sm font-semibold flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: entry.color || entry.payload?.fill }}
          />
          <span className="text-boutique-gold-light/70 font-normal">{entry.name || valueLabel}:</span>
          <span className="font-serif">
            {typeof entry.value === 'number' && isCurrency
              ? currencyFmt.format(entry.value)
              : entry.value}
          </span>
        </p>
      ))}
    </div>
  );
}

function TopWinesList({ data }) {
  const maxQty = Math.max(...data.map((p) => p.quantity), 1);
  return (
    <ul className="space-y-4 pt-1" dir="rtl">
      {data.map((p, idx) => {
        const percent = (p.quantity / maxQty) * 100;
        return (
          <li key={p.name} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 font-sans">
              <span className="font-serif text-base font-semibold text-boutique-ink truncate">
                <span className="inline-block w-5 text-boutique-gold-muted font-bold text-sm">
                  {idx + 1}.
                </span>
                {p.displayName}
              </span>
              <span className="shrink-0 text-sm">
                <span className="font-serif font-bold text-boutique-burgundy">
                  {p.quantity}
                </span>
                <span className="text-boutique-muted mr-1">בקבוקים</span>
              </span>
            </div>
            <div className="h-2.5 w-full bg-boutique-linen/60 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${percent}%`,
                  background: `linear-gradient(to left, ${BOUTIQUE.gold}, ${BOUTIQUE.goldMuted})`,
                  marginRight: 0,
                  marginLeft: 'auto',
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function TopCustomersList({ data }) {
  const maxRevenue = Math.max(...data.map((c) => c.revenue), 1);
  return (
    <ul className="space-y-3.5" dir="rtl">
      {data.map((c, idx) => {
        const percent = (c.revenue / maxRevenue) * 100;
        const isTop3 = idx < 3;
        return (
          <li
            key={c.id}
            className="group rounded-sm border border-boutique-linen/60 bg-white/60 px-4 py-3 transition-all hover:border-boutique-gold/40 hover:bg-white hover:shadow-sm"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-serif text-sm font-bold ${
                    isTop3
                      ? 'bg-boutique-burgundy text-boutique-cream'
                      : 'bg-boutique-parchment text-boutique-muted'
                  }`}
                >
                  {idx === 0 ? <Crown size={14} /> : idx + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-serif font-semibold text-boutique-ink truncate text-base leading-tight">
                    {c.name}
                  </p>
                  {c.favoriteWine && (
                    <p className="text-[11px] text-boutique-muted truncate font-sans mt-0.5">
                      מועדף: <span className="text-boutique-gold-muted font-medium">{c.favoriteWine}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="text-left shrink-0">
                <p className="font-serif font-bold text-lg text-boutique-burgundy leading-tight">
                  {currencyFmt.format(c.revenue)}
                </p>
                <p className="text-[11px] text-boutique-muted font-sans">
                  {c.orders} {c.orders === 1 ? 'הזמנה' : 'הזמנות'}
                </p>
              </div>
            </div>
            <div className="h-2.5 w-full bg-boutique-linen/60 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${percent}%`,
                  background: `linear-gradient(to left, ${BOUTIQUE.burgundy}, ${BOUTIQUE.gold})`,
                  marginLeft: 'auto',
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function CustomerKpis({ kpis }) {
  const cards = [
    {
      label: 'לקוחות פעילים',
      value: kpis.activeCustomers.toLocaleString('he-IL'),
      icon: Users,
      accent: BOUTIQUE.burgundy,
    },
    {
      label: 'הוצאה ממוצעת ללקוח',
      value: currencyFmt.format(kpis.avgRevenue),
      icon: Wallet,
      accent: BOUTIQUE.gold,
    },
    {
      label: 'אחוז לקוחות חוזרים',
      value: `${kpis.returningRate}%`,
      icon: Repeat,
      accent: BOUTIQUE.ink,
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5" dir="rtl">
      {cards.map(({ label, value, icon: Icon, accent }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-sm border border-boutique-linen/70 bg-boutique-parchment/40 px-4 py-3"
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ background: `${accent}15`, color: accent }}
          >
            <Icon size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-luxury text-boutique-gold-muted font-medium font-sans">
              {label}
            </p>
            <p className="font-serif text-xl font-bold text-boutique-ink leading-tight">
              {value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ icon: Icon, eyebrow, title, subtitle }) {
  return (
    <div className="mb-6">
      <p className="font-sans text-[10px] font-medium uppercase tracking-luxury text-boutique-gold-muted mb-1.5">
        {eyebrow}
      </p>
      <h3 className="font-serif text-2xl font-bold text-boutique-ink flex items-center gap-2.5">
        <Icon size={20} className="text-boutique-gold-muted" />
        {title}
      </h3>
      {subtitle && (
        <p className="text-sm text-boutique-muted font-sans mt-1">{subtitle}</p>
      )}
    </div>
  );
}

export default function DashboardCharts({ bookings = [] }) {
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

  const totalOrders = statusBreakdown.reduce((sum, s) => sum + s.value, 0);
  const hasData = totalOrders > 0;
  const hasItems = topProducts.length > 0;
  const hasCustomers = topCustomers.length > 0;

  const revenueRangeLabel = useMemo(() => {
    if (revenueByMonth.length === 0) return '12 החודשים האחרונים';
    const first = revenueByMonth[0];
    const last = revenueByMonth[revenueByMonth.length - 1];
    return `${first.month} ← ${last.month}`;
  }, [revenueByMonth]);

  return (
    <div className="space-y-6" dir="rtl">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="p-6 lg:col-span-2">
        <SectionHeader
          icon={TrendingUp}
          eyebrow="Revenue Trend"
          title="הכנסות לפי חודש"
          subtitle={revenueRangeLabel}
        />

        <div className="h-72 w-full overflow-hidden">
          {revenueByMonth.some((m) => m.revenue > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueByMonth}
                margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="boutique-burgundy-bar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={BOUTIQUE.burgundy}     stopOpacity={0.95} />
                    <stop offset="100%" stopColor={BOUTIQUE.burgundyDark} stopOpacity={0.85} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={BOUTIQUE.linen} vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: BOUTIQUE.muted, fontSize: 10, fontFamily: 'Montserrat' }}
                  axisLine={{ stroke: BOUTIQUE.linen }}
                  tickLine={false}
                  interval={0}
                  reversed
                />
                <YAxis
                  tick={{ fill: BOUTIQUE.muted, fontSize: 11, fontFamily: 'Montserrat' }}
                  axisLine={false}
                  tickLine={false}
                  orientation="right"
                  tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v)}
                />
                <Tooltip
                  cursor={{ fill: BOUTIQUE.parchment, opacity: 0.6 }}
                  content={<CustomTooltip valueLabel="הכנסות" />}
                  wrapperStyle={{ outline: 'none', zIndex: 50, pointerEvents: 'none' }}
                  position={{ x: 12, y: 8 }}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="revenue"
                  name="הכנסות"
                  fill="url(#boutique-burgundy-bar)"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState text="אין עדיין מספיק נתונים להצגת מגמת מכירות" />
          )}
        </div>
      </Card>

      <Card className="p-6">
        <SectionHeader
          icon={PieIcon}
          eyebrow="Order Status"
          title="פילוג הזמנות"
          subtitle={hasData ? `סה"כ ${totalOrders} הזמנות` : 'התפלגות לפי סטטוס'}
        />

        <div className="h-72 w-full overflow-hidden">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusBreakdown}
                  dataKey="value"
                  nameKey="label"
                  innerRadius="55%"
                  outerRadius="85%"
                  paddingAngle={3}
                  stroke={BOUTIQUE.cream}
                  strokeWidth={3}
                >
                  {statusBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomTooltip valueLabel="הזמנות" />}
                  wrapperStyle={{ outline: 'none', zIndex: 50, pointerEvents: 'none' }}
                  position={{ x: 12, y: 8 }}
                  isAnimationActive={false}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{
                    fontFamily: 'Montserrat',
                    fontSize: 12,
                    color: BOUTIQUE.ink,
                    paddingTop: 8,
                  }}
                  formatter={(value) => (
                    <span style={{ color: BOUTIQUE.ink }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState text="אין הזמנות לפילוג" />
          )}
        </div>
      </Card>
    </div>

    <Card className="p-6">
      <SectionHeader
        icon={Trophy}
        eyebrow="Best Sellers"
        title="היינות הנמכרים ביותר"
        subtitle={hasItems ? 'Top 5 לפי כמות בקבוקים' : 'אין עדיין נתוני מכירות'}
      />

      <div className="min-h-[18rem] w-full">
        {hasItems ? (
          <TopWinesList data={topProducts} />
        ) : (
          <div className="h-72 w-full">
            <EmptyState text="עדיין לא נרשמו מכירות של מוצרים" />
          </div>
        )}
      </div>
    </Card>

    <Card className="p-6">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <p className="font-sans text-[10px] font-medium uppercase tracking-luxury text-boutique-gold-muted mb-1.5">
            Top Customers
          </p>
          <h3 className="font-serif text-2xl font-bold text-boutique-ink flex items-center gap-2.5">
            <Users size={20} className="text-boutique-gold-muted" />
            הלקוחות המובילים
          </h3>
          <p className="text-sm text-boutique-muted font-sans mt-1">
            {hasCustomers
              ? `Top ${topCustomers.length} לפי סך הוצאות`
              : 'אין עדיין לקוחות עם הזמנות'}
          </p>
        </div>
        <Link
          to="/admin/users"
          className="shrink-0 flex items-center gap-1.5 text-xs font-sans font-medium text-boutique-burgundy hover:text-boutique-burgundy-dark transition-colors group"
        >
          כל הלקוחות
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
        </Link>
      </div>

      {hasCustomers ? (
        <>
          <CustomerKpis kpis={customerKpis} />
          <TopCustomersList data={topCustomers} />
        </>
      ) : (
        <div className="h-48 w-full">
          <EmptyState text="עדיין לא בוצעו הזמנות על ידי לקוחות" />
        </div>
      )}
    </Card>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      <div className="w-12 h-12 rounded-full bg-boutique-parchment border border-boutique-linen flex items-center justify-center mb-3">
        <TrendingUp size={20} className="text-boutique-gold-muted" />
      </div>
      <p className="text-sm text-boutique-muted font-sans">{text}</p>
    </div>
  );
}
