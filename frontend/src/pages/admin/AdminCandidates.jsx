import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  UserCheck,
  Plus,
  Edit2,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Vote,
  Image as ImageIcon
} from 'lucide-react';

const AdminCandidates = () => {
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    organization: '',
    description: '',
    election_id: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    if (selectedElectionId) {
      fetchCandidates(selectedElectionId);
    }
  }, [selectedElectionId]);

  const fetchElections = async () => {
    try {
      const res = await api.get('/elections');
      if (res.data.success && res.data.elections.length > 0) {
        setElections(res.data.elections);
        setSelectedElectionId(res.data.elections[0].id.toString());
      }
    } catch (err) {
      setError('Failed to fetch elections.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async (electionId) => {
    setLoading(true);
    try {
      const res = await api.get(`/elections/${electionId}/candidates`);
      if (res.data.success) {
        setCandidates(res.data.candidates);
      }
    } catch (err) {
      setError('Failed to fetch candidates.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingCandidate(null);
    setFormData({
      name: '',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      organization: '',
      description: '',
      election_id: selectedElectionId
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (candidate) => {
    setEditingCandidate(candidate);
    setFormData({
      name: candidate.name,
      photo: candidate.photo || '',
      organization: candidate.organization,
      description: candidate.description || '',
      election_id: candidate.election_id.toString()
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (editingCandidate) {
        const res = await api.put(`/candidates/${editingCandidate.id}`, formData);
        if (res.data.success) {
          setModalOpen(false);
          fetchCandidates(selectedElectionId);
        }
      } else {
        const res = await api.post('/candidates', formData);
        if (res.data.success) {
          setModalOpen(false);
          fetchCandidates(selectedElectionId);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save candidate.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (candidateId, name) => {
    if (!window.confirm(`Are you sure you want to delete candidate "${name}"?`)) return;
    try {
      const res = await api.delete(`/candidates/${candidateId}`);
      if (res.data.success) {
        fetchCandidates(selectedElectionId);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete candidate.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Candidate Register</h1>
          <p className="text-xs text-slate-500">Manage candidate profiles, organization assignments, and election pairings</p>
        </div>

        <button
          onClick={handleOpenAdd}
          disabled={!selectedElectionId}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Add Candidate
        </button>
      </div>

      {/* Election Selector Dropdown */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 text-xs">
        <span className="font-semibold text-slate-700 shrink-0">Select Target Election:</span>
        <select
          value={selectedElectionId}
          onChange={(e) => setSelectedElectionId(e.target.value)}
          className="w-full sm:w-96 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold text-slate-900"
        >
          {elections.map(e => (
            <option key={e.id} value={e.id}>
              {e.title} ({e.status.toUpperCase()})
            </option>
          ))}
        </select>
      </div>

      {/* Candidates Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-xs">Loading candidates...</span>
        </div>
      ) : candidates.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
          <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="font-semibold text-xs text-slate-700">No candidates assigned to this election yet</p>
          <p className="text-[11px] text-slate-500 mt-1">Click "Add Candidate" above to register contenders.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={candidate.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'}
                    alt={candidate.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{candidate.name}</h3>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {candidate.organization}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-6 line-clamp-3">
                  {candidate.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(candidate)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(candidate.id, candidate.name)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Candidate Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingCandidate ? 'Edit Candidate Profile' : 'Add Candidate to Election'}
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
                <label className="block text-slate-700 font-semibold mb-1">Target Election *</label>
                <select
                  value={formData.election_id}
                  onChange={(e) => setFormData({ ...formData, election_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                >
                  {elections.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Candidate Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Elena Rostova"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Party / Organization *</label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="e.g. Progressive Student Alliance"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Candidate Photo URL</label>
                <input
                  type="text"
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Manifesto / Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Campaign pledges and qualification summary..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                />
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
                  {submitting ? 'Saving...' : editingCandidate ? 'Update Candidate' : 'Add Candidate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCandidates;
