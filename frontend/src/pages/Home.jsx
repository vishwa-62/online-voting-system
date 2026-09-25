import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import {
  Vote,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Users,
  BarChart3,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Cpu,
  FileCheck,
  Zap
} from 'lucide-react';

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How does CivicVote guarantee that I can only vote once per election?',
      a: 'The system enforces a database-level unique constraint on voter_id + election_id combined with server-side JWT verification. Even if a voter attempts multiple submissions, the backend transaction rejects duplicate attempts instantly.'
    },
    {
      q: 'Is my vote selection visible to administrators or third parties?',
      a: 'No. Vote casting endpoint processes vote insertions securely and returns a unique cryptographically generated confirmation reference ID. Vote totals are calculated in aggregate via SQL grouping without exposing voter choice history.'
    },
    {
      q: 'How do voters get verified before casting a ballot?',
      a: 'During registration, voters submit their government or institutional Voter ID. System administrators review and verify voter records from the Admin Control Console before ballot authorization.'
    },
    {
      q: 'Can results be altered manually after an election closes?',
      a: 'No. Election results are computed in real time directly from immutable database records using SQL aggregation (COUNT). No manual tally overrides exist.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white selection:bg-blue-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.25),rgba(255,255,255,0))]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Encrypted & Auditable Digital Election Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight mb-6">
            Empowering Democracy with <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">
              Secure & Transparent Voting
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            A modern, production-grade civic technology platform for universities, student councils, and organizations. Cast verified votes with tamper-evident digital confirmations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Register as Voter
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              Sign In to Dashboard
            </Link>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div className="mt-12 max-w-xl mx-auto p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 flex items-center justify-between">
            <div className="text-left">
              <span className="font-semibold text-amber-400 block mb-0.5">⚡ Instant Demo Access</span>
              <span>Admin: <code className="text-white">admin@votingdemo.com</code> | Voter: <code className="text-white">voter@votingdemo.com</code></span>
            </div>
            <Link to="/login" className="px-3 py-1.5 bg-blue-600/30 text-blue-300 hover:bg-blue-600/50 rounded-lg font-semibold transition-colors">
              Try Demo →
            </Link>
          </div>
        </div>
      </section>

      {/* System Overview & Core Pillars */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">System Overview</h2>
            <p className="text-3xl font-extrabold text-white">Built for Security, Scalability, and Integrity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Cryptographic Voter Identity</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Voters undergo strict identity verification. JWT authentication paired with bcrypt hashing protects voter credentials against unauthorized access.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">One-Vote-Per-Election Rule</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Database-level unique constraints and atomic transaction logic guarantee that every verified voter can cast exactly one ballot per election.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Real-Time Aggregated Results</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Results are aggregated automatically directly from database records without manual tallying, presenting clean visual charts and statistics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Step-By-Step Workflow</h2>
            <p className="text-3xl font-extrabold text-white">How The Voting Process Works</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 relative">
              <span className="text-4xl font-extrabold text-blue-600/30 absolute top-4 right-4">01</span>
              <Users className="w-8 h-8 text-blue-400 mb-3" />
              <h4 className="font-bold text-white text-sm mb-1">Voter Registration</h4>
              <p className="text-xs text-slate-400">Register account with Full Name, Email, DOB, and official Voter ID.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 relative">
              <span className="text-4xl font-extrabold text-blue-600/30 absolute top-4 right-4">02</span>
              <FileCheck className="w-8 h-8 text-blue-400 mb-3" />
              <h4 className="font-bold text-white text-sm mb-1">Admin Verification</h4>
              <p className="text-xs text-slate-400">Administrator verifies voter details and approves voting eligibility.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 relative">
              <span className="text-4xl font-extrabold text-blue-600/30 absolute top-4 right-4">03</span>
              <Vote className="w-8 h-8 text-blue-400 mb-3" />
              <h4 className="font-bold text-white text-sm mb-1">Cast Ballot</h4>
              <p className="text-xs text-slate-400">Browse active elections, inspect candidate profiles, and cast your vote.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 relative">
              <span className="text-4xl font-extrabold text-blue-600/30 absolute top-4 right-4">04</span>
              <ShieldCheck className="w-8 h-8 text-blue-400 mb-3" />
              <h4 className="font-bold text-white text-sm mb-1">Receive Receipt</h4>
              <p className="text-xs text-slate-400">Obtain an audit-ready digital confirmation ID verifying ballot submission.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <HelpCircle className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-semibold text-sm text-white hover:text-blue-400"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
