import React, { useState, useEffect, useCallback } from 'react';
import { BarChart2, Table2, Archive, RefreshCw, ScanLine, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import StatsCards from '../components/admin/StatsCards';
import { CategoryBarChart, RequestsLineChart, StatusPieChart } from '../components/admin/Charts';
import FilterBar from '../components/admin/FilterBar';
import RequestTable from '../components/admin/RequestTable';
import { useToast } from '../context/ToastContext';

const TABS = [
  { id: 'overview', label: 'Overview', icon: <BarChart2 size={16} /> },
  { id: 'ai-analytics', label: 'AI Analytics', icon: <ScanLine size={16} /> },
  { id: 'requests', label: 'All Requests', icon: <Table2 size={16} /> },
  { id: 'history', label: 'History', icon: <Archive size={16} /> },
];

const EMPTY_FILTERS = { search: '', status: '', category: '', startDate: '', endDate: '' };

export default function AdminDashboard() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Stats state
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Requests state
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/stats');
      setStats(res.data);
    } catch {
      addToast('Failed to load stats', 'error');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchRequests = useCallback(async (f = filters, archived = false) => {
    setRequestsLoading(true);
    try {
      const params = { ...f };
      if (archived) params.status = 'Collected,Cancelled'; // history view
      // For history tab, we want Collected and Cancelled
      const res = await api.get('/requests', { params: archived ? { status: undefined, ...f } : params });
      // Client-side filter for history tab
      const data = archived
        ? res.data.filter((r) => ['Collected', 'Cancelled'].includes(r.status))
        : res.data;
      setRequests(data);
    } catch {
      addToast('Failed to load requests', 'error');
    } finally {
      setRequestsLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchStats(); }, []);

  useEffect(() => {
    if (activeTab === 'requests') fetchRequests(filters, false);
    if (activeTab === 'history') fetchRequests(filters, true);
  }, [activeTab, filters]);

  const handleFilterChange = (newFilters) => setFilters(newFilters);
  const handleClearFilters = () => setFilters(EMPTY_FILTERS);

  const handleStatusUpdate = () => {
    fetchStats();
    if (activeTab === 'requests') fetchRequests(filters, false);
    if (activeTab === 'history') fetchRequests(filters, true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 ">Admin Dashboard</h1>
          <p className="text-sm text-gray-500  mt-0.5">Manage and monitor all waste collection requests</p>
        </div>
        <button
          onClick={() => { fetchStats(); fetchRequests(filters, activeTab === 'history'); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white   text-gray-900  shadow-sm'
                : 'text-gray-500  hover:text-gray-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <StatsCards stats={stats} loading={statsLoading} />
          <div className="grid md:grid-cols-2 gap-6">
            <CategoryBarChart data={stats?.byCategory || []} />
            <StatusPieChart data={stats?.byStatus || []} />
          </div>
          <RequestsLineChart data={stats?.last14Days || []} />
        </div>
      )}

      {activeTab === 'ai-analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white   rounded-2xl border border-emerald-100 shadow-card p-6 col-span-1 flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <ScanLine size={32} />
              </div>
              <h3 className="text-gray-500  font-medium mb-1">Total AI Scans</h3>
              <p className="text-4xl font-bold text-gray-900 ">{stats?.aiStats?.totalScans || 0}</p>
            </div>
            <div className="bg-white   rounded-2xl border border-gray-100 shadow-card p-5 col-span-1 md:col-span-2">
              <h3 className="font-semibold text-gray-900  mb-4">AI Detections by Type</h3>
              {stats?.aiStats?.byCategory?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {stats.aiStats.byCategory.map(cat => (
                    <div key={cat.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      <span className="text-sm font-bold text-emerald-600">{cat.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500  text-sm">No AI scans recorded yet.</p>
              )}
            </div>
            
            {/* AI Accuracy / Feedback section */}
            <div className="bg-white   rounded-2xl border border-gray-100 shadow-card p-5 col-span-1 md:col-span-3 mt-2">
              <h3 className="font-semibold text-gray-900  mb-4 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-blue-500"/> AI Accuracy Feedback
              </h3>
              {stats?.aiStats?.corrections?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="text-xs text-gray-500  uppercase bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 font-medium">Original AI Prediction</th>
                        <th className="px-4 py-3 font-medium">User Correction</th>
                        <th className="px-4 py-3 font-medium text-right">Times Corrected</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.aiStats.corrections.map((c, idx) => (
                        <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                          <td className="px-4 py-3"><span className="line-through text-red-400 mr-2">{c.original}</span></td>
                          <td className="px-4 py-3 font-medium text-emerald-700">{c.corrected}</td>
                          <td className="px-4 py-3 text-right font-bold">{c.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-gray-500  mt-3 pt-3 border-t border-gray-100">
                    Total corrected items: {stats.aiStats.corrections.reduce((acc, curr) => acc + curr.count, 0)}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500  text-sm bg-gray-50 p-4 rounded-xl text-center border border-dashed border-gray-200">
                  No user corrections submitted yet. AI accuracy is tracking at 100%.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {(activeTab === 'requests' || activeTab === 'history') && (
        <div className="space-y-4">
          {activeTab === 'history' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
              <p className="text-sm text-amber-800">📋 Showing completed and cancelled requests archive</p>
            </div>
          )}
          <FilterBar filters={filters} onChange={handleFilterChange} onClear={handleClearFilters} />
          <RequestTable
            requests={requests}
            loading={requestsLoading}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
      )}
    </div>
  );
}
