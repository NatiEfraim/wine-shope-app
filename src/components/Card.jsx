import React, { useState, useEffect } from 'react';
import { Plus, Grape } from 'lucide-react';
import { CARD_IMAGE_FALLBACK } from '../data/wineImages';

const CATEGORY_STYLES = {
  אדום: 'bg-boutique-burgundy/10 text-boutique-burgundy border-boutique-burgundy/20',
  לבן: 'bg-amber-50 text-amber-900/80 border-amber-200/60',
  רוזה: 'bg-rose-50 text-rose-900/70 border-rose-200/50',
  מבעבע: 'bg-stone-100 text-stone-700 border-stone-200/70',
};

export default function Card({ children, className = '', variant = 'default' }) {
  const variants = {
    default:
      'bg-boutique-cream border border-boutique-linen/80 shadow-boutique hover:shadow-boutique-lg hover:border-boutique-gold/30',
    elevated:
      'bg-white border border-boutique-linen shadow-boutique-lg hover:shadow-gold-ring',
    dark: 'bg-boutique-charcoal border border-boutique-gold/20 text-boutique-cream shadow-boutique-lg',
  };

  return (
    <div
      className={`rounded-sm transition-all duration-500 ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </div>
  );
}

export function WineProductCard({ product, onAddToCart }) {
  const pillClass = CATEGORY_STYLES[product.category] || CATEGORY_STYLES['אדום'];
  const [imgSrc, setImgSrc] = useState(product.imageUrl || CARD_IMAGE_FALLBACK);
  const [failed, setFailed] = useState(false);
  const lowStock = product.stock < 10;

  useEffect(() => {
    setImgSrc(product.imageUrl || CARD_IMAGE_FALLBACK);
    setFailed(false);
  }, [product.id, product.imageUrl]);

  const handleError = () => {
    if (!failed) {
      setFailed(true);
      setImgSrc(CARD_IMAGE_FALLBACK);
    }
  };

  return (
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-sm border border-boutique-linen/90 bg-boutique-cream shadow-boutique transition-all duration-500 ease-out hover:-translate-y-4 hover:scale-[1.035] hover:border-boutique-gold/70 hover:shadow-[0_34px_80px_-20px_rgba(92,36,48,0.34)]">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_18%,rgba(232,213,163,0.36),transparent_34%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 z-0 ring-0 ring-boutique-gold/0 transition-all duration-500 group-hover:ring-2 group-hover:ring-boutique-gold/35" />

      <div className="relative z-10 h-64 overflow-hidden border-b border-boutique-gold/15 bg-gradient-to-b from-[#f7f0e3] via-[#efe7da] to-boutique-linen transition-colors duration-500 group-hover:from-[#fbf0d8] group-hover:to-[#e7dcc8]">
        <div className="pointer-events-none absolute inset-x-10 top-8 h-px bg-gradient-to-l from-transparent via-boutique-gold/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <img
          key={`${product.id}-${imgSrc}`}
          src={imgSrc}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
          decoding="async"
          onError={handleError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-boutique-charcoal/55 via-boutique-charcoal/5 to-transparent" />

        <span
          className={`absolute top-3 right-3 z-10 rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-luxury backdrop-blur-sm ${pillClass}`}
        >
          {product.category}
        </span>

        {product.limited && (
          <span className="absolute top-3 left-3 z-10 border border-boutique-gold/60 bg-boutique-charcoal/85 px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-luxury text-boutique-gold-light backdrop-blur-sm">
            מהדורה מוגבלת
          </span>
        )}
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-5 transition-colors duration-500 md:p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="font-serif text-lg font-semibold leading-snug text-boutique-ink md:text-xl">
            {product.name}
          </h3>
          <span className="shrink-0 font-serif text-xl font-bold text-boutique-burgundy md:text-2xl">
            ₪{product.price}
          </span>
        </div>

        <p className="mb-5 flex items-center gap-1.5 font-sans text-xs text-boutique-muted">
          <Grape size={12} strokeWidth={1.5} className="text-boutique-gold-muted" />
          מלאי זמין:{' '}
          <span className={lowStock ? 'font-semibold text-boutique-burgundy' : ''}>
            {product.stock} בקבוקים
          </span>
        </p>

        <div className="mt-auto border-t border-boutique-linen pt-4">
          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            className="group/btn flex w-full items-center justify-center gap-2 bg-boutique-burgundy px-6 py-2.5 font-sans text-sm font-medium text-boutique-cream shadow-none transition-all duration-300 hover:bg-boutique-burgundy-dark group-hover:shadow-[0_12px_24px_-12px_rgba(92,36,48,0.8)]"
          >
            <Plus
              size={16}
              className="transition-transform duration-300 group-hover/btn:rotate-90"
            />
            הוסף לעגלה
          </button>
        </div>
      </div>
    </article>
  );
}
