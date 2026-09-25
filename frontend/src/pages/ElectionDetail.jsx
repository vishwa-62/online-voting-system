import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Vote,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  User
} from 'lucide-react';

const ElectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteDetails, setVoteDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchElectionDetails();
  }, [id]);

  const fetchElectionDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/elections/${id}`);
      if (res.data.success) {
        setElection(res.data.election);
        setCandidates(res.data.candidates);
        setHasVoted(res.data.hasVoted);
        setVoteDetails(res.data.voteDetails);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load election details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="text-xs text-slate-400">Loading election details & candidates...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !election) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 text-white">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Election</h2>
          <p className="text-xs text-slate-400 mb-6">{error || 'Election not found.'}</p>
          <Link to="/voter/dashboard" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold">
            Return to Dashboard
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Back Link */}
        <Link
          to="/voter/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Voter Dashboard
        </Link>

        {/* Election Header Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 mb-10 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                {election.election_type}
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                election.status === 'active'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                Status: {election.status.toUpperCase()}
              </span>
            </div>

            {hasVoted && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" /> Vote Cast Recorded
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            {election.title}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed mb-6 max-w-3xl">
            {election.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-900 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Starts: <strong className="text-white">{new Date(election.start_date).toLocaleString()}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Ends: <strong className="text-white">{new Date(election.end_date).toLocaleString()}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Total Candidates: <strong className="text-white">{candidates.length}</strong></span>
            </div>
          </div>
        </div>

        {/* Voting Instructions Box */}
        <div className="mb-10 p-5 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-xs leading-relaxed text-blue-200">
          <h3 className="font-bold text-blue-300 mb-1 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" /> Voting Protocol Instructions
          </h3>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            <li>Review candidate qualifications and organization statements thoroughly below.</li>
            <li>Click "Cast Vote for Candidate" to initiate your ballot choice.</li>
            <li>You will be prompted with a final confirmation dialog before your vote is submitted.</li>
            <li>Once submitted, a unique reference confirmation ID will be generated for your records.</li>
          </ul>
        </div>

        {/* Candidates Section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Registered Candidates ({candidates.length})</h2>
          {hasVoted && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> You have already cast your ballot in this election.
            </span>
          )}
        </div>

        {candidates.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-400">
            <User className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="font-semibold text-white">No candidates registered yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-blue-500/40 transition-all shadow-xl"
              >
                <div>
                  <div className="w-24 h-24 rounded-2xl overflow-hidden mb-4 border border-slate-700 bg-slate-900 mx-auto sm:mx-0">
                    <img
                      src={candidate.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1">{candidate.name}</h3>
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-blue-400 text-xs font-semibold mb-3">
                    {candidate.organization}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {candidate.description}
                  </p>
                </div>

                <div>
                  {hasVoted ? (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl text-xs font-semibold cursor-not-allowed"
                    >
                      Ballot Already Cast
                    </button>
                  ) : election.status === 'active' ? (
                    <Link
                      to={`/voter/voting/${election.id}?candidateId=${candidate.id}`}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all hover:scale-105"
                    >
                      <Vote className="w-4 h-4" />
                      Vote for Candidate
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl text-xs font-semibold cursor-not-allowed"
                    >
                      Voting Not Active
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ElectionDetail;
