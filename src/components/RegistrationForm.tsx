import React, { useState, useEffect } from 'react';
import { User, BookOpen, GraduationCap, Hash, Trophy, AlertTriangle, CheckCircle, Sparkles, Send, Lock, ArrowLeft } from 'lucide-react';
import { COMPETITIONS, COURSES, YEARS, StudentRegistration, RegistrationFormData, checkYearCompetitionEligibility, THIRD_YEAR_ONLY_COMPETITIONS } from '../types';
import { registrationService } from '../services/registrationService';

interface RegistrationFormProps {
  selectedCompetitionId: string;
  onSelectCompetitionId: (id: string) => void;
  onRegistrationSuccess: (reg: StudentRegistration) => void;
  onBack?: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  selectedCompetitionId,
  onSelectCompetitionId,
  onRegistrationSuccess,
  onBack
}) => {
  const initialYear = YEARS[0]; // '1st Year'
  // 1st Year defaults to a non-3rd year track like neura-quest
  const defaultTrackForYear = (yr: string) => yr === '3rd Year' ? 'bot-arena' : 'neura-quest';

  const [formData, setFormData] = useState<RegistrationFormData>({
    studentName: '',
    course: COURSES[0],
    year: initialYear,
    sucNumber: '',
    competitionId: defaultTrackForYear(initialYear)
  });

  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [sucWarning, setSucWarning] = useState<{
    alreadyRegistered: boolean;
    existingCompetition?: string;
    studentName?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync when parent changes selected competition, checking year eligibility
  useEffect(() => {
    if (selectedCompetitionId) {
      const eligibility = checkYearCompetitionEligibility(formData.year, selectedCompetitionId);
      if (eligibility.isAllowed) {
        setFormData(prev => ({ ...prev, competitionId: selectedCompetitionId }));
      } else {
        // If incoming track from parent is invalid for current year, switch to valid default
        const validId = defaultTrackForYear(formData.year);
        setFormData(prev => ({ ...prev, competitionId: validId }));
        onSelectCompetitionId(validId);
      }
    }
  }, [selectedCompetitionId]);

  // Handle Year Change with automatic rule enforcement
  const handleYearChange = (newYear: string) => {
    setErrorBanner(null);
    const eligibility = checkYearCompetitionEligibility(newYear, formData.competitionId);

    if (!eligibility.isAllowed) {
      // Auto-switch to the permitted track for this year
      const autoTrackId = defaultTrackForYear(newYear);
      setFormData(prev => ({
        ...prev,
        year: newYear,
        competitionId: autoTrackId
      }));
      onSelectCompetitionId(autoTrackId);
    } else {
      setFormData(prev => ({ ...prev, year: newYear }));
    }
  };

  // Live SUC check to provide instant feedback before submit
  useEffect(() => {
    const cleanSuc = formData.sucNumber.trim().toUpperCase();
    if (cleanSuc.length >= 4) {
      const existing = registrationService.findRegistrationBySuc(cleanSuc);
      if (existing) {
        setSucWarning({
          alreadyRegistered: true,
          existingCompetition: existing.competitionTitle,
          studentName: existing.studentName
        });
      } else {
        setSucWarning(null);
      }
    } else {
      setSucWarning(null);
    }
  }, [formData.sucNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner(null);

    // Enforce year eligibility check
    const yearCheck = checkYearCompetitionEligibility(formData.year, formData.competitionId);
    if (!yearCheck.isAllowed) {
      setErrorBanner(yearCheck.errorMessage || 'Invalid competition for your year of study.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = registrationService.registerStudent(formData);

      if (!result.success) {
        setErrorBanner(result.error || 'Registration failed. Please check event rules.');
        setIsSubmitting(false);
      } else if (result.registration) {
        setIsSubmitting(false);
        onRegistrationSuccess(result.registration);
        // Reset form to valid defaults
        setFormData({
          studentName: '',
          course: COURSES[0],
          year: YEARS[0],
          sucNumber: '',
          competitionId: defaultTrackForYear(YEARS[0])
        });
      }
    }, 400);
  };

  const is3rdYear = formData.year === '3rd Year';

  return (
    <section id="registration-form-section" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Clean elegant card with gentle wine gradient and subtle amber border */}
      <div className="relative rounded-2xl p-6 sm:p-8 bg-[#3d0712]/95 border border-amber-500/40 shadow-xl backdrop-blur-sm">
        
        {/* Form Title & Context */}
        <div className="relative text-center mb-6">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="sm:absolute left-0 top-1 mb-3 sm:mb-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-200 hover:text-white bg-black/40 hover:bg-black/60 border border-amber-500/40 font-tech uppercase tracking-wider cursor-pointer transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Back</span>
            </button>
          )}

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide font-heading">
            Student Registration
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-amber-200/80">
            Aditya Degree College • ASTRA X&apos;26 Official Entry Portal
          </p>
        </div>

        {/* ERROR BANNER */}
        {errorBanner && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/90 border-2 border-red-500 shadow-md flex items-start gap-3 text-left">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-red-100 font-medium">
                {errorBanner}
              </p>
            </div>
          </div>
        )}

        {/* Live Warning if SUC is already registered */}
        {sucWarning && (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/80 border border-amber-400/80 shadow-md flex items-start gap-3 text-left">
            <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-bold uppercase text-amber-300 tracking-wider">
                Existing Registration
              </span>
              <p className="text-xs text-amber-100 mt-0.5">
                Student <strong>{sucWarning.studentName}</strong> with this SUC is already registered for <strong>&quot;{sucWarning.existingCompetition}&quot;</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Registration Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* 1. Student Name */}
            <div>
              <label htmlFor="studentName" className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-2 font-tech flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Student Name *</span>
              </label>
              <input
                id="studentName"
                type="text"
                required
                autoFocus
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                placeholder="Enter student full name"
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-amber-500/40 focus:border-amber-300 focus:ring-2 focus:ring-amber-400/30 text-white placeholder-slate-400 text-sm font-medium transition-all"
              />
            </div>

            {/* 2. SUC Number (Student Unique Code) */}
            <div>
              <label htmlFor="sucNumber" className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-2 font-tech flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-amber-400" />
                <span>SUC Number *</span>
              </label>
              <input
                id="sucNumber"
                type="text"
                required
                value={formData.sucNumber}
                onChange={(e) => setFormData({ ...formData, sucNumber: e.target.value.toUpperCase() })}
                placeholder="Enter SUC number"
                className={`w-full px-4 py-3 rounded-xl bg-black/50 border ${
                  sucWarning ? 'border-red-400 ring-1 ring-red-400' : 'border-amber-500/40'
                } focus:border-amber-300 focus:ring-2 focus:ring-amber-400/30 text-white placeholder-slate-400 text-sm font-medium transition-all uppercase`}
              />
            </div>

            {/* 3. Course */}
            <div>
              <label htmlFor="course" className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-2 font-tech flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Course / Branch *</span>
              </label>
              <select
                id="course"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-black/70 border border-amber-500/40 focus:border-amber-300 focus:ring-2 focus:ring-amber-400/30 text-white text-sm font-medium transition-all"
              >
                {COURSES.map((course) => (
                  <option key={course} value={course} className="bg-neutral-900 text-white">
                    {course}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Year of Study */}
            <div>
              <label htmlFor="year" className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-2 font-tech flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>Year of Study *</span>
              </label>
              <select
                id="year"
                value={formData.year}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/70 border border-amber-500/40 focus:border-amber-300 focus:ring-2 focus:ring-amber-400/30 text-white text-sm font-medium transition-all"
              >
                {YEARS.map((year) => (
                  <option key={year} value={year} className="bg-neutral-900 text-white">
                    {year}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Select Competition */}
          <div>
            <label htmlFor="select-competition-field" className="block text-xs font-bold text-amber-200 uppercase tracking-wider mb-2 font-tech flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Select Competition *</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {COMPETITIONS.map((comp) => {
                const isSelected = formData.competitionId === comp.id;
                const eligibility = checkYearCompetitionEligibility(formData.year, comp.id);
                const isBlocked = !eligibility.isAllowed;

                return (
                  <div
                    key={comp.id}
                    className={`relative rounded-xl border-2 transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                      isBlocked
                        ? 'bg-black/70 border-zinc-800 opacity-40 cursor-not-allowed'
                        : isSelected
                        ? 'bg-amber-400/20 border-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.4)] cursor-pointer'
                        : 'bg-black/40 border-amber-500/30 hover:border-amber-400/70 hover:bg-black/60 cursor-pointer'
                    }`}
                  >
                    <button
                      type="button"
                      disabled={isBlocked}
                      onClick={() => {
                        if (isBlocked) {
                          setErrorBanner(eligibility.errorMessage || 'Competition is not available for your year.');
                          return;
                        }
                        setErrorBanner(null);
                        setFormData({ ...formData, competitionId: comp.id });
                        onSelectCompetitionId(comp.id);
                      }}
                      className="p-3.5 w-full text-left h-full flex flex-col justify-between"
                    >
                      <div>
                        {/* Status / Year Badge */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          {isBlocked ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-400 bg-black/60 border border-zinc-700 px-2 py-0.5 rounded-full uppercase">
                              <Lock className="w-2.5 h-2.5" />
                              <span>Unavailable</span>
                            </span>
                          ) : (
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              comp.isThirdYearOnly
                                ? 'text-amber-300 bg-amber-950/80 border border-amber-400/40'
                                : 'text-cyan-300 bg-cyan-950/80 border border-cyan-400/40'
                            }`}>
                              <span>{comp.eligibleYears}</span>
                            </span>
                          )}

                          {isSelected && !isBlocked && (
                            <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                          )}
                        </div>

                        <span className={`text-sm font-black font-heading block ${
                          isBlocked ? 'text-zinc-500' : 'text-amber-100'
                        }`}>
                          {comp.title}
                        </span>

                        <p className={`text-[11px] line-clamp-2 leading-tight mt-1 ${
                          isBlocked ? 'text-zinc-600' : 'text-slate-300'
                        }`}>
                          {comp.description}
                        </p>
                      </div>

                      {/* Bottom action indicator */}
                      <div className="mt-2 pt-2 border-t border-white/10 text-[10px] font-tech font-bold uppercase">
                        {isBlocked ? (
                          <span className="text-zinc-500">Not Available</span>
                        ) : isSelected ? (
                          <span className="text-amber-300">✓ Selected</span>
                        ) : (
                          <span className="text-amber-200/70 hover:text-white">Select</span>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-4 border-t border-amber-500/30 flex items-center justify-end">
            <button
              id="btn-submit-registration"
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-black text-black bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-[0_0_20px_rgba(212,175,55,0.6)] hover:shadow-[0_0_30px_rgba(212,175,55,0.9)] transition-all transform hover:-translate-y-0.5 cursor-pointer font-tech uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Registration...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-black" />
                  <span>Register Student</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </section>
  );
};

