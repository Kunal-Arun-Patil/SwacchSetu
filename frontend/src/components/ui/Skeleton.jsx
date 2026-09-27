import React from 'react';

export function SkeletonLine({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
      <div className="flex items-start justify-between mb-4">
        <SkeletonLine className="h-5 w-32" />
        <SkeletonLine className="h-6 w-20 rounded-full" />
      </div>
      <SkeletonLine className="h-4 w-full mb-2" />
      <SkeletonLine className="h-4 w-3/4 mb-4" />
      <SkeletonLine className="h-3 w-1/2" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <tr>
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <SkeletonLine className="h-4" />
        </td>
      ))}
    </tr>
  );
}
