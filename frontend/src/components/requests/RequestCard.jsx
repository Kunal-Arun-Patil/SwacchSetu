import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Package, Phone, FileText } from 'lucide-react';
import StatusBadge from './StatusBadge';
import StatusStepper from './StatusStepper';
import { CATEGORIES } from '../../constants/categories';

export default function RequestCard({ request }) {
  const [expanded, setExpanded] = useState(false);
  const cat = CATEGORIES.find((c) => c.id === request.wasteCategory);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-200">
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{cat?.emoji}</span>
              <span className="font-semibold text-gray-900">{request.wasteCategory}</span>
            </div>
            <p className="text-xs text-gray-500 font-mono">{request.requestId}</p>
          </div>
          <StatusBadge status={request.status} />
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-gray-400 shrink-0" />
            <span className="truncate">{request.address}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Package size={13} className="text-gray-400 shrink-0" />
            <span>{request.quantity}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={13} className="text-gray-400 shrink-0" />
            <span>{request.preferredDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-gray-400 shrink-0" />
            <span>{request.preferredTime}</span>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="px-5 pb-3 border-t border-gray-50 pt-3">
        <StatusStepper status={request.status} />
      </div>

      {/* Expand toggle */}
      <div className="px-5 pb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
        >
          {expanded ? 'Show less ▲' : 'Show details ▼'}
        </button>

        {expanded && (
          <div className="mt-3 space-y-2 text-sm text-gray-600 border-t border-gray-50 pt-3">
            <div className="flex items-center gap-1.5">
              <Phone size={13} className="text-gray-400" />
              <span>{request.phone}</span>
            </div>
            {request.notes && (
              <div className="flex items-start gap-1.5">
                <FileText size={13} className="text-gray-400 mt-0.5" />
                <span>{request.notes}</span>
              </div>
            )}
            {request.collectorNotes && (
              <div className="bg-emerald-50 rounded-xl p-3">
                <p className="text-xs font-medium text-emerald-700 mb-1">Collector Note:</p>
                <p className="text-xs text-emerald-800">{request.collectorNotes}</p>
              </div>
            )}
            <p className="text-xs text-gray-400">
              Submitted: {new Date(request.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
