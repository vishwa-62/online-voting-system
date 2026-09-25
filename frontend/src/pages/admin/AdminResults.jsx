import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  BarChart2,
  Award,
  CheckCircle2,
  Printer,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';

const AdminResults = () => {
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchElections();
  }, []);

  useEffect(() => {
    if (selectedElectionId) {
      fetchResults(selectedElectionId);
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
      setError('Failed to fetch elections list.');
    }
  };

  const fetchResults = async (electionId) => {
    setLoading(true);
    try {
      const res = await api.get(`/results/${electionId}`);
      if (res.data.success) {
        setResultsData(res.data);
      }
    } catch (err) {
      setError('Failed to fetch election results.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!resultsData?.election) return;
    const election = resultsData.election;
    try {
      await api.put(`/elections/${election.id}`, {
        ...election,
        results_published: !election.results_published
      });
      fetchResults(election.id);
    } catch (err) {
      alert('Failed to update publication status.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Election Audit & Results Reports</h1>
          <p className="text-xs text-slate-500">Review aggregated ballot counts, participation percentages, and toggle public result visibility</p>
        </div>

        {resultsData && (
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Official Audit Report
          </button>
        )}
      </div>

      {/* Election Selector Dropdown */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="font-semibold text-slate-700 shrink-0">Select Election Contest:</span>
          <select
            value={selectedElectionId}
            onChange={(e) => setSelectedElectionId(e.target.value)}
            className="w-full sm:w-96 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
          >
            {elections.map(e => (
              <option key={e.id} value={e.id}>{e.title} ({e.status.toUpperCase()})</option>
            ))}
          </select>
        </div>

        {resultsData && (
          <button
            onClick={handleTogglePublish}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 ${
              resultsData.summary.resultsPublished
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
            }`}
          >
            {resultsData.summary.resultsPublished ? (
              <>
                <Eye className="w-4 h-4 text-emerald-600" />
                Results Published to Public
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 text-amber-600" />
                Results Hidden from Public (Click to Publish)
              </>
            )}
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-500 flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-xs">Calculating SQL tally metrics...</span>
        </div>
      ) : resultsData && (
        <div className="space-y-6">
          
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block">Total Verified Voters</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">{resultsData.summary.totalRegisteredVoters}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block">Total Ballots Cast</span>
              <span className="text-2xl font-bold text-blue-600 mt-1 block">{resultsData.summary.totalVotesCast}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 block">Voter Turnout Rate</span>
              <span className="text-2xl font-bold text-emerald-600 mt-1 block">{resultsData.summary.participationRate}%</span>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">{resultsData.election.title}</h3>
              <span className="text-xs text-slate-500 font-mono">SQL Aggregated Audit</span>
            </div>

            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Candidate Name</th>
                  <th className="px-6 py-3.5">Party / Organization</th>
                  <th className="px-6 py-3.5">Vote Tally</th>
                  <th className="px-6 py-3.5">Percentage</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resultsData.candidates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                      <img src={c.photo} alt={c.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200" />
                      <span>{c.name}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-blue-600">
                      {c.organization}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                      {c.voteCount}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {c.percentage}%
                    </td>
                    <td className="px-6 py-4">
                      {c.isWinner ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <Award className="w-3 h-3 text-amber-600" /> Winner
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Runner-up</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResults;
