/**
 * CNS Fatigue Gauge - Neural fatigue monitoring and recovery estimation
 * Tracks cumulative intensity and suggests recovery windows
 */

import type { ExerciseLog, WorkoutSession } from '@types/index';

const CNS_RECOVERY_RATE = 0.85;
const MAX_CNS_SCORE = 100;
const CRITICAL_THRESHOLD = 75;
const FATIGUE_THRESHOLD = 50;

interface CNSCalculationParams {
  sessionRPE: number;
  sessionDurationMinutes: number;
  previousCNSScore: number;
  hoursSinceLastSession: number;
}

/**
 * Calculates CNS fatigue score based on workout intensity and recovery time
 */
export function calculateCNSFatigue(params: CNSCalculationParams): number {
  const { sessionRPE, sessionDurationMinutes, previousCNSScore, hoursSinceLastSession } = params;

  const sessionFatigueLoad = (sessionRPE / 10) * (sessionDurationMinutes / 60) * 100;
  const recoveryFactor = Math.pow(CNS_RECOVERY_RATE, hoursSinceLastSession);
  const recoveredScore = previousCNSScore * recoveryFactor;

  let newCNS = recoveredScore + sessionFatigueLoad * 0.3;

  return Math.min(MAX_CNS_SCORE, Math.max(0, newCNS));
}

/**
 * Estimates recovery time needed to reach acceptable CNS level
 */
export function estimateRecoveryTime(currentCNSScore: number): number {
  if (currentCNSScore <= FATIGUE_THRESHOLD) return 0;

  const targetScore = FATIGUE_THRESHOLD;
  const hoursNeeded = Math.log(targetScore / currentCNSScore) / Math.log(CNS_RECOVERY_RATE);

  return Math.max(0, Math.ceil(hoursNeeded));
}

/**
 * Provides recovery recommendation
 */
export function getRecoveryRecommendation(
  cnsScore: number
): { status: 'rested' | 'fatigued' | 'critical'; message: string; recoveryHours: number } {
  if (cnsScore < FATIGUE_THRESHOLD) {
    return {
      status: 'rested',
      message: '✅ CNS fully recovered. Ready for intense training.',
      recoveryHours: 0,
    };
  }

  if (cnsScore < CRITICAL_THRESHOLD) {
    const recoveryHours = estimateRecoveryTime(cnsScore);
    return {
      status: 'fatigued',
      message: `⚠️ CNS fatigued. Consider lighter session. Full recovery in ~${recoveryHours}h.`,
      recoveryHours,
    };
  }

  const recoveryHours = estimateRecoveryTime(cnsScore);
  return {
    status: 'critical',
    message: `🚨 CRITICAL CNS FATIGUE. Take 24h+ rest. Recovery needed: ~${recoveryHours}h.`,
    recoveryHours,
  };
}
