import React from 'react';
import { CheckCircle, X, Printer, Award, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { StudentRegistration } from '../types';

interface RegistrationSuccessModalProps {
  registration: StudentRegistration | null;
  onClose: () => void;
}

export const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({
  registration,
  onClose
}) => {
  if (!registration) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      
      <div className="relative w-full max-w-lg rounded-3xl theme-wine-cream-card gold-border-lux p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(212,175,55,0.5)] overflow-hidden">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-amber-200 hover:text-white hover:bg-black/80 border border-amber-400/30 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
          <CheckCircle className="w-9 h-9 text-emerald-400" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
          Registration Confirmed!
        </h3>
        <p className="text-xs text-amber-200/80 mt-1">
          Official Entry Pass for ASTRA X&apos;26 • Aditya Degree College
        </p>

        {/* Pass Card Component */}
        <div id="printable-pass" className="my-6 rounded-2xl bg-gradient-to-b from-[#2a040b] to-[#180206] border-2 border-amber-400/80 p-5 text-left relative overflow-hidden shadow-inner">
          
          {/* Watermark */}
          <div className="absolute -right-6 -bottom-6 text-amber-500/5 font-heading text-8xl font-black pointer-events-none select-none">
            ASTRA
          </div>

          <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-lg bg-white p-0.5 shrink-0 overflow-hidden border border-amber-300 flex items-center justify-center">
                <img src="/aditya-logo.jpg" alt="Aditya Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-amber-300 uppercase block font-tech">
                  Aditya Degree College
                </span>
                <span className="text-sm font-bold text-white font-heading">
                  ASTRA X&apos;26 PASS
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase text-amber-300/70 block font-tech">Pass ID</span>
              <span className="text-xs font-mono font-bold text-amber-300">{registration.id}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs mb-4">
            <div>
              <span className="text-[10px] uppercase text-amber-300/70 block font-tech">Candidate Name</span>
              <span className="font-bold text-white text-sm">{registration.studentName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-amber-300/70 block font-tech">SUC Code</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{registration.sucNumber}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-amber-300/70 block font-tech">Course &amp; Year</span>
              <span className="font-semibold text-slate-200">{registration.course} ({registration.year})</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-amber-300/70 block font-tech">Registered Competition</span>
              <span className="font-bold text-amber-300 text-sm flex items-center gap-1">
                <Award className="w-3.5 h-3.5 inline text-amber-400 shrink-0" />
                <span>{registration.competitionTitle}</span>
              </span>
            </div>
          </div>

          <div className="border-t border-amber-500/30 pt-3 flex items-center justify-between text-[11px] text-amber-200/70">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Single-Entry Pass</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-[10px]">{registration.registeredAt}</span>
            </div>
          </div>

        </div>

        {/* Rule Reminder */}
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-[11px] text-amber-200 mb-6">
          <Sparkles className="w-3.5 h-3.5 inline text-amber-400 mr-1" />
          <strong>Rule Enforced:</strong> This SUC is now locked to <em>{registration.competitionTitle}</em>. Additional registrations in other tracks are not permitted.
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 transition-all font-tech uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print Event Pass</span>
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-amber-100 bg-black/50 hover:bg-black/80 border border-amber-500/40 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

