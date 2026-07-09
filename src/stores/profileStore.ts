/**
 * Profile Store - Manages user profile and tier data
 * Zustand store with TypeScript strict mode
 */

import { create } from 'zustand';
import type { UserProfile, UserTier } from '@types/index';

interface ProfileStoreState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setProfile: (profile: UserProfile) => void;
  updateTier: (tier: UserTier, points: number) => void;
  updateStreak: (days: number) => void;
  incrementWorkouts: () => void;
  setLastWorkout: (date: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileStoreState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  setProfile: (profile) => set({ profile }),

  updateTier: (tier, points) =>
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, current_tier: tier, tier_points: points }
        : null,
    })),

  updateStreak: (days) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, streak_days: days } : null,
    })),

  incrementWorkouts: () =>
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, total_workouts: state.profile.total_workouts + 1 }
        : null,
    })),

  setLastWorkout: (date) =>
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, last_workout_at: date }
        : null,
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearProfile: () => set({ profile: null }),
}));
