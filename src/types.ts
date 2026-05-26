export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export type Priority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  category: string;
  deadline?: string;
  completed: boolean;
  repeat: "none" | "daily" | "weekly";
  subtasks: SubTask[];
  createdAt: string;
}

export interface ScheduleBlock {
  id: string;
  title: string;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  category: "work" | "learning" | "youtube" | "discipline" | "personal";
  color?: string;
  notes?: string;
}

export interface AlarmConfig {
  id: string;
  time: string; // "HH:MM"
  label: string;
  enabled: boolean;
  voiceSynthesis: boolean;
  type: "wake" | "focus" | "sleep" | "rest";
  days: string[]; // e.g. ["Mon", "Tue"]
}

export interface SleepLog {
  id: string;
  date: string; // "YYYY-MM-DD"
  sleepTime: string; // "HH:MM"
  wakeTime: string; // "HH:MM"
  duration: number; // hours
  quality: number; // 1-100
  notes?: string;
}

export interface LearningSkill {
  id: string;
  title: string;
  level: number;
  xp: number;
  xpNeeded: number;
  streak: number;
  lastMaintained?: string;
  milestones: { text: string; completed: boolean }[];
}

export interface CreatorProject {
  id: string;
  title: string;
  niche: string;
  workflowStage: "idea" | "scripting" | "editing" | "thumbnail" | "ready" | "published";
  scriptNotes?: string;
  thumbnailPlanned: boolean;
  seoTags: string[];
  publishDeadline?: string;
  checklist: string[];
}

export interface SecretNote {
  id: string;
  title: string;
  body: string;
  category: "ideas" | "vault" | "journal" | "reflection";
  isPasswordLocked: boolean;
  passwordHash?: string;
  updatedAt: string;
}

export interface UserOSProfile {
  name: string;
  level: number;
  xp: number;
  productivityScore: number;
  dailyStreak: number;
  waterIntake: number; // current ml
  waterTarget: number; // target ml
  eyeRestInterval: number; // minutes left
  screenTimeMinutes: number;
  dopamineDetox: boolean;
  isFocusTimerRunning: boolean;
  focusTimerTotalSeconds: number;
  focusTimerSecondsLeft: number;
  focusTimerLabel: string;
}
