/**
 * Core Type Definitions for Apex Fitness
 * Strict TypeScript types for all data entities
 */

// ============================================================================
// USER & PROFILE
// ============================================================================

export type UserTier = 'Inert' | 'Kinetic' | 'Active' | 'Structural' | 'Elite' | 'Apex';

export interface UserProfile {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  current_tier: UserTier;
  tier_points: number;
  total_workouts: number;
  streak_days: number;
  last_workout_at: string | null;
}

// ============================================================================
// EXERCISE & WORKOUT LOGGING
// ============================================================================

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'abs'
  | 'obliques';

export type ExerciseDifficulty = 'compound' | 'isolation';

export interface Exercise {
  id: string;
  name: string;
  target_muscle: MuscleGroup;
  secondary_muscles: MuscleGroup[];
  difficulty: ExerciseDifficulty;
  created_at: string;
}

export interface ExerciseLog {
  id: string;
  user_id: string;
  exercise_id: string;
  workout_session_id: string;
  reps: number;
  weight: number;
  rpe: number;
  cns_fatigue_score: number;
  form_rating: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  session_date: string;
  duration_minutes: number;
  total_volume: number;
  avg_rpe: number;
  overall_cns_fatigue: number;
  mood_rating: number;
  created_at: string;
  completed_at: string | null;
}

// ============================================================================
// BIO-FEEDBACK & FORM ANALYSIS
// ============================================================================

export interface BioFeedbackPoint {
  id: string;
  exercise_log_id: string;
  felt_muscle: MuscleGroup;
  target_muscle: MuscleGroup;
  accuracy: number;
  feedback_cues: string[];
  created_at: string;
}

// ============================================================================
// CNS FATIGUE & RECOVERY
// ============================================================================

export interface CNSFatigueLog {
  id: string;
  user_id: string;
  session_id: string;
  intensity_level: number;
  estimated_recovery_hours: number;
  recovery_completed_at: string | null;
  notes: string | null;
  created_at: string;
}

// ============================================================================
// PLATEAU & ADAPTIVE ENGINE
// ============================================================================

export type PlateauAction = 'deload' | 'volume_reset' | 'exercise_swap' | 'none';

export interface PlateauDetection {
  id: string;
  user_id: string;
  muscle_group: MuscleGroup;
  days_since_last_progress: number;
  last_max_weight: number;
  current_max_weight: number;
  suggested_action: PlateauAction;
  action_applied: boolean;
  created_at: string;
}

export interface DeloadWeek {
  id: string;
  user_id: string;
  muscle_group: MuscleGroup;
  start_date: string;
  end_date: string;
  weight_reduction_percent: number;
  reason: string;
  completed: boolean;
  created_at: string;
}

// ============================================================================
// ATROPHY TRACKING & RANK DECAY
// ============================================================================

export interface AtrophyTracker {
  id: string;
  user_id: string;
  muscle_group: MuscleGroup;
  last_trained_at: string;
  days_since_last_training: number;
  decay_percentage: number;
  critical_warning: boolean;
  created_at: string;
  updated_at: string;
}

export interface RankHistory {
  id: string;
  user_id: string;
  previous_tier: UserTier;
  new_tier: UserTier;
  points_change: number;
  reason: string;
  created_at: string;
}

// ============================================================================
// ADAPTIVE ENGINE STATE
// ============================================================================

export interface AdaptiveEngineState {
  cns_fatigue_score: number;
  overall_recovery_status: 'rested' | 'fatigued' | 'critical';
  active_plateaus: PlateauDetection[];
  muscle_atrophy_status: Record<MuscleGroup, number>;
  suggested_next_action: string | null;
  last_updated: string;
}

// ============================================================================
// GHOST ROUTINE (EQUIPMENT SWAP)
// ============================================================================

export interface GhostRoutineSwap {
  id: string;
  user_id: string;
  workout_session_id: string;
  original_exercise: Exercise;
  suggested_exercise: Exercise;
  equivalence_score: number;
  reason: string;
  applied: boolean;
  created_at: string;
}

// ============================================================================
// ANATOMICAL DUMMY (360° MODEL)
// ============================================================================

export interface DummyBioFeedback {
  id: string;
  user_id: string;
  exercise_log_id: string;
  tap_points: Array<{
    muscle: MuscleGroup;
    intensity: number;
  }>;
  total_feedback_points: number;
  created_at: string;
}
