/**
 * 360° Anatomical Dummy Display Component
 * Interactive muscle group feedback visualization
 */

import React, { useState } from 'react';
import type { MuscleGroup, DummyBioFeedback } from '@types/index';

interface DummyDisplayProps {
  onMuscleSelect?: (muscle: MuscleGroup) => void;
  selectedMuscles?: MuscleGroup[];
  isInteractive?: boolean;
}

const MUSCLE_COLORS: Record<MuscleGroup, string> = {
  chest: '#FF6B6B',
  back: '#4ECDC4',
  shoulders: '#45B7D1',
  biceps: '#96CEB4',
  triceps: '#FFEAA7',
  forearms: '#DDA15E',
  quadriceps: '#BC6C25',
  hamstrings: '#8E44AD',
  glutes: '#E74C3C',
  calves: '#3498DB',
  abs: '#F39C12',
  obliques: '#E67E22',
};

export const DummyDisplay: React.FC<DummyDisplayProps> = ({
  onMuscleSelect,
  selectedMuscles = [],
  isInteractive = true,
}) => {
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleGroup | null>(null);

  const handleMuscleClick = (muscle: MuscleGroup) => {
    if (isInteractive && onMuscleSelect) {
      onMuscleSelect(muscle);
    }
  };

  const muscleGroups: Array<{ name: MuscleGroup; label: string; position: string }> = [
    { name: 'chest', label: 'Chest', position: 'top-20 left-1/3' },
    { name: 'back', label: 'Back', position: 'top-20 right-1/3' },
    { name: 'shoulders', label: 'Shoulders', position: 'top-10 left-1/2' },
    { name: 'biceps', label: 'Biceps', position: 'top-32 left-1/4' },
    { name: 'triceps', label: 'Triceps', position: 'top-32 right-1/4' },
    { name: 'forearms', label: 'Forearms', position: 'top-48 left-1/4' },
    { name: 'abs', label: 'Abs', position: 'top-1/3 left-1/2' },
    { name: 'obliques', label: 'Obliques', position: 'top-1/2 left-2/3' },
    { name: 'quadriceps', label: 'Quads', position: 'top-2/3 left-1/3' },
    { name: 'hamstrings', label: 'Hamstrings', position: 'top-2/3 right-1/3' },
    { name: 'glutes', label: 'Glutes', position: 'top-1/2 left-1/2' },
    { name: 'calves', label: 'Calves', position: 'bottom-10 left-1/3' },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-gray-100 to-gray-50 p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Muscle Groups</h2>

      <div className="relative w-full max-w-xs h-96 bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Human figure outline */}
        <svg className="w-full h-full" viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="40" r="15" fill="#E8E8E8" stroke="#999" strokeWidth="1" />
          <rect x="85" y="60" width="30" height="80" fill="#F0F0F0" stroke="#999" strokeWidth="1" />
          <rect x="50" y="75" width="30" height="60" fill="#F0F0F0" stroke="#999" strokeWidth="1" />
          <rect x="120" y="75" width="30" height="60" fill="#F0F0F0" stroke="#999" strokeWidth="1" />
          <rect x="80" y="150" width="20" height="100" fill="#F0F0F0" stroke="#999" strokeWidth="1" />
          <rect x="100" y="150" width="20" height="100" fill="#F0F0F0" stroke="#999" strokeWidth="1" />
        </svg>

        {/* Interactive muscle buttons */}
        {muscleGroups.map((muscle) => (
          <button
            key={muscle.name}
            onClick={() => handleMuscleClick(muscle.name)}
            onMouseEnter={() => setHoveredMuscle(muscle.name)}
            onMouseLeave={() => setHoveredMuscle(null)}
            className={`absolute w-12 h-12 rounded-full transition-all ${
              isInteractive ? 'cursor-pointer hover:scale-125' : ''
            } ${
              selectedMuscles.includes(muscle.name)
                ? 'ring-2 ring-offset-2 ring-blue-500 scale-110'
                : ''
            }`}
            style={{
              backgroundColor: MUSCLE_COLORS[muscle.name],
              opacity: hoveredMuscle === muscle.name ? 0.8 : 0.6,
            }}
            title={muscle.label}
          />
        ))}
      </div>

      {selectedMuscles.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Selected: <span className="font-semibold">{selectedMuscles.join(', ')}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default DummyDisplay;
