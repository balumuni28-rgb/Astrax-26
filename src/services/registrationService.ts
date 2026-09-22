import { StudentRegistration, RegistrationFormData, COMPETITIONS, checkYearCompetitionEligibility } from '../types';
import { INITIAL_REGISTRATIONS } from '../data/initialRegistrations';

const STORAGE_KEY = 'astra_x26_registrations_v4';

export const registrationService = {
  getRegistrations(): StudentRegistration[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read localStorage, falling back to empty data', e);
    }
    return INITIAL_REGISTRATIONS;
  },

  saveRegistrations(registrations: StudentRegistration[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
    } catch (e) {
      console.error('Error saving registrations to localStorage', e);
    }
  },

  findRegistrationBySuc(sucNumber: string): StudentRegistration | undefined {
    const cleanSuc = sucNumber.trim().toUpperCase();
    const current = this.getRegistrations();
    return current.find(r => r.sucNumber.trim().toUpperCase() === cleanSuc);
  },

  /**
   * Registers a student.
   * STRICT RULE:
   * "one student should participate in one competition, If they try to register in another competition it should not allow."
   */
  registerStudent(data: RegistrationFormData): {
    success: boolean;
    registration?: StudentRegistration;
    error?: string;
    alreadyRegistered?: boolean;
    existingCompetition?: string;
  } {
    const cleanSuc = data.sucNumber.trim().toUpperCase();
    const cleanName = data.studentName.trim();

    if (!cleanName || !data.course || !data.year || !cleanSuc || !data.competitionId) {
      return {
        success: false,
        error: 'Please fill in all mandatory registration fields.'
      };
    }

    const currentRegistrations = this.getRegistrations();

    // RULE ENFORCEMENT: Check if student with this SUC is already registered in ANY competition
    const existingRegistration = currentRegistrations.find(
      r => r.sucNumber.trim().toUpperCase() === cleanSuc
    );

    if (existingRegistration) {
      return {
        success: false,
        alreadyRegistered: true,
        existingCompetition: existingRegistration.competitionTitle,
        error: `Registration Blocked: Student with SUC [${existingRegistration.sucNumber}] (${existingRegistration.studentName}) is already registered for "${existingRegistration.competitionTitle}". As per ASTRA X'26 rules, one student can only participate in one competition.`
      };
    }

    const comp = COMPETITIONS.find(c => c.id === data.competitionId);
    if (!comp) {
      return {
        success: false,
        error: 'Invalid competition selected.'
      };
    }

    // STRICT YEAR ELIGIBILITY RULE:
    // BOT-ARENA and AI CINEVERSE are for 3rd Year students ONLY.
    // 3rd Years CANNOT select any other competition!
    // 1st & 2nd Years CANNOT select BOT-ARENA or AI CINEVERSE!
    const yearCheck = checkYearCompetitionEligibility(data.year, comp.id);
    if (!yearCheck.isAllowed) {
      return {
        success: false,
        error: yearCheck.errorMessage || 'This competition is not allowed for your year of study.'
      };
    }

    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const regId = `ASTRA-26-${Math.floor(1000 + Math.random() * 9000)}-${cleanSuc.slice(-4)}`;

    const newRegistration: StudentRegistration = {
      id: regId,
      studentName: cleanName,
      course: data.course,
      year: data.year,
      sucNumber: cleanSuc,
      competitionId: comp.id,
      competitionTitle: comp.title,
      registeredAt: timestamp
    };

    const updated = [newRegistration, ...currentRegistrations];
    this.saveRegistrations(updated);

    return {
      success: true,
      registration: newRegistration
    };
  },

  deleteRegistration(id: string): boolean {
    const current = this.getRegistrations();
    const filtered = current.filter(r => r.id !== id);
    if (filtered.length !== current.length) {
      this.saveRegistrations(filtered);
      return true;
    }
    return false;
  },

  resetToDefault(): StudentRegistration[] {
    this.saveRegistrations(INITIAL_REGISTRATIONS);
    return INITIAL_REGISTRATIONS;
  }
};
