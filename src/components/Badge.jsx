import React from 'react';

export default function Badge({ status }) {
  const styles = {
    'בטיפול': 'bg-amber-100 text-amber-700',
    'נשלח': 'bg-blue-100 text-blue-700',
    'הושלם': 'bg-emerald-100 text-emerald-700',
    'בוטל': 'bg-red-100 text-red-700'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || 'bg-slate-100'}`}>
      {status}
    </span>
  );
}
