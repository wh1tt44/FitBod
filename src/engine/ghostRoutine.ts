/**
 * Ghost Routine Engine - Equipment swap suggestions
 * Finds equivalent exercises when gym equipment is unavailable
 */

import type { Exercise, GhostRoutineSwap, MuscleGroup } from '@types/index';

/**
 * Suggests alternative exercises based on muscle group and available equipment
 */
export function suggestEquipmentSwap(
  originalExercise: Exercise,
  availableExercises: Exercise[]
): GhostRoutineSwap | null {
  const candidates = availableExercises.filter(
    (ex) =>
      ex.target_muscle === originalExercise.target_muscle &&
      ex.id !== originalExercise.id &&
      ex.difficulty === originalExercise.difficulty
  );

  if (candidates.length === 0) return null;

  const bestMatch = candidates[0];
  const equivalenceScore = calculateEquivalenceScore(originalExercise, bestMatch);

  if (equivalenceScore < 0.7) return null;

  return {
    id: `swap_${Date.now()}`,
    user_id: '', // To be populated
    workout_session_id: '',
    original_exercise: originalExercise,
    suggested_exercise: bestMatch,
    equivalence_score: equivalenceScore,
    reason: `${bestMatch.name} targets ${bestMatch.target_muscle} equivalently`,
    applied: false,
    created_at: new Date().toISOString(),
  };
}

/**
 * Calculates how similar two exercises are (0-1 scale)
 */
function calculateEquivalenceScore(exercise1: Exercise, exercise2: Exercise): number {
  let score = 0;

  if (exercise1.target_muscle === exercise2.target_muscle) score += 0.5;
  if (exercise1.difficulty === exercise2.difficulty) score += 0.3;

  const secondaryOverlap = exercise1.secondary_muscles.filter((m) =>
    exercise2.secondary_muscles.includes(m)
  ).length;

  score += (secondaryOverlap / Math.max(exercise1.secondary_muscles.length, 1)) * 0.2;

  return Math.min(1, score);
}

/**
 * Generates routine substitution plan
 */
export function generateGhostRoutine(
  originalExercises: Exercise[],
  availableExercises: Exercise[]
): GhostRoutineSwap[] {
  return originalExercises
    .map((ex) => suggestEquipmentSwap(ex, availableExercises))
    .filter((swap): swap is GhostRoutineSwap => swap !== null);
}
