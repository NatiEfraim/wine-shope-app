import React from 'react';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
}) {
  const baseStyle =
    'px-4 py-2 rounded-sm font-medium transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60';
  const variants = {
    primary:
      'bg-boutique-burgundy text-boutique-cream hover:bg-boutique-burgundy-dark shadow-boutique',
    secondary:
      'bg-boutique-parchment text-boutique-ink hover:bg-boutique-linen',
    outline:
      'border border-boutique-burgundy/40 text-boutique-burgundy hover:bg-boutique-burgundy hover:text-boutique-cream',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100',
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
