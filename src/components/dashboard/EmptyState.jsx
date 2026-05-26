import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function EmptyState({ text }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      <div className="w-12 h-12 rounded-full bg-boutique-parchment border border-boutique-linen flex items-center justify-center mb-3">
        <TrendingUp size={20} className="text-boutique-gold-muted" />
      </div>
      <p className="text-sm text-boutique-muted font-sans">{text}</p>
    </div>
  );
}
