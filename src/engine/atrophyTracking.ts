/**
 * Atrophy Tracking Engine - Enforces consistency through decay mechanics
 * Monitors time since last training per muscle group
 */

import type { AtrophyTracker, MuscleGroup } from '@types/index';

const ATROPHY_WARNING_DAYS = 5;
const ATROPHY_CRITICAL_DAYS = 10;

/**
 * Calculates decay percentage for a muscle group based on days since training
 */
export function calculateDecayPercentage(daysSinceTraining: number): number {
  if (daysSinceTraining < ATROPHY_WARNING_DAYS) return 0;

  const excessDays = daysSinceTraining - ATROPHY_WARNING_DAYS;
  const decayPercent = Math.min(100, excessDays * 5);

  return decayPercent;
}

/**
 * Creates or updates atrophy tracker entry
 */
export function updateAtrophyStatus(
  userId: string,
  muscleGroup: MuscleGroup,
  lastTrainedDate: string
): AtrophyTracker {
  const now = new Date();
  const lastTrained = new Date(lastTrainedDate);
  const daysSince = Math.floor((now.getTime() - lastTrained.getTime()) / (1000 * 60 * 60 * 24));
  const decayPercent = calculateDecayPercentage(daysSince);
  const isCritical = daysSince >= ATROPHY_CRITICAL_DAYS;

  return {
    id: `atrophy_${userId}_${muscleGroup}_${Date.now()}`,
    user_id: userId,
    muscle_group: muscleGroup,
    last_trained_at: lastTrainedDate,
    days_since_last_training: daysSince,
    decay_percentage: decayPercent,
    critical_warning: isCritical,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Calculates rank point deduction based on atrophy
 */
export function calculateAtrophyPointDeduction(muscleGroups: AtrophyTracker[]): number {
  return muscleGroups.reduce((total, tracker) => {
    const pointLoss = tracker.decay_percentage * 0.5;
    return total + pointLoss;
  }, 0);
}

/**
 * Generates warning message for critical atrophy
 */
export function getAtrophyWarning(atrophyTracker: AtrophyTracker): string | null {
  if (!atrophyTracker.critical_warning) return null;

  return `🔔 ${atrophyTracker.muscle_group.toUpperCase()} is ATROPHYING! Haven't trained in ${atrophyTracker.days_since_last_training} days. Train now to preserve rank.`;
}
