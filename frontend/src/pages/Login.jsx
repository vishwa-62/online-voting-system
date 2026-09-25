import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import { Mail, Lock, Shield, User, AlertCircle, Loader2, Sparkles } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotModal, setForgotModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Please enter your Email / Voter ID and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(identifier, password);
      if (res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          const from = location.state?.from?.pathname || '/voter/dashboard';
          navigate(from);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  // One-click demo logins
  const handleQuickDemoAdmin = async () => {
    setIdentifier('admin@votingdemo.com');
    setPassword('Admin@123');
    setLoading(true);
    try {
      const res = await login('admin@votingdemo.com', 'Admin@123');
      if (res.success) navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Demo admin login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoVoter = async () => {
    setIdentifier('voter@votingdemo.com');
    setPassword('Voter@123');
    setLoading(true);
    try {
      const res = await login('voter@votingdemo.com', 'Voter@123');
      if (res.success) navigate('/voter/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Demo voter login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          
          {/* Quick Demo Login Cards */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-950/70 to-indigo-950/70 border border-blue-800/50 shadow-lg text-xs">
            <div className="flex items-center gap-2 font-bold text-blue-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>One-Click Demo Credentials</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickDemoAdmin}
                className="py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Demo
              </button>
              <button
                type="button"
                onClick={handleQuickDemoVoter}
                className="py-2 px-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                Voter Demo
              </button>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">Sign In to Platform</h2>
              <p className="text-xs text-slate-400 mt-1">Access your voter dashboard or election administration console</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-xs text-red-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Email Address / Voter ID *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="admin@votingdemo.com or VTR-2026-8819"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-slate-300 font-semibold">Password *</label>
                  <button
                    type="button"
                    onClick={() => setForgotModal(true)}
                    className="text-[11px] text-blue-400 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember session</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Sign In to Voting System'
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-blue-400 font-semibold hover:underline">
                Register as Voter
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <h3 className="text-lg font-bold text-white mb-2">Password Recovery</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              For security compliance, password resets are processed by system administrators. Please contact your election administrator or use the demo credentials provided.
            </p>
            <button
              onClick={() => setForgotModal(false)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Login;
