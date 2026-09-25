import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Vote,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  BarChart2,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ELECTION_TYPES = [
  'College Election',
  'Student Council Election',
  'Organization Election',
  'Club Election',
  'Mock Election'
];

const AdminElections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingElection, setEditingElection] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    election_type: 'Student Council Election',
    start_date: '',
    end_date: '',
    status: 'upcoming',
    results_published: false
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    setLoading(true);
    try {
      const res = await api.get('/elections');
      if (res.data.success) {
        setElections(res.data.elections);
      }
    } catch (err) {
      setError('Failed to fetch elections.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingElection(null);
    setFormData({
      title: '',
      description: '',
      election_type: 'Student Council Election',
      start_date: new Date().toISOString().slice(0, 16),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      status: 'upcoming',
      results_published: false
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (election) => {
    setEditingElection(election);
    setFormData({
      title: election.title,
      description: election.description || '',
      election_type: election.election_type || 'Student Council Election',
      start_date: new Date(election.start_date).toISOString().slice(0, 16),
      end_date: new Date(election.end_date).toISOString().slice(0, 16),
      status: election.status,
      results_published: !!election.results_published
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingElection) {
        const res = await api.put(`/elections/${editingElection.id}`, formData);
        if (res.data.success) {
          setModalOpen(false);
          fetchElections();
        }
      } else {
        const res = await api.post('/elections', formData);
        if (res.data.success) {
          setModalOpen(false);
          fetchElections();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save election.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete election "${title}"? All votes will be removed.`)) return;
    try {
      const res = await api.delete(`/elections/${id}`);
      if (res.data.success) {
        fetchElections();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete election.');
    }
  };

  const handleToggleStatus = async (election, newStatus) => {
    try {
      await api.put(`/elections/${election.id}`, {
        ...election,
        status: newStatus
      });
      fetchElections();
    } catch (err) {
      alert('Failed to update election status.');
    }
  };

  const handleTogglePublish = async (election) => {
    try {
      await api.put(`/elections/${election.id}`, {
        ...election,
        results_published: !election.results_published
      });
      fetchElections();
    } catch (err) {
      alert('Failed to update publication status.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Election Management</h1>
          <p className="text-xs text-slate-500">Configure election parameters, status lifecycle, and candidate allocations</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Create New Election
        </button>
      </div>

      {/* Elections Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-500 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-xs">Loading election data...</span>
          </div>
        ) : elections.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Vote className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="font-semibold text-xs text-slate-700">No elections created yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Election Title</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Voting Period</th>
                  <th className="px-6 py-3.5">Candidates</th>
                  <th className="px-6 py-3.5">Total Votes</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Results</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {elections.map((election) => (
                  <tr key={election.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {election.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700 text-[11px]">
                        {election.election_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-500">
                      <div>Start: {new Date(election.start_date).toLocaleDateString()}</div>
                      <div>End: {new Date(election.end_date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {election.candidate_count || 0}
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-600">
                      {election.total_votes || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        election.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : election.status === 'completed'
                          ? 'bg-slate-100 text-slate-700 border-slate-300'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {election.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(election)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                          election.results_published
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {election.results_published ? 'Published' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5">
                      
                      {election.status !== 'active' && (
                        <button
                          onClick={() => handleToggleStatus(election, 'active')}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-semibold"
                          title="Activate Election"
                        >
                          Activate
                        </button>
                      )}

                      {election.status === 'active' && (
                        <button
                          onClick={() => handleToggleStatus(election, 'completed')}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-semibold"
                          title="Close Election"
                        >
                          Close
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenEdit(election)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                        title="Edit Election"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <Link
                        to={`/results/${election.id}`}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 inline-block"
                        title="View Results Report"
                      >
                        <BarChart2 className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleDelete(election.id, election.title)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Delete Election"
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

      {/* Create / Edit Election Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingElection ? 'Edit Election Settings' : 'Create New Election'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Election Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Student Council Presidential Election 2026"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Election Type *</label>
                <select
                  value={formData.election_type}
                  onChange={(e) => setFormData({ ...formData, election_type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  {ELECTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Official election description and voting guidelines..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">End Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.results_published}
                      onChange={(e) => setFormData({ ...formData, results_published: e.target.checked })}
                      className="rounded border-slate-300 text-blue-600"
                    />
                    <span>Publish Results to Public</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20"
                >
                  {submitting ? 'Saving...' : editingElection ? 'Save Changes' : 'Create Election'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminElections;
