import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Vote, Shield, User, LogOut, LayoutDashboard, CheckCircle2, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Vote className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                CivicVote<span className="text-blue-500">.io</span>
              </span>
              <span className="block text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Secure Election Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-blue-400 font-semibold' : 'text-slate-300 hover:text-white'}`}
            >
              Home
            </Link>

            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/voter/dashboard"
                      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                        isActive('/voter/dashboard') ? 'text-blue-400 font-semibold' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/voter/profile"
                      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                        isActive('/voter/profile') ? 'text-blue-400 font-semibold' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>
                  </>
                )}
              </>
            ) : null}
          </nav>

          {/* Right Action / Profile */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left text-xs">
                    <div className="font-semibold text-white flex items-center gap-1">
                      {user.full_name}
                      {user.verification_status === 'verified' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 capitalize">{user.role} ({user.voter_id})</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md shadow-blue-600/20 transition-all hover:scale-105"
                >
                  Register as Voter
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-300 hover:text-white"
          >
            Home
          </Link>
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-amber-400"
                >
                  Admin Panel
                </Link>
              ) : (
                <>
                  <Link
                    to="/voter/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-slate-300 hover:text-white"
                  >
                    Voter Dashboard
                  </Link>
                  <Link
                    to="/voter/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-slate-300 hover:text-white"
                  >
                    My Profile
                  </Link>
                </>
              )}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">{user.email}</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-xs font-semibold text-red-400"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm text-slate-300 bg-slate-800 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium bg-blue-600 text-white rounded-lg"
              >
                Register as Voter
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
