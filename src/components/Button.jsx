import React from 'react';

export default function Button({ children, onClick, variant = 'primary', className = "" }) {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-red-800 text-white hover:bg-red-900 shadow-md",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    outline: "border-2 border-red-800 text-red-800 hover:bg-red-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
