import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Crown, Repeat, Wallet, ArrowLeft } from 'lucide-react';
import Card from '../Card';
import EmptyState from './EmptyState';
import { BOUTIQUE, currencyFmt } from './constants';
import { useAuthStore } from '../../store/useAuthStore';

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

export default function TopCustomersChart({ data, kpis, hasCustomers }) {
  const { user } = useAuthStore();
  const isSuperAdmin = user?.role?.some(r => r.id === 1);

  return (
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
              ? `Top ${data.length} לפי סך הוצאות`
              : 'אין עדיין לקוחות עם הזמנות'}
          </p>
        </div>
        
        {isSuperAdmin && (
          <Link
            to="/admin/users"
            className="shrink-0 flex items-center gap-1.5 text-xs font-sans font-medium text-boutique-burgundy hover:text-boutique-burgundy-dark transition-colors group"
          >
            כל הלקוחות
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          </Link>
        )}
      </div>

      {hasCustomers ? (
        <>
          <CustomerKpis kpis={kpis} />
          <TopCustomersList data={data} />
        </>
      ) : (
        <div className="h-48 w-full">
          <EmptyState text="עדיין לא בוצעו הזמנות על ידי לקוחות" />
        </div>
      )}
    </Card>
  );
}