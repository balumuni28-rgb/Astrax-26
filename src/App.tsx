import React, { useState, useEffect, useCallback } from 'react';
import { AdityaHeader } from './components/AdityaHeader';
import { HeroSection } from './components/HeroSection';
import { RegistrationForm } from './components/RegistrationForm';
import { RegistrationSuccessModal } from './components/RegistrationSuccessModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentRegistration, AdminAuth, COMPETITIONS } from './types';
import { registrationService } from './services/registrationService';
import { Cpu, Award } from 'lucide-react';

export default function App() {
  // Application State: 'home' (Event Overview) | 'register' (Student Registration) | 'admin' (Admin Console)
  const [currentView, setCurrentView] = useState<'home' | 'register' | 'admin'>('home');
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([]);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string>(COMPETITIONS[0].id);

  // Admin authentication state
  const [adminAuth, setAdminAuth] = useState<AdminAuth>(() => {
    const saved = sessionStorage.getItem('astra_admin_auth');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse admin auth session', e);
      }
    }
    return { username: '', isAuthenticated: false };
  });

  // Modal states
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [confirmedPassRegistration, setConfirmedPassRegistration] = useState<StudentRegistration | null>(null);

  // Synchronize registrations from storage and live service
  const refreshRegistrations = useCallback(() => {
    const data = registrationService.getRegistrations();
    setRegistrations(data);
  }, []);

  // Sync on mount and cross-tab/storage changes
  useEffect(() => {
    refreshRegistrations();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'astra_x26_registrations_v4') {
        refreshRegistrations();
      }
    };

    const handleFocus = () => {
      refreshRegistrations();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleFocus);

    // Auto-poll every 2 seconds so the admin person sees new registrations in real time
    const pollInterval = setInterval(refreshRegistrations, 2000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
      clearInterval(pollInterval);
    };
  }, [refreshRegistrations]);

  // Sync admin authentication to session storage
  const handleAdminLoginSuccess = (adminName: string) => {
    const authData: AdminAuth = {
      username: adminName,
      isAuthenticated: true,
      loginTime: new Date().toISOString()
    };
    setAdminAuth(authData);
    sessionStorage.setItem('astra_admin_auth', JSON.stringify(authData));
    setIsAdminLoginOpen(false);
    refreshRegistrations(); // Ensure freshest list on opening admin
    setCurrentView('admin'); // Directly enter Second Frontend upon login
  };

  const handleAdminLogout = () => {
    setAdminAuth({ username: '', isAuthenticated: false });
    sessionStorage.removeItem('astra_admin_auth');
    setCurrentView('home');
  };

  const handleOpenRegistration = () => {
    setCurrentView('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegistrationSuccess = (newReg: StudentRegistration) => {
    setRegistrations(registrationService.getRegistrations());
    setConfirmedPassRegistration(newReg);
  };

  return (
    <div className="min-h-screen relative selection:bg-amber-400 selection:text-black">
      
      {/* Clean elegant background: deep wine center smoothly blending to soft warm cream at borders */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, #580c1a 0%, #3e0712 50%, #200308 75%, #f4ede2 98%, #faf6ef 100%)',
          backgroundAttachment: 'fixed'
        }}
      />

      {/* Subtle, slim golden frame */}
      <div className="fixed inset-2 pointer-events-none z-50 border border-amber-400/40 rounded-xl" />

      {/* Main Header with Aditya Degree College Logo, View Switcher & Admin Access */}
      <AdityaHeader
        adminAuth={adminAuth}
        currentView={currentView}
        onNavigateHome={() => setCurrentView('home')}
        onOpenRegistration={handleOpenRegistration}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminDashboard={() => {
          refreshRegistrations();
          setCurrentView('admin');
        }}
        onLogoutAdmin={handleAdminLogout}
      />

      {/* View Switcher: Admin Portal vs Event Overview vs Student Registration */}
      {currentView === 'admin' ? (
        <AdminDashboard
          adminAuth={adminAuth}
          registrations={registrations}
          onRegistrationsChange={setRegistrations}
          onRefresh={refreshRegistrations}
          onExitAdminView={() => setCurrentView('home')}
          onLogoutAdmin={handleAdminLogout}
          onViewPass={(student) => setConfirmedPassRegistration(student)}
        />
      ) : currentView === 'register' ? (
        /* STUDENT REGISTRATION VIEW */
        <main className="relative pb-24 animate-fadeIn">
          <RegistrationForm
            selectedCompetitionId={selectedCompetitionId}
            onSelectCompetitionId={setSelectedCompetitionId}
            onRegistrationSuccess={handleRegistrationSuccess}
            onBack={() => setCurrentView('home')}
          />

          {/* Institutional Footer */}
          <footer className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-amber-200/80 border-t border-amber-500/20 pt-8 pb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <p className="font-bold text-amber-300 text-sm font-heading">
                  ADITYA DEGREE COLLEGE
                </p>
                <p className="text-[11px] text-amber-100/70">
                  Department of Computer Science, Artificial Intelligence &amp; Autonomous Robotics
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-tech flex-wrap justify-center">
                <span className="flex items-center gap-1 text-amber-300">
                  <Cpu className="w-3.5 h-3.5" /> ASTRA X&apos;26 Fest
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-300">
                  <Award className="w-3.5 h-3.5" /> Autonomous Campus
                </span>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="text-[11px] text-amber-400 hover:text-amber-200 underline cursor-pointer"
                >
                  Admin Portal
                </button>
              </div>
            </div>
            <p className="mt-4 text-[10px] text-amber-200/50">
              © 2026 Aditya Degree College. All rights reserved.
            </p>
          </footer>
        </main>
      ) : (
        /* HOME VIEW: EVENT OVERVIEW & HERO SECTION */
        <main className="relative pb-24">
          
          {/* Hero Section with Event Title "ASTRA X'26" & prominent "Register for ASTRA X'26" button */}
          <HeroSection 
            onOpenRegistration={handleOpenRegistration} 
          />

          {/* Institutional Footer */}
          <footer className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-amber-200/80 border-t border-amber-500/20 pt-8 pb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <p className="font-bold text-amber-300 text-sm font-heading">
                  ADITYA DEGREE COLLEGE
                </p>
                <p className="text-[11px] text-amber-100/70">
                  Department of Computer Science, Artificial Intelligence &amp; Autonomous Robotics
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-tech flex-wrap justify-center">
                <span className="flex items-center gap-1 text-amber-300">
                  <Cpu className="w-3.5 h-3.5" /> ASTRA X&apos;26 Fest
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-300">
                  <Award className="w-3.5 h-3.5" /> Autonomous Campus
                </span>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="text-[11px] text-amber-400 hover:text-amber-200 underline cursor-pointer"
                >
                  Admin Portal
                </button>
              </div>
            </div>
            <p className="mt-4 text-[10px] text-amber-200/50">
              © 2026 Aditya Degree College. All rights reserved.
            </p>
          </footer>

        </main>
      )}

      {/* Modals */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      <RegistrationSuccessModal
        registration={confirmedPassRegistration}
        onClose={() => setConfirmedPassRegistration(null)}
      />

    </div>
  );
}

