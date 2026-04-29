"use client";

import { usePlaybackStore } from '../../store/playbackStore';
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

export function PlaybackControls() {
  const { 
    currentStepIndex, 
    steps, 
    isPlaying, 
    speedMs, 
    togglePlay, 
    nextStep, 
    prevStep, 
    setStep,
    reset,
    setSpeed
  } = usePlaybackStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        nextStep();
      }, speedMs);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speedMs, nextStep]);

  if (steps.length === 0) return null;

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-full px-6 py-3 flex items-center gap-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] z-20">
      <div className="flex items-center gap-2">
        <button onClick={reset} className="p-2 text-gray-400 hover:text-black transition-colors" title="Reset">
          <RotateCcw size={18} />
        </button>
        <button onClick={prevStep} className="p-2 text-gray-400 hover:text-black transition-colors" title="Previous Step">
          <SkipBack size={18} />
        </button>
        <button onClick={togglePlay} className="p-3 bg-[#ef4444] hover:bg-red-600 text-white rounded-full transition-colors mx-2 shadow-[0_2px_10px_rgba(239,68,68,0.3)]" title={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
        </button>
        <button onClick={nextStep} className="p-2 text-gray-400 hover:text-black transition-colors" title="Next Step">
          <SkipForward size={18} />
        </button>
      </div>

      <div className="w-px h-8 bg-gray-200"></div>

      <div className="flex flex-col gap-1 w-48">
        <div className="flex justify-between text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
          <span>Step {currentStepIndex + 1}</span>
          <span>{steps.length}</span>
        </div>
        <input 
          type="range" 
          min={0} 
          max={Math.max(0, steps.length - 1)} 
          value={currentStepIndex}
          onChange={(e) => {
            if (isPlaying) togglePlay();
            setStep(parseInt(e.target.value, 10));
          }}
          className="w-full accent-[#ef4444] h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div className="w-px h-8 bg-gray-200"></div>
      
      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
        <span>Speed:</span>
        <select 
          value={speedMs} 
          onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
          className="bg-transparent border-none focus:outline-none cursor-pointer hover:text-black transition-colors font-mono"
        >
          <option value={2000}>0.5x</option>
          <option value={1000}>1.0x</option>
          <option value={500}>2.0x</option>
          <option value={250}>4.0x</option>
        </select>
      </div>
    </div>
  );
}
