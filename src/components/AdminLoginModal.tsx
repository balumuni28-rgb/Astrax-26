import React, { useState } from 'react';
import { Lock, ShieldAlert, X, KeyRound } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (adminName: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const cleanPass = password.trim();

    setTimeout(() => {
      setIsLoading(false);

      const validPasswords = [
        'astra@aditya2026',
        'admin123',
        'astra2026',
        'aditya',
        'admin',
        'aditya2026',
        'astra'
      ];

      if (!validPasswords.includes(cleanPass.toLowerCase()) && !validPasswords.includes(cleanPass)) {
        setErrorMessage('Invalid admin password. Please try again.');
        return;
      }

      onLoginSuccess('Admin');
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl theme-wine-cream-card gold-border-lux p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.6)]">
        {/* Close Modal Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-amber-200 hover:text-white hover:bg-black/80 border border-amber-400/30 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 rounded-full bg-white p-0.5 border-2 border-amber-400 mb-3 overflow-hidden shadow-md">
            <img
              src="/aditya-logo.jpg"
              alt="Aditya Degree College"
              className="w-full h-full object-contain rounded-full"
            />
          </div>

          <h3 className="text-xl font-bold text-white">
            Admin Portal
          </h3>
          <p className="text-xs text-amber-200/80 mt-1">
            ASTRA X&apos;26 • Aditya Degree College
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/90 border border-red-500 text-xs text-red-200 flex items-start gap-2 text-left">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form: Just Enter Admin Password */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-2 font-tech flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Enter Admin Password</span>
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-amber-500/40 focus:border-amber-300 focus:ring-2 focus:ring-amber-400/30 text-white placeholder-slate-400 text-sm font-medium transition-all"
            />
          </div>

          <button
            id="btn-admin-submit-login"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-black bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.6)] transition-all font-tech uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-black" />
                <span>Enter Admin Portal</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
