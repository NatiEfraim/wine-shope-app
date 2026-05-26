import React from 'react';

export default function SectionHeader({ icon: Icon, eyebrow, title, subtitle }) {
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
