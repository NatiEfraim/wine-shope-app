import React from 'react';
import { Trophy } from 'lucide-react';
import Card from '../Card';
import SectionHeader from './SectionHeader';
import EmptyState from './EmptyState';
import { BOUTIQUE } from './constants';

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

export default function TopWinesChart({ data, hasItems }) {
  return (
    <Card className="p-6">
      <SectionHeader
        icon={Trophy}
        eyebrow="Best Sellers"
        title="היינות הנמכרים ביותר"
        subtitle={hasItems ? 'Top 5 לפי כמות בקבוקים' : 'אין עדיין נתוני מכירות'}
      />

      <div className="min-h-[18rem] w-full">
        {hasItems ? (
          <TopWinesList data={data} />
        ) : (
          <div className="h-72 w-full">
            <EmptyState text="עדיין לא נרשמו מכירות של מוצרים" />
          </div>
        )}
      </div>
    </Card>
  );
}
