import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import Card from '../Card';
import SectionHeader from './SectionHeader';
import CustomTooltip from './CustomTooltip';
import EmptyState from './EmptyState';
import { BOUTIQUE } from './constants';

export default function OrderStatusChart({ data, totalOrders, hasData }) {
  return (
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
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={3}
                stroke={BOUTIQUE.cream}
                strokeWidth={3}
              >
                {data.map((entry) => (
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
  );
}
