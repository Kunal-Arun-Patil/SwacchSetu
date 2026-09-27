import React from 'react';
import { Search, X } from 'lucide-react';
import { CATEGORIES, STATUSES } from '../../constants/categories';

export default function FilterBar({ filters, onChange, onClear }) {
  const setFilter = (key, value) => onChange({ ...filters, [key]: value });
  const hasFilters = filters.search || filters.status || filters.category || filters.startDate || filters.endDate;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 space-y-3">
      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, address, phone, or ID..."
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Status chips */}
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s.id}
              onClick={() => setFilter('status', filters.status === s.id ? '' : s.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                filters.status === s.id ? s.color + ' border-transparent' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter('category', filters.category === c.id ? '' : c.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                filters.category === c.id ? c.badgeClass + ' border-transparent' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilter('startDate', e.target.value)}
            className="px-2 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <span className="text-gray-400 text-xs">to</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilter('endDate', e.target.value)}
            className="px-2 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors"
          >
            <X size={11} /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
