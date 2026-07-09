/**
 * Workout Store - Manages active session and exercise logs
 * Handles real-time workout tracking
 */

import { create } from 'zustand';
import type { ExerciseLog, WorkoutSession } from '@types/index';

interface WorkoutStoreState {
  activeSession: WorkoutSession | null;
  currentExerciseLogs: ExerciseLog[];
  isLoading: boolean;
  error: string | null;

  // Actions
  startSession: (session: WorkoutSession) => void;
  addExerciseLog: (log: ExerciseLog) => void;
  updateExerciseLog: (logId: string, updates: Partial<ExerciseLog>) => void;
  removeExerciseLog: (logId: string) => void;
  endSession: (completedAt: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSession: () => void;
  getTotalVolume: () => number;
  getAverageRPE: () => number;
}

export const useWorkoutStore = create<WorkoutStoreState>((set, get) => ({
  activeSession: null,
  currentExerciseLogs: [],
  isLoading: false,
  error: null,

  startSession: (session) => set({ activeSession: session, currentExerciseLogs: [] }),

  addExerciseLog: (log) =>
    set((state) => ({
      currentExerciseLogs: [...state.currentExerciseLogs, log],
    })),

  updateExerciseLog: (logId, updates) =>
    set((state) => ({
      currentExerciseLogs: state.currentExerciseLogs.map((log) =>
        log.id === logId ? { ...log, ...updates } : log
      ),
    })),

  removeExerciseLog: (logId) =>
    set((state) => ({
      currentExerciseLogs: state.currentExerciseLogs.filter((log) => log.id !== logId),
    })),

  endSession: (completedAt) =>
    set((state) => ({
      activeSession: state.activeSession
        ? { ...state.activeSession, completed_at: completedAt }
        : null,
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearSession: () => set({ activeSession: null, currentExerciseLogs: [] }),

  getTotalVolume: () => {
    const logs = get().currentExerciseLogs;
    return logs.reduce((sum, log) => sum + log.weight * log.reps, 0);
  },

  getAverageRPE: () => {
    const logs = get().currentExerciseLogs;
    if (logs.length === 0) return 0;
    return logs.reduce((sum, log) => sum + log.rpe, 0) / logs.length;
  },
}));
