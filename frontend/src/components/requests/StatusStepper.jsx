import React from 'react';
import { Check } from 'lucide-react';

const STEPS = ['Pending', 'Scheduled', 'In Progress', 'Collected'];

export default function StatusStepper({ status }) {
  // Cancelled gets its own display
  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-2 py-2">
        <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-red-600 text-xs font-bold">✕</span>
        </span>
        <span className="text-sm text-red-600 font-medium">Request Cancelled</span>
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-0 w-full overflow-x-auto scrollbar-hide py-2">
      {STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;
        const isUpcoming = i > currentIndex;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center min-w-[60px]">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isActive
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isDone ? <Check size={13} /> : i + 1}
              </div>
              <span
                className={`mt-1 text-[10px] font-medium text-center leading-tight ${
                  isDone || isActive ? 'text-emerald-700' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 rounded transition-all ${
                  i < currentIndex ? 'bg-emerald-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
