import React from 'react';
import { ClipboardList, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { SkeletonLine } from '../ui/Skeleton';

const cards = [
  { key: 'total', label: 'Total Requests', icon: <ClipboardList size={20} />, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
  { key: 'pending', label: 'Pending', icon: <Clock size={20} />, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
  { key: 'collectedToday', label: 'Collected Today', icon: <CheckCircle2 size={20} />, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
  { key: 'mostCommonCategory', label: 'Top Category', icon: <TrendingUp size={20} />, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100', isText: true },
];

export default function StatsCards({ stats, loading }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.key} className={`bg-white rounded-2xl border ${card.border} p-5 shadow-card`}>
          <div className={`inline-flex p-2.5 rounded-xl mb-3 ${card.color}`}>
            {card.icon}
          </div>
          {loading ? (
            <SkeletonLine className="h-8 w-16 mb-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">
              {card.isText ? stats?.[card.key] || '—' : (stats?.[card.key] ?? '—')}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
