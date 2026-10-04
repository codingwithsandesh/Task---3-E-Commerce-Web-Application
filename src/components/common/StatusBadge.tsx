import React from 'react';
import { OrderStatus } from '../../types/index.js';

interface StatusBadgeProps {
  status: OrderStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs font-semibold';

  let colorClasses = 'bg-zinc-100 text-zinc-700 border-zinc-200';

  switch (status) {
    case 'Pending':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/20';
      break;
    case 'Confirmed':
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/20';
      break;
    case 'Processing':
      colorClasses = 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-500/20';
      break;
    case 'Shipped':
      colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-500/20';
      break;
    case 'Delivered':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20';
      break;
    case 'Cancelled':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/20';
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${colorClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
};
