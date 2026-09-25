import React, { useState, useEffect } from 'react';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  Vote,
  ShieldCheck,
  Loader2,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const VoterProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [votesHistory, setVotesHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/profile');
      if (res.data.success) {
        setProfileData(res.data.user);
        setVotesHistory(res.data.votesHistory || []);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
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
            <span className="text-xs text-slate-400">Fetching voter profile records...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const u = profileData || user;

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-white">Voter Profile & History</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your identity information and inspect past ballot confirmations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Profile Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl lg:col-span-1">
            <div className="text-center pb-6 border-b border-slate-900">
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-extrabold text-2xl mx-auto mb-3 shadow-lg shadow-blue-600/30">
                {u?.full_name ? u.full_name.charAt(0).toUpperCase() : 'V'}
              </div>

              <h2 className="text-lg font-bold text-white flex items-center justify-center gap-1.5">
                {u?.full_name}
                {u?.verification_status === 'verified' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </h2>
              <span className="text-xs font-semibold text-blue-400 font-mono block mt-0.5">{u?.voter_id}</span>
              
              <div className="mt-3 inline-block">
                <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${
                  u?.verification_status === 'verified'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  Verification: {u?.verification_status?.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="pt-6 space-y-4 text-xs">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{u?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{u?.mobile}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Date of Birth: {u?.date_of_birth ? new Date(u.date_of_birth).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Role: <strong className="capitalize text-white">{u?.role}</strong></span>
              </div>
            </div>
          </div>

          {/* Voting History */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl lg:col-span-2">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Vote className="w-5 h-5 text-blue-400" /> Personal Voting Activity ({votesHistory.length})
            </h3>

            {votesHistory.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-semibold text-white">No votes cast yet</p>
                <p className="text-[11px] text-slate-500 mt-1">Browse available elections from your dashboard to cast your ballot.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {votesHistory.map((vote) => (
                  <div
                    key={vote.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-white text-sm mb-0.5">{vote.election_title}</h4>
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <span>{vote.election_type}</span>
                        <span>•</span>
                        <span>Cast: {new Date(vote.cast_at).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-blue-400 font-semibold">
                        {vote.confirmation_id}
                      </div>
                      <Link
                        to={`/results/${vote.election_id}`}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        Results
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VoterProfile;
