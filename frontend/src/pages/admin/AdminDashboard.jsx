import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import {
  Users,
  Vote,
  UserCheck,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  TrendingUp,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setStatsData(res.data);
      }
    } catch (err) {
      setError('Failed to load admin dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
        <span className="text-xs font-medium">Loading election telemetry & statistics...</span>
      </div>
    );
  }

  const { stats, charts, recentLogs } = statsData;

  const votesChartData = charts?.votesPerElection?.map(item => ({
    name: item.title.length > 18 ? item.title.substring(0, 18) + '...' : item.title,
    votes: item.total_votes
  })) || [];

  return (
    <div className="space-y-8">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Administrative Overview</h1>
        <p className="text-xs text-slate-500">Live platform metrics, vote counts, and real-time activity tracking</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Top 6 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block">Total Voters</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{stats.totalVoters}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block">Verified Voters</span>
          <span className="text-2xl font-bold text-emerald-600 mt-1 block">{stats.verifiedVoters}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block">Total Elections</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{stats.totalElections}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block">Active Contests</span>
          <span className="text-2xl font-bold text-blue-600 mt-1 block">{stats.activeElections}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block">Total Candidates</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{stats.totalCandidates}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block">Total Votes Cast</span>
          <span className="text-2xl font-bold text-indigo-600 mt-1 block">{stats.totalVotes}</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Votes per Election Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" /> Votes Cast Per Election
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={votesChartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '10px', fontSize: '12px' }}
                />
                <Bar dataKey="votes" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Audit Activity Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" /> Recent System Logs
              </h3>
              <Link to="/admin/logs" className="text-xs font-semibold text-blue-600 hover:underline">
                View All Logs →
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentLogs?.slice(0, 5).map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{log.action}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">{log.description}</div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
