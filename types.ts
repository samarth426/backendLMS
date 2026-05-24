/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Shared Frontend Types
export interface UserSafe {
  id: string;
  name: string;
  email: string;
  branch: string; // Electrical, Mechanical, Civil, Electronics, EC, Computer
  track: string; // Fresher, Experienced, Manager
  isPremiumUnlocked: boolean;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  quiz?: QuizQuestion[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  branch: string;
  duration: string;
  type: string;
  modules: Module[];
}

export interface UserProgress {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  score?: number;
  watchPercent: number;
  updatedAt: string;
}

export type ViewTab = "home" | "syllabus" | "dashboard" | "ai-tutor" | "billing";
