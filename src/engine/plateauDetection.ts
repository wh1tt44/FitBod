/**
 * Plateau Detection Engine
 * Identifies strength/volume stagnation and triggers interventions
 */

import type { ExerciseLog, PlateauDetection, PlateauAction, MuscleGroup } from '@types/index';

const PLATEAU_THRESHOLD_DAYS = 14;
const PLATEAU_PROGRESS_TOLERANCE = 0.02;

/**
 * Analyzes exercise logs for a given muscle group to detect plateaus
 */
export function detectPlateau(
  logs: ExerciseLog[],
  muscleGroup: MuscleGroup
): PlateauDetection | null {
  if (logs.length < 3) return null;

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const recentLogs = sortedLogs.slice(0, 10);
  const oldestLog = recentLogs[recentLogs.length - 1];
  const newestLog = recentLogs[0];

  const daysDiff = Math.floor(
    (new Date(newestLog.created_at).getTime() - new Date(oldestLog.created_at).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (daysDiff < PLATEAU_THRESHOLD_DAYS) return null;

  const maxWeightOld = Math.max(...recentLogs.slice(5).map((l) => l.weight));
  const maxWeightRecent = Math.max(...recentLogs.slice(0, 5).map((l) => l.weight));

  const progressPercent = (maxWeightRecent - maxWeightOld) / maxWeightOld;

  if (progressPercent < PLATEAU_PROGRESS_TOLERANCE) {
    return {
      id: `plateau_${muscleGroup}_${Date.now()}`,
      user_id: logs[0].user_id,
      muscle_group: muscleGroup,
      days_since_last_progress: daysDiff,
      last_max_weight: maxWeightOld,
      current_max_weight: maxWeightRecent,
      suggested_action: suggestPlateauAction(maxWeightRecent, logs),
      action_applied: false,
      created_at: new Date().toISOString(),
    };
  }

  return null;
}

/**
 * Determines best action to break through plateau
 */
function suggestPlateauAction(
  currentMax: number,
  recentLogs: ExerciseLog[]
): PlateauAction {
  const avgRPE = recentLogs.reduce((sum, log) => sum + log.rpe, 0) / recentLogs.length;
  const avgFormRating = recentLogs.reduce((sum, log) => sum + log.form_rating, 0) / recentLogs.length;

  if (avgFormRating < 3) return 'exercise_swap';
  if (avgRPE > 8) return 'deload';

  return 'volume_reset';
}

/**
 * Calculates suggested deload week intensity (40-50% of current max)
 */
export function calculateDeloadWeight(currentMax: number): number {
  const reductionPercent = 0.45;
  return Math.round(currentMax * (1 - reductionPercent));
}
