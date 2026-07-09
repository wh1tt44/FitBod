/**
 * Input Validators
 * Validates user input and data integrity
 */

import type { MuscleGroup, UserTier } from '@types/index';

const VALID_MUSCLE_GROUPS: MuscleGroup[] = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'forearms',
  'quadriceps',
  'hamstrings',
  'glutes',
  'calves',
  'abs',
  'obliques',
];

const VALID_TIERS: UserTier[] = ['Inert', 'Kinetic', 'Active', 'Structural', 'Elite', 'Apex'];

/**
 * Validates exercise log inputs
 */
export function validateExerciseLog(
  reps: number,
  weight: number,
  rpe: number,
  formRating: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (reps < 1 || reps > 100) errors.push('Reps must be between 1 and 100');
  if (weight < 0 || weight > 500) errors.push('Weight must be between 0 and 500 lbs');
  if (rpe < 1 || rpe > 10) errors.push('RPE must be between 1 and 10');
  if (formRating < 1 || formRating > 10) errors.push('Form rating must be between 1 and 10');

  return { valid: errors.length === 0, errors };
}

/**
 * Validates muscle group
 */
export function isValidMuscleGroup(muscle: string): muscle is MuscleGroup {
  return VALID_MUSCLE_GROUPS.includes(muscle as MuscleGroup);
}

/**
 * Validates tier
 */
export function isValidTier(tier: string): tier is UserTier {
  return VALID_TIERS.includes(tier as UserTier);
}

/**
 * Validates CNS score (0-100)
 */
export function validateCNSScore(score: number): boolean {
  return score >= 0 && score <= 100;
}
