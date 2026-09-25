import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, ShieldCheck, Printer, ArrowRight, FileCheck, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const VoteConfirmation = () => {
  const { confirmationId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const voteData = location.state?.vote;
  const electionTitle = location.state?.electionTitle || 'Digital Election';

  const handleCopy = () => {
    navigator.clipboard.writeText(confirmationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden">
          
          {/* Header Icon */}
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Vote Successfully Recorded
          </h1>

          <p className="text-xs text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
            Your ballot choice has been encrypted and immutably written to the election database. Keep your confirmation reference ID for audit purposes.
          </p>

          {/* Cryptographic Confirmation Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left mb-8 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Election Name</span>
              <span className="text-xs font-bold text-white text-right">{electionTitle}</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Voter ID</span>
              <span className="text-xs font-mono font-bold text-blue-400">{user?.voter_id}</span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Timestamp</span>
              <span className="text-xs text-slate-200">
                {voteData?.cast_at ? new Date(voteData.cast_at).toLocaleString() : new Date().toLocaleString()}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">
                Official Vote Confirmation ID
              </span>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-blue-500/40 font-mono text-sm font-bold text-blue-400">
                <span>{confirmationId}</span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors"
                  title="Copy ID"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Tamper-Evident Database Constraint Verified</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>

            <Link
              to="/voter/dashboard"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all hover:scale-105"
            >
              Return to Voter Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VoteConfirmation;
