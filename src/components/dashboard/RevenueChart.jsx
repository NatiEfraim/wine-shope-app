import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import Card from '../Card';
import SectionHeader from './SectionHeader';
import CustomTooltip from './CustomTooltip';
import EmptyState from './EmptyState';
import { BOUTIQUE } from './constants';

export default function RevenueChart({ data, rangeLabel }) {
  const hasRevenue = data.some((m) => m.revenue > 0);

  return (
    <Card className="p-6 lg:col-span-2">
      <SectionHeader
        icon={TrendingUp}
        eyebrow="Revenue Trend"
        title="הכנסות לפי חודש"
        subtitle={rangeLabel}
      />

      <div className="h-72 w-full overflow-hidden">
        {hasRevenue ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
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
  );
}
