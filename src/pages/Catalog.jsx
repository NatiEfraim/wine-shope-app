import React from 'react';
import { WineProductCard } from '../components/Card';
import WineCarousel from '../components/WineCarousel';
import { useCartStore } from '../store/useCartStore';
import { CATALOG_PRODUCTS } from '../data/wineImages';

export default function Catalog() {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <section className="animate-in fade-in duration-700">
      <div className="relative left-1/2 right-1/2 -mx-[50vw] -mt-12 mb-12 w-screen">
        <WineCarousel />
      </div>

      <header className="mb-12 text-right">
        <p className="mb-2 font-sans text-[10px] font-medium uppercase tracking-luxury text-boutique-gold-muted">
          הקולקציה שלנו
        </p>
        <h2 className="font-serif text-4xl font-bold text-boutique-ink md:text-5xl">
          יינות מובחרים
        </h2>
      </header>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CATALOG_PRODUCTS.map((product) => (
          <WineProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </section>
  );
}
