import React from 'react';
import { Vote, ShieldCheck, Lock, Award, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Vote className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">CivicVote.io</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              State-of-the-art digital election management platform for transparent, tamper-evident civic and organizational voting.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>256-Bit Encrypted Voting Pipeline</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Security Architecture</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Election Types</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Real-Time Verification</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Roles & Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-white transition-colors">Voter Portal Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Voter Self-Registration</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Administrator Access</Link></li>
              <li><Link to="/voter/dashboard" className="hover:text-white transition-colors">Live Election Feed</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Notice & Compliance</h4>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs leading-relaxed text-slate-400">
              <div className="flex items-center gap-1.5 text-amber-400 font-medium mb-1">
                <Lock className="w-3.5 h-3.5" />
                Educational Demo System
              </div>
              Designed as an educational/demo election management system with duplicate vote prevention & cryptographic confirmation IDs.
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} CivicVote.io — All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Security Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
