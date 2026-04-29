import { create } from 'zustand';
import { StepEvent } from '../engine/types';

interface PlaybackState {
  steps: StepEvent[];
  currentStepIndex: number;
  isPlaying: boolean;
  speedMs: number;
  visualizationMode: 'tree' | 'dag' | 'table';
  setVisualizationMode: (mode: 'tree' | 'dag' | 'table') => void;
  setSteps: (steps: StepEvent[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (index: number) => void;
  togglePlay: () => void;
  setSpeed: (ms: number) => void;
  reset: () => void;
}

export const usePlaybackStore = create<PlaybackState>((set) => ({
  steps: [],
  currentStepIndex: 0,
  isPlaying: false,
  speedMs: 2000,
  visualizationMode: 'tree',
  setVisualizationMode: (mode) => set({ visualizationMode: mode }),
  setSteps: (steps) => set({ steps, currentStepIndex: 0, isPlaying: false }),
  nextStep: () =>
    set((state) => ({
      currentStepIndex: Math.min(state.currentStepIndex + 1, state.steps.length - 1),
      isPlaying: state.currentStepIndex + 1 >= state.steps.length - 1 ? false : state.isPlaying
    })),
  prevStep: () =>
    set((state) => ({
      currentStepIndex: Math.max(state.currentStepIndex - 1, 0),
    })),
  setStep: (index) =>
    set((state) => ({
      currentStepIndex: Math.max(0, Math.min(index, state.steps.length - 1)),
    })),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSpeed: (speedMs) => set({ speedMs }),
  reset: () => set({ currentStepIndex: 0, isPlaying: false }),
}));
