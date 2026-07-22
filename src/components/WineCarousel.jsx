import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { CAROUSEL_SLIDES } from '../data/wineImages';

const MOTION = 'transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]';
const SLIDE_DURATION = 4000;

// Ken Burns effect movements for background images
const KEN_BURNS_MOVES = [
  {
    start: 'scale-106 translate-x-3 translate-y-0 rotate-[0.15deg]',
    end: 'scale-101 -translate-x-3 translate-y-1 rotate-[-0.08deg]',
  },
  {
    start: 'scale-105 -translate-x-3 translate-y-0 rotate-[-0.15deg]',
    end: 'scale-101 translate-x-3 translate-y-1 rotate-[0.08deg]',
  },
  {
    start: 'scale-106 translate-x-0 translate-y-0 rotate-[0.12deg]',
    end: 'scale-101 translate-x-2 translate-y-1 rotate-[-0.08deg]',
  },
  {
    start: 'scale-105 translate-x-3 translate-y-0 rotate-[0.12deg]',
    end: 'scale-101 -translate-x-3 translate-y-1 rotate-[-0.08deg]',
  },
  {
    start: 'scale-106 -translate-x-3 translate-y-0 rotate-[-0.12deg]',
    end: 'scale-101 translate-x-3 translate-y-1 rotate-[0.08deg]',
  },
];

function CinematicBackground({ slide, index, isVisible }) {
  const [moving, setMoving] = useState(false);
  const move = KEN_BURNS_MOVES[index % KEN_BURNS_MOVES.length];

  useEffect(() => {
    setMoving(false);
    const timer = window.setTimeout(() => setMoving(true), 60);
    return () => clearTimeout(timer);
  }, [slide.id]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <img
        src={slide.img}
        alt=""
        aria-hidden
        className={`absolute -inset-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)] origin-center object-cover object-center opacity-30 blur-lg transition-transform duration-[3000ms] ease-out ${
          moving ? move.end : move.start
        }`}
      />
      <img
        src={slide.img}
        alt={slide.title}
        className={`absolute inset-0 h-full w-full origin-center object-cover object-center transition-transform duration-[3000ms] ease-out ${
          moving ? move.end : move.start
        }`}
      />
    </div>
  );
}

function HeroText({ slide, slideKey, onAddToCart }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const timer = window.setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, [slideKey]);

  const fromRight = visible
    ? 'translate-x-0 opacity-100'
    : 'translate-x-16 opacity-0';
  const fromLeft = visible
    ? 'translate-x-0 opacity-100'
    : '-translate-x-16 opacity-0';
  const fromUp = visible
    ? 'translate-y-0 opacity-100'
    : 'translate-y-8 opacity-0';

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-start justify-center p-8 text-right text-white md:p-20">
      <div
        className={`mb-6 flex items-center gap-3 text-boutique-gold-light ${MOTION} delay-100 ${fromRight}`}
      >
        <span className="h-px w-12 bg-gradient-to-l from-boutique-gold to-transparent" />
        <Sparkles size={14} strokeWidth={1.5} />
        <span className="font-sans text-[10px] font-medium uppercase tracking-luxury">
          {slide.eyebrow}
        </span>
      </div>

      {slide.subTitle && (
        <p
          className={`mb-2 font-serif text-xl italic text-boutique-gold-light md:text-2xl ${MOTION} delay-200 ${fromRight}`}
        >
          {slide.subTitle}
        </p>
      )}

      <h2
        className={`max-w-2xl font-serif text-4xl font-bold leading-tight md:text-6xl ${MOTION} delay-300 ${fromRight}`}
      >
        {slide.title}
      </h2>

      <p
        className={`mt-4 max-w-xl font-sans text-lg font-light text-gray-200 md:text-2xl line-clamp-3 ${MOTION} delay-[450ms] ${fromLeft}`}
      >
        {slide.description}
      </p>

      <button
        type="button"
        onClick={() => {
          if (slide.product && onAddToCart) {
            onAddToCart(slide.product);
          }
        }}
        className={`pointer-events-auto group relative mt-8 overflow-hidden border border-boutique-gold/80 px-8 py-3 font-sans text-sm font-medium uppercase tracking-luxury text-boutique-gold-light hover:text-boutique-charcoal ${MOTION} delay-500 ${fromUp}`}
      >
        <span className="relative z-10">לרכישה מיידית</span>
        <span className="absolute inset-0 z-0 translate-y-full bg-gradient-to-r from-boutique-gold to-boutique-gold-light transition-transform duration-500 group-hover:translate-y-0" />
      </button>
    </div>
  );
}

export default function WineCarousel({ dynamicSlides = [], isAuthenticated = false, onAddToCart }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(null);

  // Map the dynamic API products to the carousel structure, using the gorgeous background images
  const slides = dynamicSlides.length > 0 
    ? dynamicSlides.map((p, i) => ({
        id: p.id,
        product: p,
        eyebrow: isAuthenticated ? 'מומלץ במיוחד עבורך' : 'נבחר בקפידה',
        title: p.name,
        subTitle: p.price_after_discount && p.price_after_discount < p.price 
                  ? `₪${parseFloat(p.price_after_discount).toFixed(2)} (במבצע)` 
                  : `₪${parseFloat(p.price).toFixed(2)}`,
        description: p.description || 'יין בוטיק איכותי ומובחר.',
        img: CAROUSEL_SLIDES[i % CAROUSEL_SLIDES.length].img
      }))
    : CAROUSEL_SLIDES;

  const activeSlide = slides[activeIndex];

  const goToSlide = (index) => {
    const nextIndex = (index + slides.length) % slides.length;
    if (nextIndex === activeIndex) return;
    setPreviousIndex(activeIndex);
    setActiveIndex(nextIndex);
  };

  // Auto-advance slides
  useEffect(() => {
    const previousTimer = window.setTimeout(() => setPreviousIndex(null), 750);
    const slideTimer = window.setTimeout(() => {
      goToSlide(activeIndex + 1);
    }, SLIDE_DURATION);

    return () => {
      clearTimeout(previousTimer);
      clearTimeout(slideTimer);
    };
  }, [activeIndex, slides.length]);

  return (
    <section className="relative h-[clamp(520px,72vh,720px)] w-full overflow-hidden shadow-boutique-lg">
      <div
        className="pointer-events-none absolute inset-4 z-20 border border-boutique-gold/45 animate-gold-frame-glow md:inset-6"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-2 bg-gradient-to-l from-transparent via-boutique-gold to-transparent shadow-[0_0_18px_rgba(201,169,98,0.45)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-2 bg-gradient-to-l from-transparent via-boutique-gold to-transparent shadow-[0_0_18px_rgba(201,169,98,0.45)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 z-20 h-6 w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-boutique-gold-light/35 to-transparent blur-lg"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 z-20 h-6 w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-boutique-gold-light/35 to-transparent blur-lg"
        aria-hidden
      />

      <div className="absolute inset-0 z-0 overflow-hidden">
        {previousIndex !== null && slides[previousIndex] && (
          <CinematicBackground
            key={`previous-${slides[previousIndex].id}`}
            slide={slides[previousIndex]}
            index={previousIndex}
            isVisible={false}
          />
        )}
        {activeSlide && (
          <CinematicBackground
            key={`active-${activeSlide.id}`}
            slide={activeSlide}
            index={activeIndex}
            isVisible
          />
        )}
        <div className="absolute inset-0 animate-hero-glow-pulse bg-[radial-gradient(circle_at_22%_34%,rgba(232,213,163,0.55),transparent_30%),radial-gradient(circle_at_72%_62%,rgba(92,36,48,0.45),transparent_36%)] mix-blend-screen" />
        <div className="absolute -inset-y-24 left-1/2 h-[140%] w-32 animate-hero-light-sweep bg-gradient-to-r from-transparent via-boutique-gold-light/40 to-transparent blur-xl mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/30 to-transparent" />
      </div>

      {activeSlide && (
        <HeroText key={activeIndex} slide={activeSlide} slideKey={activeIndex} onAddToCart={onAddToCart} />
      )}

      {/* Navigation Buttons */}
      <button
        type="button"
        aria-label="שקף הבא"
        onClick={() => goToSlide(activeIndex + 1)}
        className="absolute left-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-boutique-gold/45 bg-boutique-charcoal/35 text-boutique-gold-light backdrop-blur-sm transition-all hover:border-boutique-gold hover:bg-boutique-gold/20 md:left-6"
      >
        <ChevronLeft size={20} strokeWidth={2} />
      </button>

      <button
        type="button"
        aria-label="שקף קודם"
        onClick={() => goToSlide(activeIndex - 1)}
        className="absolute right-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-boutique-gold/45 bg-boutique-charcoal/35 text-boutique-gold-light backdrop-blur-sm transition-all hover:border-boutique-gold hover:bg-boutique-gold/20 md:right-6"
      >
        <ChevronRight size={20} strokeWidth={2} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`מעבר לשקף ${index + 1}`}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'w-7 bg-boutique-gold-light'
                : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
}