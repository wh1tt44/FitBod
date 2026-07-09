-- FitBod Database Schema
-- PostgreSQL initialization script

-- ============================================================================
-- USER & PROFILE
-- ============================================================================

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  current_tier VARCHAR(20) DEFAULT 'Inert',
  tier_points INTEGER DEFAULT 0,
  total_workouts INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_workout_at TIMESTAMP
);

-- ============================================================================
-- EXERCISES & WORKOUTS
-- ============================================================================

CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  target_muscle VARCHAR(50) NOT NULL,
  secondary_muscles TEXT[],
  difficulty VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_date DATE NOT NULL,
  duration_minutes INTEGER,
  total_volume DECIMAL(10, 2),
  avg_rpe DECIMAL(3, 1),
  overall_cns_fatigue DECIMAL(5, 2),
  mood_rating INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id)
);

CREATE TABLE exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  exercise_id UUID NOT NULL,
  workout_session_id UUID NOT NULL,
  reps INTEGER,
  weight DECIMAL(10, 2),
  rpe INTEGER,
  cns_fatigue_score DECIMAL(5, 2),
  form_rating INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id),
  FOREIGN KEY (exercise_id) REFERENCES exercises(id),
  FOREIGN KEY (workout_session_id) REFERENCES workout_sessions(id)
);

-- ============================================================================
-- CNS FATIGUE
-- ============================================================================

CREATE TABLE cns_fatigue_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_id UUID NOT NULL,
  intensity_level INTEGER,
  estimated_recovery_hours INTEGER,
  recovery_completed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id),
  FOREIGN KEY (session_id) REFERENCES workout_sessions(id)
);

-- ============================================================================
-- PLATEAU & ADAPTIVE ENGINE
-- ============================================================================

CREATE TABLE plateau_detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  muscle_group VARCHAR(50) NOT NULL,
  days_since_last_progress INTEGER,
  last_max_weight DECIMAL(10, 2),
  current_max_weight DECIMAL(10, 2),
  suggested_action VARCHAR(50),
  action_applied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id)
);

CREATE TABLE deload_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  muscle_group VARCHAR(50) NOT NULL,
  start_date DATE,
  end_date DATE,
  weight_reduction_percent INTEGER,
  reason TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id)
);

-- ============================================================================
-- ATROPHY TRACKING
-- ============================================================================

CREATE TABLE atrophy_trackers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  muscle_group VARCHAR(50) NOT NULL,
  last_trained_at TIMESTAMP,
  days_since_last_training INTEGER,
  decay_percentage DECIMAL(5, 2),
  critical_warning BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id)
);

CREATE TABLE rank_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  previous_tier VARCHAR(20),
  new_tier VARCHAR(20),
  points_change INTEGER,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id)
);

-- ============================================================================
-- GHOST ROUTINE
-- ============================================================================

CREATE TABLE ghost_routine_swaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  workout_session_id UUID NOT NULL,
  original_exercise_id UUID NOT NULL,
  suggested_exercise_id UUID NOT NULL,
  equivalence_score DECIMAL(3, 2),
  reason TEXT,
  applied BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id),
  FOREIGN KEY (workout_session_id) REFERENCES workout_sessions(id),
  FOREIGN KEY (original_exercise_id) REFERENCES exercises(id),
  FOREIGN KEY (suggested_exercise_id) REFERENCES exercises(id)
);

-- ============================================================================
-- BIO-FEEDBACK
-- ============================================================================

CREATE TABLE bio_feedback_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_log_id UUID NOT NULL,
  felt_muscle VARCHAR(50),
  target_muscle VARCHAR(50),
  accuracy DECIMAL(3, 2),
  feedback_cues TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exercise_log_id) REFERENCES exercise_logs(id)
);

CREATE TABLE dummy_bio_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  exercise_log_id UUID NOT NULL,
  tap_points JSONB,
  total_feedback_points INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(user_id),
  FOREIGN KEY (exercise_log_id) REFERENCES exercise_logs(id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX idx_workout_sessions_date ON workout_sessions(session_date);
CREATE INDEX idx_exercise_logs_user_id ON exercise_logs(user_id);
CREATE INDEX idx_exercise_logs_session ON exercise_logs(workout_session_id);
CREATE INDEX idx_plateau_detections_user ON plateau_detections(user_id);
CREATE INDEX idx_atrophy_trackers_user ON atrophy_trackers(user_id);
CREATE INDEX idx_cns_fatigue_logs_user ON cns_fatigue_logs(user_id);
CREATE INDEX idx_rank_history_user ON rank_history(user_id);

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Insert sample exercises
INSERT INTO exercises (name, target_muscle, secondary_muscles, difficulty) VALUES
  ('Barbell Bench Press', 'chest', ARRAY['triceps', 'shoulders'], 'compound'),
  ('Barbell Squat', 'quadriceps', ARRAY['glutes', 'hamstrings'], 'compound'),
  ('Deadlift', 'back', ARRAY['glutes', 'hamstrings'], 'compound'),
  ('Dumbbell Curl', 'biceps', ARRAY['forearms'], 'isolation'),
  ('Tricep Dips', 'triceps', ARRAY['chest', 'shoulders'], 'compound'),
  ('Leg Press', 'quadriceps', ARRAY['glutes'], 'compound'),
  ('Pull-ups', 'back', ARRAY['biceps'], 'compound'),
  ('Shoulder Press', 'shoulders', ARRAY['triceps'], 'compound');
