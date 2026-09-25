import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Vote,
  CheckCircle2,
  Calendar,
  Clock,
  UserCheck,
  AlertCircle,
  Loader2,
  ArrowRight,
  Filter,
  BarChart2
} from 'lucide-react';

const VoterDashboard = () => {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

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
      setError('Failed to load elections.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalAvailable = elections.filter(e => e.status === 'active').length;
  const totalVoted = elections.filter(e => e.has_voted).length;
  const totalUpcoming = elections.filter(e => e.status === 'upcoming').length;
  const totalCompleted = elections.filter(e => e.status === 'completed').length;

  const filteredElections = elections.filter(e => {
    if (statusFilter === 'ALL') return true;
    return e.status.toLowerCase() === statusFilter.toLowerCase();
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Active Election
          </span>
        );
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            Upcoming
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-700">
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Welcome, {user?.full_name}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Voter ID: <code className="text-blue-400">{user?.voter_id}</code> | Verification Status:{' '}
              {user?.verification_status === 'verified' ? (
                <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              ) : (
                <span className="text-amber-400 font-semibold">Pending Verification</span>
              )}
            </p>
          </div>

          <Link
            to="/voter/profile"
            className="self-start sm:self-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            View Voting Record
          </Link>
        </div>

        {/* Verification Warning if pending */}
        {user?.verification_status !== 'verified' && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
            <div>
              <span className="font-bold block">Voter Verification Pending</span>
              <span>Your account registration is under administrator review. You will be able to cast votes once verified.</span>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400 block">Available Elections</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">{totalAvailable}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Vote className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400 block">Elections Voted</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">{totalVoted}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400 block">Upcoming Elections</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">{totalUpcoming}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400 block">Completed Elections</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">{totalCompleted}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Elections List Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Election Registry
          </h2>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            {['ALL', 'ACTIVE', 'UPCOMING', 'COMPLETED'].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  statusFilter === f
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="text-xs">Loading election registry...</span>
          </div>
        ) : filteredElections.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-400">
            <Vote className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-white text-sm">No elections found</p>
            <p className="text-xs mt-1">There are currently no elections matching the selected filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredElections.map((election) => (
              <div
                key={election.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                      {election.election_type}
                    </span>
                    {getStatusBadge(election.status)}
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {election.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {election.description}
                  </p>

                  <div className="space-y-2 text-[11px] text-slate-400 border-t border-slate-900 pt-3 mb-6">
                    <div className="flex justify-between">
                      <span>Start Date:</span>
                      <span className="text-slate-200 font-medium">
                        {new Date(election.start_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>End Date:</span>
                      <span className="text-slate-200 font-medium">
                        {new Date(election.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Candidates:</span>
                      <span className="text-slate-200 font-medium">{election.candidate_count || 0} Registered</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  {election.has_voted ? (
                    <div className="space-y-2">
                      <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Vote Recorded ({election.user_vote_confirmation})
                      </div>
                      {(election.results_published || election.status === 'completed') && (
                        <Link
                          to={`/results/${election.id}`}
                          className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <BarChart2 className="w-3.5 h-3.5" />
                          View Results
                        </Link>
                      )}
                    </div>
                  ) : election.status === 'active' ? (
                    <Link
                      to={`/voter/elections/${election.id}`}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all hover:scale-105"
                    >
                      Cast Ballot Now
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : election.status === 'completed' ? (
                    <Link
                      to={`/results/${election.id}`}
                      className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                    >
                      <BarChart2 className="w-4 h-4" />
                      View Election Results
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 px-4 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl text-xs font-semibold cursor-not-allowed"
                    >
                      Voting Period Not Active
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

export default VoterDashboard;
