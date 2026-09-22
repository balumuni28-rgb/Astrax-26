import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onOpenRegistration: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenRegistration }) => {
  return (
    <section className="relative pt-8 pb-4 px-4 sm:px-6 lg:px-8 text-center">
      
      {/* Aditya Degree College Official Logo Emblem & Institutional Identity */}
      <div className="flex flex-col items-center justify-center mb-4">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-2 shadow-2xl border-2 border-amber-400 overflow-hidden mb-3 flex items-center justify-center">
          <img
            src="/aditya-logo.jpg"
            alt="Aditya Educational Institutions - Enlightens The Nescience"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-widest uppercase font-tech">
          <span>Aditya Degree College • Autonomous Campus</span>
        </div>
      </div>

      {/* Main Event Title: ASTRA X'26 */}
      <div className="relative max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase text-white font-heading">
          <span>ASTRA </span>
          <span className="text-amber-400">X&apos;26</span>
        </h1>

        <p className="mt-2 text-base sm:text-xl font-medium text-amber-100">
          AI &amp; Autonomous Robotics Symposium
        </p>

        <p className="mt-2 text-xs sm:text-sm text-amber-200/80 max-w-xl mx-auto">
          Department of Computer Science, Artificial Intelligence &amp; Robotics
        </p>
      </div>

      {/* Call to Action Button: Opens Student Registration */}
      <div className="mt-8 flex justify-center">
        <button
          id="btn-register-astra"
          type="button"
          onClick={onOpenRegistration}
          className="px-8 py-3.5 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 transition-all uppercase font-tech tracking-wider cursor-pointer shadow-[0_0_25px_rgba(212,175,55,0.5)] hover:shadow-[0_0_35px_rgba(212,175,55,0.8)] transform hover:-translate-y-0.5 flex items-center gap-2.5"
        >
          <span>Register for ASTRA X&apos;26</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </button>
      </div>

    </section>
  );
};

