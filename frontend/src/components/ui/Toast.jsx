import React from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const icons = {
  success: <CheckCircle size={18} className="text-emerald-600" />,
  error: <XCircle size={18} className="text-red-600" />,
  warning: <AlertCircle size={18} className="text-amber-600" />,
};

const colors = {
  success: 'border-emerald-200 bg-emerald-50',
  error: 'border-red-200 bg-red-50',
  warning: 'border-amber-200 bg-amber-50',
};

export default function Toast() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg transition-all duration-300 ${colors[toast.type] || colors.success}`}
        >
          {icons[toast.type] || icons.success}
          <p className="flex-1 text-sm font-medium text-gray-900">{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} className="mt-0.5 hover:opacity-70">
            <X size={14} className="text-gray-500" />
          </button>
        </div>
      ))}
    </div>
  );
}
