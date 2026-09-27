import React from 'react';

export default function Select({ label, error, options = [], className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        className={`
          w-full px-3 py-2.5 rounded-xl border bg-white
          text-sm text-gray-900
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
          ${error ? 'border-red-400' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
