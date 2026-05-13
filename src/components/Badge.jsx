import React from 'react';

export default function Badge({ status }) {
  // Map server status names to Hebrew labels and styles
  const statusMap = {
    'pending': { label: 'ממתין לאישור', style: 'bg-amber-100 text-amber-700' },
    'approved': { label: 'אושר', style: 'bg-blue-100 text-blue-700' },
    'delivered': { label: 'נשלח', style: 'bg-green-100 text-green-700' },
    'completed': { label: 'הושלם', style: 'bg-emerald-100 text-emerald-700' },
    // Fallback for any other statuses
    'cancelled': { label: 'בוטל', style: 'bg-red-100 text-red-700' },
  };

  const statusInfo = statusMap[status] || { label: status, style: 'bg-slate-100' };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusInfo.style}`}>
      {statusInfo.label}
    </span>
  );
}
