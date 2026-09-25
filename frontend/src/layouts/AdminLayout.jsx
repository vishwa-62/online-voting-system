import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Vote,
  UserCheck,
  BarChart3,
  FileText,
  LogOut,
  ShieldAlert,
  Home,
  CheckCircle2
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Voter Management', path: '/admin/voters', icon: Users },
    { label: 'Elections Control', path: '/admin/elections', icon: Vote },
    { label: 'Candidate Register', path: '/admin/candidates', icon: UserCheck },
    { label: 'Results & Reports', path: '/admin/results', icon: BarChart3 },
    { label: 'Audit Activity Logs', path: '/admin/logs', icon: FileText }
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 text-white flex flex-col fixed inset-y-0 z-30">
        
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
              <Vote className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight">CivicAdmin</span>
              <span className="block text-[10px] text-blue-400 font-medium">Control Center</span>
            </div>
          </Link>
        </div>

        {/* Admin Tag */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-amber-300">Administrator Privileges</span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Public Portal View
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/30 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign Out Admin
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div>
            <h1 className="text-base font-bold text-slate-900">Election Management Console</h1>
            <p className="text-xs text-slate-500">Real-Time Civic Governance Dashboard</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                {user ? user.full_name.charAt(0) : 'A'}
              </div>
              <div className="text-left text-xs">
                <div className="font-semibold text-slate-900 flex items-center gap-1">
                  {user?.full_name}
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 inline" />
                </div>
                <span className="text-[10px] text-slate-500">Super Admin ({user?.voter_id})</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-8 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
