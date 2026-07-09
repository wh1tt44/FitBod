/**
 * App Entry Point
 * Main React component with router and state initialization
 */

import React, { useEffect } from 'react';
import { useProfileStore } from '@stores/profileStore';
import { useWorkoutStore } from '@stores/workoutStore';
import { useRankStore } from '@stores/rankStore';
import { useAdaptiveStore } from '@stores/adaptiveStore';
import { supabase } from '@utils/supabaseClient';
import DummyDisplay from '@components/DummyDisplay';

export const App: React.FC = () => {
  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);
  const engineState = useAdaptiveStore((state) => state.getEngineState());

  useEffect(() => {
    // Initialize app: load user profile from Supabase
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (userProfile) {
          setProfile(userProfile);
        }
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">⚡ FITBOD</h1>
          <p className="text-xl text-gray-300 mb-8">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-black bg-opacity-50 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">⚡ FITBOD</h1>
          <div className="flex gap-4">
            <span className="text-lg font-semibold">{profile.current_tier}</span>
            <span className="text-yellow-400">◆ {profile.tier_points}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 py-8">
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tier Card */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-4">Current Rank</h2>
            <p className="text-4xl font-bold mb-2">{profile.current_tier}</p>
            <p className="text-gray-200 mb-4">Points: {profile.tier_points}</p>
            <div className="w-full bg-black bg-opacity-30 rounded-full h-3">
              <div
                className="bg-yellow-400 h-full rounded-full"
                style={{
                  width: `${useRankStore.getState().getTierProgression()}%`,
                }}
              />
            </div>
          </div>

          {/* CNS Status Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-4">CNS Status</h2>
            <p className="text-4xl font-bold mb-2">{engineState.cns_fatigue_score.toFixed(1)}</p>
            <p className="text-gray-200">{engineState.overall_recovery_status.toUpperCase()}</p>
          </div>

          {/* Workout Stats */}
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-4">Workout Stats</h2>
            <p className="text-4xl font-bold mb-2">{profile.total_workouts}</p>
            <p className="text-gray-200">Total Workouts | Streak: {profile.streak_days}d</p>
          </div>
        </div>

        {/* Anatomical Dummy */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <DummyDisplay isInteractive={true} />
        </div>

        {/* Active Plateaus */}
        {engineState.active_plateaus.length > 0 && (
          <div className="mt-8 bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-400 mb-4">🔴 Active Plateaus</h2>
            <ul className="space-y-2">
              {engineState.active_plateaus.map((plateau) => (
                <li key={plateau.id} className="text-red-300">
                  {plateau.muscle_group}: {plateau.days_since_last_progress} days without progress
                  → <span className="font-bold">{plateau.suggested_action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
