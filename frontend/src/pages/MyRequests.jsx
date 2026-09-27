import React, { useState, useEffect } from 'react';
import { Search, ClipboardList } from 'lucide-react';
import api from '../services/api';
import RequestCard from '../components/requests/RequestCard';
import { SkeletonCard } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function MyRequests() {
  const { user } = useAuth();
  const [phone, setPhone] = useState(user?.phone || '');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  // Auto-search if user has a phone
  useEffect(() => {
    if (user?.phone) fetchRequests(user.phone);
  }, [user]);

  const fetchRequests = async (ph) => {
    const trimmed = (ph || phone).trim();
    if (!trimmed) { setError('Enter your phone number'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/requests', { params: { phone: trimmed } });
      setRequests(res.data);
      setSearched(true);
    } catch {
      setError('Failed to fetch requests. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900  mb-1">My Pickup Requests</h1>
        <p className="text-gray-500  text-sm">Track the status of your waste collection requests</p>
      </div>

      {/* Phone lookup */}
      {!user?.phone && (
        <div className="bg-white   rounded-2xl border border-gray-100 shadow-card p-5 mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Enter your registered phone number</p>
          <div className="flex gap-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && fetchRequests()}
              placeholder="10-digit phone number"
              className="flex-1 px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Button onClick={() => fetchRequests()} loading={loading}>
              <Search size={16} /> Find
            </Button>
          </div>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : searched || user?.phone ? (
        requests.length === 0 ? (
          <div className="text-center py-16">
            <ClipboardList size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No requests found</h3>
            <p className="text-gray-400 text-sm">No pickup requests are linked to this number.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 ">{requests.length} request{requests.length !== 1 ? 's' : ''} found</p>
            {requests.map((req) => <RequestCard key={req._id} request={req} />)}
          </div>
        )
      ) : null}
    </div>
  );
}
