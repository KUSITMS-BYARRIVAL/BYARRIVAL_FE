export type StatsPeriod = "WEEK" | "MONTH" | "YEAR" | "ALL";

export type StatSummary = {
  period: StatsPeriod;
  from: string;
  to: string;
  usedMinutes: number;
  readArticleCount: number;
  completedCount: number;
  empty: boolean;
};

export type Streak = {
  currentStreak: number;
  longestStreak: number;
};

export type CalendarDayLevel = "NONE" | "ACCESSED" | "PARTIAL" | "COMPLETED";

export type CalendarDay = {
  date: string;
  level: CalendarDayLevel;
  readCount: number;
  future: boolean;
};

export type Calendar = {
  year: number;
  today: string;
  completedDays: number;
  days: CalendarDay[];
};

export type WeeklyUsage = {
  weekStart: string;
  weekEnd: string;
  usedMinutes: number;
  readArticleCount: number;
  completedCount: number;
};

export type UsageGraph = {
  weeks: WeeklyUsage[];
  empty: boolean;
};
