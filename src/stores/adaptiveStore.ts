/**
 * Adaptive Engine Store - Manages AI-driven optimization state
 * Tracks CNS fatigue, plateaus, and recovery suggestions
 */

import { create } from 'zustand';
import type {
  AdaptiveEngineState,
  PlateauDetection,
  MuscleGroup,
} from '@types/index';

interface AdaptiveStoreState {
  cnsFatigue: number;
  recoveryStatus: 'rested' | 'fatigued' | 'critical';
  activePlateaus: PlateauDetection[];
  muscleAtrophyMap: Record<MuscleGroup, number>;
  suggestedNextAction: string | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string;

  // Actions
  setCNSFatigue: (score: number) => void;
  updateRecoveryStatus: () => void;
  addPlateau: (plateau: PlateauDetection) => void;
  removePlateau: (plateauId: string) => void;
  updateMuscleAtrophy: (muscle: MuscleGroup, decay: number) => void;
  setSuggestedAction: (action: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getEngineState: () => AdaptiveEngineState;
}

export const useAdaptiveStore = create<AdaptiveStoreState>((set, get) => ({
  cnsFatigue: 0,
  recoveryStatus: 'rested',
  activePlateaus: [],
  muscleAtrophyMap: {},
  suggestedNextAction: null,
  isLoading: false,
  error: null,
  lastUpdated: new Date().toISOString(),

  setCNSFatigue: (score) => {
    set({ cnsFatigue: Math.min(100, Math.max(0, score)) });
    get().updateRecoveryStatus();
  },

  updateRecoveryStatus: () => {
    const fatigue = get().cnsFatigue;
    let status: 'rested' | 'fatigued' | 'critical';

    if (fatigue < 30) status = 'rested';
    else if (fatigue < 70) status = 'fatigued';
    else status = 'critical';

    set({ recoveryStatus: status });
  },

  addPlateau: (plateau) =>
    set((state) => ({
      activePlateaus: [...state.activePlateaus, plateau],
    })),

  removePlateau: (plateauId) =>
    set((state) => ({
      activePlateaus: state.activePlateaus.filter((p) => p.id !== plateauId),
    })),

  updateMuscleAtrophy: (muscle, decay) =>
    set((state) => ({
      muscleAtrophyMap: { ...state.muscleAtrophyMap, [muscle]: decay },
    })),

  setSuggestedAction: (action) => set({ suggestedNextAction: action }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  getEngineState: (): AdaptiveEngineState => {
    const state = get();
    return {
      cns_fatigue_score: state.cnsFatigue,
      overall_recovery_status: state.recoveryStatus,
      active_plateaus: state.activePlateaus,
      muscle_atrophy_status: state.muscleAtrophyMap,
      suggested_next_action: state.suggestedNextAction,
      last_updated: state.lastUpdated,
    };
  },
}));
