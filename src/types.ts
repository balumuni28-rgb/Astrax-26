export interface Competition {
  id: string;
  title: string;
  tagline: string;
  description: string;
  iconName: string;
  badge: string;
  eligibleYears: '3rd Year Only' | '1st & 2nd Year Only';
  isThirdYearOnly: boolean;
  criteria: string[];
}

export interface StudentRegistration {
  id: string;
  studentName: string;
  course: string;
  year: string;
  sucNumber: string;
  competitionId: string;
  competitionTitle: string;
  registeredAt: string;
}

export interface RegistrationFormData {
  studentName: string;
  course: string;
  year: string;
  sucNumber: string;
  competitionId: string;
}

export interface AdminAuth {
  username: string;
  isAuthenticated: boolean;
  loginTime?: string;
}

export const ALLOWED_ADMINS = ['varshu', 'rampa', 'jai'];

export const THIRD_YEAR_ONLY_COMPETITIONS = ['bot-arena', 'ai-cineverse'];

export function checkYearCompetitionEligibility(
  year: string,
  competitionId: string
): { isAllowed: boolean; errorMessage?: string } {
  const is3rdYearComp = THIRD_YEAR_ONLY_COMPETITIONS.includes(competitionId);
  const is3rdYearStudent = year === '3rd Year';

  if (is3rdYearStudent) {
    if (!is3rdYearComp) {
      return {
        isAllowed: false,
        errorMessage: 'Registration Blocked: 3rd Year students are strictly restricted to "BOT-ARENA" and "AI CINEVERSE" only. All other competitions are blocked for 3rd years.'
      };
    }
    return { isAllowed: true };
  } else {
    // 1st Year and 2nd Year
    if (is3rdYearComp) {
      return {
        isAllowed: false,
        errorMessage: 'Registration Blocked: "BOT-ARENA" and "AI CINEVERSE" are exclusively for 3rd Year students only. 1st and 2nd Year students cannot select this competition.'
      };
    }
    return { isAllowed: true };
  }
}

export const COMPETITIONS: Competition[] = [
  {
    id: 'bot-arena',
    title: 'BOT - ARENA',
    tagline: 'AI Chatbot & Intelligent Agent Showdown',
    description: 'Build and present an AI chatbot or intelligent agent solution designed to solve a pressing real-world problem.',
    iconName: 'Bot',
    badge: '3rd Year Exclusive',
    eligibleYears: '3rd Year Only',
    isThirdYearOnly: true,
    criteria: [
      'Problem definition & societal impact',
      'AI/NLP architecture & prompt engineering',
      'Live working prototype & UI presentation'
    ]
  },
  {
    id: 'ai-cineverse',
    title: 'AI CINEVERSE',
    tagline: 'Generative Cinema & Visual Storytelling',
    description: 'AI-supported short film crafted using creative vision, compelling storytelling, and AI video generation tools.',
    iconName: 'Film',
    badge: '3rd Year Exclusive',
    eligibleYears: '3rd Year Only',
    isThirdYearOnly: true,
    criteria: [
      'Original narrative & story screenplay',
      'Effective use of AI video/audio generation',
      'Cinematography, pacing & sound design'
    ]
  },
  {
    id: 'neura-quest',
    title: 'NEURA QUEST',
    tagline: 'High-Stakes AI & Tech Master Quiz',
    description: 'AI and general technical knowledge quiz featuring multiple intense, buzzer-driven competitive rounds.',
    iconName: 'Brain',
    badge: '1st & 2nd Year Track',
    eligibleYears: '1st & 2nd Year Only',
    isThirdYearOnly: false,
    criteria: [
      'AI history, modern LLMs & neural architectures',
      'Rapid buzzer response & accuracy',
      'Grand finale multi-stage showdown'
    ]
  },
  {
    id: 'vision-x',
    title: 'VISION-X',
    tagline: 'AI & Robotics Tech Presentation',
    description: 'Generate and deliver an impactful PowerPoint presentation on an assigned or cutting-edge AI & Robotics breakthrough.',
    iconName: 'Presentation',
    badge: '1st & 2nd Year Track',
    eligibleYears: '1st & 2nd Year Only',
    isThirdYearOnly: false,
    criteria: [
      'Depth of technical research & citations',
      'Presentation aesthetics & visual clarity',
      'Defense during Q&A panel evaluation'
    ]
  },
  {
    id: 'ai-crossfire',
    title: 'AI CROSSFIRE',
    tagline: 'Structured AI Debate & Ethics Arena',
    description: 'A structured, high-intensity debate on pressing AI-related ethics, future workplace disruption, and governance topics.',
    iconName: 'Swords',
    badge: '1st & 2nd Year Track',
    eligibleYears: '1st & 2nd Year Only',
    isThirdYearOnly: false,
    criteria: [
      'Logical argumentation & factual evidence',
      'Rebuttal sharpness & poise under pressure',
      'Ethical consideration & forward vision'
    ]
  },
  {
    id: 'prompt-wars',
    title: 'PROMPT WARS',
    tagline: 'Elite Prompt Engineering Combat',
    description: 'Create the most optimal, precise, and creative prompt for complex multi-modal and reasoning tasks under time limits.',
    iconName: 'Sparkles',
    badge: '1st & 2nd Year Track',
    eligibleYears: '1st & 2nd Year Only',
    isThirdYearOnly: false,
    criteria: [
      'Prompt token efficiency & zero-shot precision',
      'Output accuracy against gold standard bench',
      'Handling edge cases & constraints'
    ]
  }
];

export const COURSES = [
  'Artificial intelligence and robotics',
  'Bsc and bca data science',
  'BBA',
  'BSC-A',
  'BSC-B',
  'BSC-C',
  'BCA'
];

export const YEARS = ['1st Year', '2nd Year', '3rd Year'];
