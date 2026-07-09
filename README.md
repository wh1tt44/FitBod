# FitBod - AI-Powered Fitness Training Platform

## Overview

**FitBod** is a gamified fitness platform that combines adaptive AI algorithms with strict gamification mechanics to enforce consistent training discipline.

### Core Features

- **🎮 Tier Ranking System**: 6-tier hierarchy (Inert → Apex) with point-based progression and decay
- **⚡ CNS Fatigue Tracking**: Monitors central nervous system fatigue and suggests recovery windows
- **🔄 Adaptive Engine**: AI-driven plateau detection, automatic deloads, and ghost routines
- **💪 Atrophy Decay**: Enforces consistency through muscle group decay mechanics
- **🎯 360° Dummy Display**: Interactive anatomical feedback visualization
- **📊 Real-time Analytics**: Comprehensive workout tracking and bio-feedback

## Technology Stack

- **Frontend**: React Native / Expo (TypeScript)
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS
- **Type Safety**: Strict TypeScript with custom types

## Project Structure

```
FitBod/
├── src/
│   ├── types/           # Core type definitions
│   ├── stores/          # Zustand stores (profile, workout, rank, adaptive)
│   ├── engine/          # Adaptive algorithms
│   │   ├── cnsFatigue.ts
│   │   ├── plateauDetection.ts
│   │   ├── atrophyTracking.ts
│   │   └── ghostRoutine.ts
│   ├── utils/           # Helpers (supabase, validators, dates)
│   ├── components/      # React components
│   ├── schema/          # Database migrations
│   └── App.tsx          # Main entry point
├── app.json             # Expo configuration
├── tailwind.config.js   # Tailwind styling
├── tsconfig.json        # TypeScript config
├── package.json         # Dependencies
└── README.md            # Documentation
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account

### Installation

```bash
npm install
```

### Environment Setup

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Fill in your Supabase credentials:
```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://...
```

### Running Locally

```bash
npm start
```

For web:
```bash
npm run web
```

## Database Schema

Initialize the database with migrations:

```bash
npm run migrate
```

Key tables:
- `user_profiles` - User tier, points, streak
- `workout_sessions` - Session metadata
- `exercise_logs` - Individual exercise records
- `plateau_detections` - Plateau tracking
- `atrophy_trackers` - Muscle decay status
- `cns_fatigue_logs` - CNS fatigue history

## Tier System

| Tier | Points | Decay |
|------|--------|-------|
| Inert | 0-249 | 2% per day inactive |
| Kinetic | 250-599 | 3% per day inactive |
| Active | 600-1199 | 4% per day inactive |
| Structural | 1200-1999 | 5% per day inactive |
| Elite | 2000-3499 | 6% per day inactive |
| Apex | 3500+ | 7% per day inactive |

## API Reference

### Stores

All stores use Zustand and follow the same pattern:

```typescript
import { useProfileStore } from '@stores/profileStore';

const { profile, updateTier } = useProfileStore();
```

### Engine Functions

```typescript
import { calculateCNSFatigue, getRecoveryRecommendation } from '@engine/cnsFatigue';
import { detectPlateau } from '@engine/plateauDetection';
import { calculateDecayPercentage } from '@engine/atrophyTracking';
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: d.whittington.work@gmail.com

---

**Built with discipline. Designed for progress.**
