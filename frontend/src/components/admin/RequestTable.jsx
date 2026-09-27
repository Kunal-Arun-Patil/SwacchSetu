import React, { useState } from 'react';
import { ChevronDown, Eye } from 'lucide-react';
import StatusBadge from '../requests/StatusBadge';
import Modal from '../ui/Modal';
import StatusStepper from '../requests/StatusStepper';
import { CATEGORIES, STATUSES } from '../../constants/categories';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { SkeletonRow } from '../ui/Skeleton';

export default function RequestTable({ requests, loading, onStatusUpdate }) {
  const { addToast } = useToast();
  const [viewRequest, setViewRequest] = useState(null);
  const [updating, setUpdating] = useState(null); // id being updated

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    try {
      await api.patch(`/requests/${id}/status`, { status: newStatus });
      addToast(`Status updated to "${newStatus}"`, 'success');
      onStatusUpdate();
    } catch (err) {
      addToast('Failed to update status', 'error');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 sticky top-0">
                {['Request ID', 'Resident', 'Category', 'Address', 'Date & Time', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <p className="text-4xl mb-2">📭</p>
                    <p className="text-gray-500 font-medium">No requests found</p>
                    <p className="text-gray-400 text-xs mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const cat = CATEGORIES.find((c) => c.id === req.wasteCategory);
                  return (
                    <tr key={req._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-lg">{req.requestId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{req.userName}</p>
                        <p className="text-xs text-gray-400">{req.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cat?.badgeClass}`}>
                          {cat?.emoji} {req.wasteCategory}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-[160px]">
                        <p className="text-xs text-gray-600 truncate" title={req.address}>{req.address}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-xs text-gray-700">{req.preferredDate}</p>
                        <p className="text-xs text-gray-400">{req.preferredTime}</p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={req.status} size="sm" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* Status dropdown */}
                          <div className="relative">
                            <select
                              value={req.status}
                              onChange={(e) => handleStatusChange(req._id, e.target.value)}
                              disabled={updating === req._id}
                              className="pl-2 pr-6 py-1 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 cursor-pointer appearance-none"
                            >
                              {STATUSES.map((s) => (
                                <option key={s.id} value={s.id}>{s.label}</option>
                              ))}
                            </select>
                            <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          </div>
                          {/* View details */}
                          <button
                            onClick={() => setViewRequest(req)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                            title="View details"
                          >
                            <Eye size={14} className="text-gray-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        {!loading && requests.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">{requests.length} request{requests.length !== 1 ? 's' : ''} shown</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!viewRequest} onClose={() => setViewRequest(null)} title="Request Details" size="md">
        {viewRequest && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-lg">{viewRequest.requestId}</span>
              <StatusBadge status={viewRequest.status} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-gray-400 text-xs">Resident</p><p className="font-medium">{viewRequest.userName}</p></div>
              <div><p className="text-gray-400 text-xs">Phone</p><p className="font-medium">{viewRequest.phone}</p></div>
              <div className="col-span-2"><p className="text-gray-400 text-xs">Address</p><p className="font-medium">{viewRequest.address}</p></div>
              <div><p className="text-gray-400 text-xs">Category</p><p className="font-medium">{viewRequest.wasteCategory}</p></div>
              <div><p className="text-gray-400 text-xs">Quantity</p><p className="font-medium">{viewRequest.quantity}</p></div>
              <div><p className="text-gray-400 text-xs">Date</p><p className="font-medium">{viewRequest.preferredDate}</p></div>
              <div><p className="text-gray-400 text-xs">Time</p><p className="font-medium">{viewRequest.preferredTime}</p></div>
              {viewRequest.notes && <div className="col-span-2"><p className="text-gray-400 text-xs">Notes</p><p className="font-medium">{viewRequest.notes}</p></div>}
            </div>
            <div className="pt-2">
              <p className="text-xs text-gray-400 mb-2">Progress</p>
              <StatusStepper status={viewRequest.status} />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
