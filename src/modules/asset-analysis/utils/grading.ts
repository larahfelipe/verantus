export type GradeLetter = 'A' | 'B' | 'C' | 'D';

const GRADE_A_MIN = 80;
const GRADE_B_MIN = 65;
const GRADE_C_MIN = 50;

export const letterGrade = (score: number): GradeLetter => {
  if (score >= GRADE_A_MIN) return 'A';
  if (score >= GRADE_B_MIN) return 'B';
  if (score >= GRADE_C_MIN) return 'C';
  return 'D';
};

/** Large headline badge (consolidated rating). */
const HEADLINE_BADGE_CLASS: Record<GradeLetter, string> = {
  A: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  B: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  C: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  D: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
};

/** Per-factor grade chip (adds its own border utility). */
const FACTOR_CHIP_CLASS: Record<GradeLetter, string> = {
  A: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  B: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20',
  C: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  D: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
};

/** Fundamental Health Index progress bar fill. */
const HEALTH_BAR_CLASS: Record<GradeLetter, string> = {
  A: 'bg-emerald-500 dark:bg-emerald-400',
  B: 'bg-teal-500 dark:bg-teal-400',
  C: 'bg-amber-500 dark:bg-amber-400',
  D: 'bg-rose-500 dark:bg-rose-400'
};

const ASSESSMENT_TEXT: Record<GradeLetter, string> = {
  A: 'Strong Fundamental Profile',
  B: 'Moderate Fundamental Profile',
  C: 'Stable Fundamental Profile',
  D: 'Weak Fundamental Profile'
};

export const headlineBadgeClass = (score: number): string =>
  HEADLINE_BADGE_CLASS[letterGrade(score)];

export const factorChipClass = (score: number): string => FACTOR_CHIP_CLASS[letterGrade(score)];

export const healthBarClass = (score: number): string => HEALTH_BAR_CLASS[letterGrade(score)];

export const assessmentText = (score: number): string => ASSESSMENT_TEXT[letterGrade(score)];
