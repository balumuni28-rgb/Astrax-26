import React from 'react';
import { ShieldCheck, Lock, UserPlus, ArrowLeft } from 'lucide-react';
import { AdminAuth } from '../types';

interface AdityaHeaderProps {
  adminAuth: AdminAuth;
  currentView: 'home' | 'register' | 'admin';
  onNavigateHome: () => void;
  onOpenRegistration: () => void;
  onOpenAdminLogin: () => void;
  onOpenAdminDashboard: () => void;
  onLogoutAdmin: () => void;
}

export const AdityaHeader: React.FC<AdityaHeaderProps> = ({
  adminAuth,
  currentView,
  onNavigateHome,
  onOpenRegistration,
  onOpenAdminLogin,
  onOpenAdminDashboard,
  onLogoutAdmin
}) => {
  return (
    <header className="relative w-full border-b border-amber-500/30 bg-gradient-to-r from-[#2a040b]/90 via-[#450813]/90 to-[#2a040b]/90 backdrop-blur-md sticky top-0 z-40 shadow-xl shadow-black/40">
      {/* Golden top decorative bar */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 shadow-[0_0_10px_rgba(212,175,55,0.8)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Aditya Official Emblem Logo & Institutional Identity */}
          <div 
            onClick={onNavigateHome}
            className="flex items-center gap-3.5 cursor-pointer group"
            title="Aditya Degree College - Home"
          >
            {/* Real Official Aditya Emblem with clean white backdrop */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white p-1 shadow-md shrink-0 overflow-hidden border-2 border-amber-400 group-hover:border-amber-300 flex items-center justify-center transition-all">
              <img
                src="/aditya-logo.jpg"
                alt="Aditya Educational Institutions - Enlightens The Nescience"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-wide text-white uppercase font-heading group-hover:text-amber-300 transition-colors">
                  Aditya Degree College
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Autonomous
                </span>
              </div>
              <p className="text-xs text-amber-100/90 font-medium">
                Department of Computer Science, AI &amp; Robotics
              </p>
            </div>
          </div>

          {/* Action Navigation: Registration & Admin Portal */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            
            {/* Register for ASTRA / Event Overview switcher when in public views */}
            {currentView === 'home' && (
              <button
                id="btn-header-register"
                type="button"
                onClick={onOpenRegistration}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-black bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-[0_0_12px_rgba(212,175,55,0.5)] font-tech uppercase tracking-wider cursor-pointer transition-all transform hover:-translate-y-0.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-black" />
                <span>Register for ASTRA</span>
              </button>
            )}

            {currentView === 'register' && (
              <button
                type="button"
                onClick={onNavigateHome}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-amber-200 hover:text-white bg-black/40 hover:bg-black/60 border border-amber-500/40 font-tech uppercase tracking-wider cursor-pointer transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                <span>Event Details</span>
              </button>
            )}

            {/* Admin Portal / Login Button */}
            {adminAuth.isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  id="btn-open-admin-dashboard"
                  type="button"
                  onClick={onOpenAdminDashboard}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold text-black bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-[0_0_12px_rgba(212,175,55,0.6)] transition-all transform hover:-translate-y-0.5 cursor-pointer font-tech tracking-wider uppercase"
                >
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>Admin Portal</span>
                </button>
                <button
                  type="button"
                  onClick={onLogoutAdmin}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-red-200 hover:text-white bg-red-950/60 hover:bg-red-900 border border-red-500/40 transition-colors cursor-pointer"
                  title="Logout from Admin Portal"
                >
                  Exit
                </button>
              </div>
            ) : (
              <button
                id="btn-admin-login-top-right"
                type="button"
                onClick={onOpenAdminLogin}
                className="relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-amber-100 hover:text-white bg-gradient-to-r from-[#7a1024] to-[#4e0915] hover:from-[#90132c] hover:to-[#5e0a1a] border-2 border-amber-400/80 hover:border-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:shadow-[0_0_20px_rgba(212,175,55,0.7)] transition-all duration-200 cursor-pointer font-tech uppercase tracking-wider"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>Admin Login</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
