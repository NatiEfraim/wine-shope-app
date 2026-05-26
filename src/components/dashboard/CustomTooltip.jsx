import React from 'react';
import { currencyFmt } from './constants';

export default function CustomTooltip({ active, payload, label, valueLabel = 'הכנסות' }) {
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
