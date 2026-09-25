import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Vote,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Lock,
  UserCheck
} from 'lucide-react';

const VotingPage = () => {
  const { electionId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const preselectedCandidateId = searchParams.get('candidateId');

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(
    preselectedCandidateId ? parseInt(preselectedCandidateId) : null
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [electionId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/elections/${electionId}`);
      if (res.data.success) {
        if (res.data.hasVoted) {
          // Already voted, redirect to dashboard or confirmation
          navigate('/voter/dashboard');
          return;
        }
        setElection(res.data.election);
        setCandidates(res.data.candidates);

        if (!preselectedCandidateId && res.data.candidates.length > 0) {
          setSelectedCandidateId(res.data.candidates[0].id);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load election data.');
    } finally {
      setLoading(false);
    }
  };

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);

  const handleOpenConfirm = () => {
    if (!selectedCandidateId) {
      setError('Please select a candidate before casting your vote.');
      return;
    }
    setError('');
    setShowConfirmModal(true);
  };

  const handleCastVote = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);
    setError('');

    try {
      const res = await api.post('/votes', {
        election_id: parseInt(electionId),
        candidate_id: selectedCandidateId
      });

      if (res.data.success) {
        // Navigate to confirmation page
        navigate(`/voter/confirmation/${res.data.vote.confirmation_id}`, {
          state: {
            vote: res.data.vote,
            electionTitle: election?.title
          }
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record vote. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="text-xs text-slate-400">Loading electronic voting booth...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Navigation back */}
        <Link
          to={`/voter/elections/${electionId}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Election Overview
        </Link>

        {/* Voting Booth Banner */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Vote className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Digital Voting Booth</span>
          </div>

          <h1 className="text-2xl font-extrabold text-white mb-2">{election?.title}</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Select your preferred candidate below. Once confirmed, your ballot will be encrypted and immutably recorded in the database.
          </p>

          <div className="mt-4 pt-4 border-t border-slate-900 flex items-center gap-4 text-xs text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticated Voter ID: <strong>{user?.voter_id}</strong> (Verified Session)</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-xs text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Candidate Radio Cards */}
        <div className="space-y-4 mb-8">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">
            Select Your Candidate (Choose 1)
          </h2>

          {candidates.map((candidate) => {
            const isSelected = selectedCandidateId === candidate.id;
            return (
              <label
                key={candidate.id}
                onClick={() => setSelectedCandidateId(candidate.id)}
                className={`block cursor-pointer rounded-2xl p-5 border transition-all ${
                  isSelected
                    ? 'bg-blue-950/60 border-blue-500 shadow-xl shadow-blue-500/10'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="candidate"
                      value={candidate.id}
                      checked={isSelected}
                      onChange={() => setSelectedCandidateId(candidate.id)}
                      className="w-5 h-5 text-blue-600 bg-slate-900 border-slate-700 focus:ring-blue-500"
                    />

                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                      <img
                        src={candidate.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'}
                        alt={candidate.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">{candidate.name}</h3>
                      <span className="text-xs font-semibold text-blue-400">{candidate.organization}</span>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{candidate.description}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold shrink-0 hidden sm:block">
                      Selected Candidate
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        {/* Submit Action Bar */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Selected: <strong className="text-white">{selectedCandidate?.name || 'None'}</strong>
          </div>

          <button
            onClick={handleOpenConfirm}
            disabled={!selectedCandidateId || submitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Encrypting & Casting Ballot...
              </>
            ) : (
              <>
                <Vote className="w-4 h-4" />
                Submit Official Ballot
              </>
            )}
          </button>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-extrabold text-white mb-2">Confirm Ballot Submission</h3>
            
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to cast your vote for{' '}
              <strong className="text-white">{selectedCandidate?.name}</strong> in the{' '}
              <strong className="text-white">{election?.title}</strong>?
              <br />
              <span className="text-amber-400 mt-2 block font-medium">This action cannot be undone or modified once recorded.</span>
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-left mb-6 space-y-1">
              <div className="text-slate-400">Voter: <span className="text-white font-semibold">{user?.full_name}</span></div>
              <div className="text-slate-400">Voter ID: <span className="text-white font-semibold">{user?.voter_id}</span></div>
              <div className="text-slate-400">Selection: <span className="text-blue-400 font-bold">{selectedCandidate?.name} ({selectedCandidate?.organization})</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel & Review
              </button>
              <button
                onClick={handleCastVote}
                className="py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/25 transition-all"
              >
                Confirm & Cast Vote
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default VotingPage;
