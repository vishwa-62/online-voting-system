import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Trash2,
  Eye,
  Loader2,
  Filter,
  AlertCircle
} from 'lucide-react';

const AdminVoters = () => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [detailModal, setDetailModal] = useState(false);

  useEffect(() => {
    fetchVoters();
  }, [search, verificationFilter, statusFilter]);

  const fetchVoters = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (verificationFilter) params.verification = verificationFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await api.get('/admin/voters', { params });
      if (res.data.success) {
        setVoters(res.data.voters);
      }
    } catch (err) {
      setError('Failed to fetch voters list.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (voterId, status) => {
    try {
      const res = await api.put(`/admin/voters/${voterId}/verify`, { status });
      if (res.data.success) {
        fetchVoters();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update verification status.');
    }
  };

  const handleStatusChange = async (voterId, status) => {
    try {
      const res = await api.put(`/admin/voters/${voterId}/status`, { status });
      if (res.data.success) {
        fetchVoters();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update account status.');
    }
  };

  const handleDelete = async (voterId) => {
    if (!window.confirm('Are you sure you want to delete this voter account?')) return;
    try {
      const res = await api.delete(`/admin/voters/${voterId}`);
      if (res.data.success) {
        fetchVoters();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete voter.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Voter Management Registry</h1>
          <p className="text-xs text-slate-500">Verify registrations, manage account statuses, and review identity records</p>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Name, Email, or Voter ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto text-xs">
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
          >
            <option value="">All Verification Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
          >
            <option value="">All Account Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Voters Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-500 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-xs">Loading voter records...</span>
          </div>
        ) : voters.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="font-semibold text-xs text-slate-700">No voters found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Voter Name</th>
                  <th className="px-6 py-3.5">Voter ID</th>
                  <th className="px-6 py-3.5">Email / Mobile</th>
                  <th className="px-6 py-3.5">Reg. Date</th>
                  <th className="px-6 py-3.5">Verification</th>
                  <th className="px-6 py-3.5">Account Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {voters.map((voter) => (
                  <tr key={voter.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {voter.full_name}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">
                      {voter.voter_id}
                    </td>
                    <td className="px-6 py-4">
                      <div>{voter.email}</div>
                      <div className="text-[11px] text-slate-400">{voter.mobile}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(voter.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        voter.verification_status === 'verified'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : voter.verification_status === 'rejected'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {voter.verification_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        voter.account_status === 'active'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}>
                        {voter.account_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5">
                      
                      {/* Verify / Reject buttons */}
                      {voter.verification_status !== 'verified' && (
                        <button
                          onClick={() => handleVerify(voter.id, 'verified')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold transition-colors"
                          title="Approve & Verify Voter"
                        >
                          Verify
                        </button>
                      )}

                      {voter.verification_status === 'pending' && (
                        <button
                          onClick={() => handleVerify(voter.id, 'rejected')}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[11px] font-semibold transition-colors"
                          title="Reject Registration"
                        >
                          Reject
                        </button>
                      )}

                      {/* Suspend / Activate */}
                      <button
                        onClick={() => handleStatusChange(voter.id, voter.account_status === 'active' ? 'suspended' : 'active')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                          voter.account_status === 'active'
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-300'
                        }`}
                      >
                        {voter.account_status === 'active' ? 'Suspend' : 'Activate'}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedVoter(voter);
                          setDetailModal(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(voter.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Delete Voter Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Voter Details Modal */}
      {detailModal && selectedVoter && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Voter Profile Record</h3>
            
            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-400">Full Name:</span>
                <span className="font-semibold text-slate-900">{selectedVoter.full_name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-400">Voter ID:</span>
                <span className="font-mono font-bold text-blue-600">{selectedVoter.voter_id}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-400">Email:</span>
                <span>{selectedVoter.email}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-400">Mobile:</span>
                <span>{selectedVoter.mobile}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-400">Date of Birth:</span>
                <span>{new Date(selectedVoter.date_of_birth).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-400">Verification Status:</span>
                <span className="font-semibold capitalize">{selectedVoter.verification_status}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setDetailModal(false)}
                className="px-5 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVoters;
