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
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 border border-neutral-800 rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl z-20">
      <div className="flex items-center gap-2">
        <button onClick={reset} className="p-2 text-neutral-400 hover:text-white transition-colors" title="Reset">
          <RotateCcw size={20} />
        </button>
        <button onClick={prevStep} className="p-2 text-neutral-400 hover:text-white transition-colors" title="Previous Step">
          <SkipBack size={20} />
        </button>
        <button onClick={togglePlay} className="p-3 bg-orange-600 hover:bg-orange-500 text-white rounded-full transition-colors mx-2 shadow-lg shadow-orange-500/20" title={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
        <button onClick={nextStep} className="p-2 text-neutral-400 hover:text-white transition-colors" title="Next Step">
          <SkipForward size={20} />
        </button>
      </div>

      <div className="w-px h-8 bg-neutral-800"></div>

      <div className="flex flex-col gap-1 w-48">
        <div className="flex justify-between text-xs text-neutral-500 font-medium">
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
          className="w-full accent-orange-500 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      <div className="w-px h-8 bg-neutral-800"></div>
      
      <div className="flex items-center gap-2 text-sm text-neutral-400">
        <span className="font-medium">Speed:</span>
        <select 
          value={speedMs} 
          onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
          className="bg-transparent border-none focus:outline-none cursor-pointer hover:text-white transition-colors"
        >
          <option className="bg-neutral-900" value={2000}>0.5x</option>
          <option className="bg-neutral-900" value={1000}>1x</option>
          <option className="bg-neutral-900" value={500}>2x</option>
          <option className="bg-neutral-900" value={250}>4x</option>
        </select>
      </div>
    </div>
  );
}
