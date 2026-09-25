import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  FileText,
  Search,
  Filter,
  Loader2,
  ShieldCheck,
  User,
  Globe
} from 'lucide-react';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [search, actionFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (actionFilter) params.action = actionFilter;

      const res = await api.get('/admin/logs', { params });
      if (res.data.success) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      setError('Failed to fetch activity logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Activity & Security Audit Logs</h1>
          <p className="text-xs text-slate-500">Immutable audit log records for administrative events, ballot transactions, and user logins</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search log details or user name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="w-full sm:w-auto text-xs">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
          >
            <option value="">All Action Types</option>
            <option value="VOTE_CAST">VOTE_CAST</option>
            <option value="ELECTION_CREATE">ELECTION_CREATE</option>
            <option value="ELECTION_UPDATE">ELECTION_UPDATE</option>
            <option value="CANDIDATE_ADD">CANDIDATE_ADD</option>
            <option value="USER_REGISTER">USER_REGISTER</option>
            <option value="USER_LOGIN">USER_LOGIN</option>
            <option value="VOTER_VERIFY">VOTER_VERIFY</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-500 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-xs">Fetching system audit logs...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="font-semibold text-xs text-slate-700">No activity logs recorded matching criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Action Code</th>
                  <th className="px-6 py-3.5">Description</th>
                  <th className="px-6 py-3.5">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {log.user_name ? (
                        <div>
                          <span>{log.user_name}</span>
                          <span className="text-[10px] text-slate-400 block font-normal">Role: {log.user_role}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">System / Anonymous</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-blue-400 font-mono font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-800 leading-snug">
                      {log.description}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500 text-[11px]">
                      {log.ip_address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogs;
