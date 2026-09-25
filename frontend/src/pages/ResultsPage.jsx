import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import api from '../services/api';
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
  BarChart3,
  Award,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  PieChart as PieIcon,
  ShieldCheck
} from 'lucide-react';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const ResultsPage = () => {
  const { electionId } = useParams();
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, [electionId]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/results/${electionId}`);
      if (res.data.success) {
        setResultsData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Election results are not published or access restricted.');
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
            <span className="text-xs text-slate-400">Aggregating vote counts from database...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !resultsData) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 text-white">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Results Not Available</h2>
          <p className="text-xs text-slate-400 mb-6">{error || 'Election results are not accessible.'}</p>
          <Link to="/voter/dashboard" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold">
            Return to Dashboard
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const { election, summary, candidates } = resultsData;

  const chartData = candidates.map(c => ({
    name: c.name,
    votes: c.voteCount,
    percentage: c.percentage
  }));

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <Link
          to="/voter/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Title Header Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              {election.election_type}
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Official SQL Calculated Tally
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            {election.title} — Election Results
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
            {election.description}
          </p>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-medium text-slate-400 block">Total Registered Voters</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{summary.totalRegisteredVoters}</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-medium text-slate-400 block">Total Votes Cast</span>
            <span className="text-2xl font-extrabold text-blue-400 mt-1 block">{summary.totalVotesCast}</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-medium text-slate-400 block">Voter Turnout Rate</span>
            <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">{summary.participationRate}%</span>
          </div>
        </div>

        {/* Candidate Breakdown & Visual Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Candidate Table & Progress Bars */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" /> Candidate Vote Breakdown
            </h3>

            <div className="space-y-5">
              {candidates.map((candidate, idx) => (
                <div key={candidate.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
                  
                  {candidate.isWinner && (
                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-400" /> Winner
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={candidate.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'}
                      alt={candidate.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{candidate.name}</h4>
                      <span className="text-xs text-blue-400 font-semibold">{candidate.organization}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                    <span>{candidate.voteCount} Votes</span>
                    <span>{candidate.percentage}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${candidate.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recharts Bar Chart */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-indigo-400" /> Visual Distribution Chart
            </h3>

            <div className="flex-1 min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResultsPage;
