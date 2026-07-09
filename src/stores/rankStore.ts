/**
 * Rank Store - Manages tier system, decay mechanics, and rank history
 * Enforces discipline through gamified decay
 */

import { create } from 'zustand';
import type { UserTier, RankHistory } from '@types/index';

interface RankStoreState {
  currentTier: UserTier;
  tierPoints: number;
  atrophyStatus: Record<string, number>;
  rankHistory: RankHistory[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setTier: (tier: UserTier, points: number) => void;
  addTierPoints: (points: number) => void;
  deductTierPoints: (points: number) => void;
  updateAtrophyStatus: (muscle: string, decayPercent: number) => void;
  addRankHistoryEntry: (entry: RankHistory) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getTierProgression: () => number;
}

const TIER_PROGRESSION: Record<UserTier, number> = {
  'Inert': 0,
  'Kinetic': 250,
  'Active': 600,
  'Structural': 1200,
  'Elite': 2000,
  'Apex': 3500,
};

const TIER_ORDER: UserTier[] = ['Inert', 'Kinetic', 'Active', 'Structural', 'Elite', 'Apex'];

export const useRankStore = create<RankStoreState>((set, get) => ({
  currentTier: 'Inert',
  tierPoints: 0,
  atrophyStatus: {},
  rankHistory: [],
  isLoading: false,
  error: null,

  setTier: (tier, points) => set({ currentTier: tier, tierPoints: points }),

  addTierPoints: (points) => {
    const state = get();
    const newPoints = state.tierPoints + points;
    const currentTierIndex = TIER_ORDER.indexOf(state.currentTier);
    const nextTier = TIER_ORDER[currentTierIndex + 1];
    const nextTierThreshold = nextTier ? TIER_PROGRESSION[nextTier] : TIER_PROGRESSION[state.currentTier];

    if (newPoints >= nextTierThreshold && nextTier) {
      set({ currentTier: nextTier, tierPoints: newPoints });
    } else {
      set({ tierPoints: newPoints });
    }
  },

  deductTierPoints: (points) => {
    const state = get();
    const newPoints = Math.max(0, state.tierPoints - points);
    const currentTierIndex = TIER_ORDER.indexOf(state.currentTier);
    const prevTier = currentTierIndex > 0 ? TIER_ORDER[currentTierIndex - 1] : null;
    const prevTierThreshold = prevTier ? TIER_PROGRESSION[prevTier] : 0;

    if (newPoints < prevTierThreshold && prevTier) {
      set({ currentTier: prevTier, tierPoints: newPoints });
    } else {
      set({ tierPoints: newPoints });
    }
  },

  updateAtrophyStatus: (muscle, decayPercent) =>
    set((state) => ({
      atrophyStatus: { ...state.atrophyStatus, [muscle]: decayPercent },
    })),

  addRankHistoryEntry: (entry) =>
    set((state) => ({
      rankHistory: [...state.rankHistory, entry],
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  getTierProgression: () => {
    const state = get();
    const currentTierIndex = TIER_ORDER.indexOf(state.currentTier);
    const nextTier = TIER_ORDER[currentTierIndex + 1];

    if (!nextTier) return 100;

    const currentThreshold = TIER_PROGRESSION[state.currentTier];
    const nextThreshold = TIER_PROGRESSION[nextTier];
    const progress = ((state.tierPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

    return Math.min(100, Math.max(0, progress));
  },
}));
