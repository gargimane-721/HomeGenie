import React from 'react';
import { Compass, PlusCircle, LayoutDashboard, User as UserIcon, Home, Layers, IndianRupee, Cpu, Sparkles } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentView: 'home' | 'dashboard' | 'workspace' | 'materials' | 'smarthome';
  onNavigate: (view: 'home' | 'dashboard' | 'workspace' | 'materials' | 'smarthome' | 'wizard') => void;
  user: User | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onStartNewPlan: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user,
  onOpenAuth,
  onOpenProfile,
  onStartNewPlan,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 bg-white/90 backdrop-blur-md transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-10">
          <button
            onClick={() => onNavigate('home')}
            className="group flex items-center gap-3.5 text-left transition-opacity hover:opacity-90"
            id="nav-brand-logo"
          >
            <div className="w-9 h-9 bg-gray-900 border border-gray-800 flex items-center justify-center rounded-xl shadow-sm">
              <div className="w-4 h-4 border-2 border-white rotate-45 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight text-gray-900 font-heading">HomeGenie</span>
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-900 border border-gray-300">
                  AI Architecture
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-gray-900 font-bold">Architectural & Smart Home Engine</p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs uppercase tracking-widest font-bold">
            <button
              onClick={() => onNavigate('home')}
              className={`flex items-center gap-1.5 py-1 transition-all ${
                currentView === 'home'
                  ? 'border-b-2 border-gray-900 text-gray-900 font-bold'
                  : 'text-gray-700 hover:text-black'
              }`}
              id="nav-link-home"
            >
              <Home className="h-4 w-4 text-gray-900" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => onNavigate('smarthome')}
              className={`flex items-center gap-1.5 py-1 transition-all ${
                currentView === 'smarthome'
                  ? 'border-b-2 border-gray-900 text-gray-900 font-bold'
                  : 'text-gray-700 hover:text-black'
              }`}
              id="nav-link-smarthome"
            >
              <Cpu className="h-4 w-4 text-gray-900" />
              <span>Smart Home</span>
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 py-1 transition-all ${
                currentView === 'dashboard'
                  ? 'border-b-2 border-gray-900 text-gray-900 font-bold'
                  : 'text-gray-700 hover:text-black'
              }`}
              id="nav-link-dashboard"
            >
              <LayoutDashboard className="h-4 w-4 text-gray-900" />
              <span>Projects</span>
            </button>

            <button
              onClick={() => onNavigate('workspace')}
              className={`flex items-center gap-1.5 py-1 transition-all ${
                currentView === 'workspace'
                  ? 'border-b-2 border-gray-900 text-gray-900 font-bold'
                  : 'text-gray-700 hover:text-black'
              }`}
              id="nav-link-workspace"
            >
              <Layers className="h-4 w-4 text-gray-900" />
              <span>Designer CAD</span>
            </button>

            <button
              onClick={() => onNavigate('materials')}
              className={`flex items-center gap-1.5 py-1 transition-all ${
                currentView === 'materials'
                  ? 'border-b-2 border-gray-900 text-gray-900 font-bold'
                  : 'text-gray-700 hover:text-black'
              }`}
              id="nav-link-materials"
            >
              <IndianRupee className="h-4 w-4 text-gray-900" />
              <span>Material Lab</span>
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onStartNewPlan}
            className="flex items-center gap-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm transition-all active:scale-95"
            id="nav-btn-new-project"
          >
            <PlusCircle className="h-4 w-4 text-gray-200" />
            <span>New Plan</span>
          </button>

          {user ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 rounded-full border border-gray-300 bg-white p-1.5 pr-4 text-xs font-bold text-gray-900 transition-colors hover:bg-gray-50 shadow-sm"
              id="nav-btn-profile"
            >
              <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-xs font-bold text-white">
                {user.name.charAt(0)}
              </div>
              <span className="hidden sm:inline-block max-w-[110px] truncate text-xs font-bold text-gray-900">{user.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-900 transition-colors hover:bg-gray-50 shadow-sm"
              id="nav-btn-login"
            >
              <UserIcon className="h-4 w-4 text-gray-900" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
