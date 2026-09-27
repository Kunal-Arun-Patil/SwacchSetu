import React from 'react';
import { STATUSES } from '../../constants/categories';

export default function StatusBadge({ status, size = 'md' }) {
  const s = STATUSES.find((st) => st.id === status) || STATUSES[0];
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${textSize} ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
