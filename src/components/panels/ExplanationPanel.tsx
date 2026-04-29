"use client";

import { usePlaybackStore } from '../../store/playbackStore';

export function ExplanationPanel() {
  const { steps, currentStepIndex } = usePlaybackStore();

  if (steps.length === 0) {
    return (
      <div className="h-full flex flex-col p-6 text-center text-neutral-500 justify-center">
        <p>Generate a visualization to see step-by-step explanations.</p>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-neutral-800">
        <h2 className="text-lg font-bold text-white mb-1">Execution Trace</h2>
        <p className="text-sm text-neutral-400">Step {currentStepIndex + 1} of {steps.length}</p>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-neutral-800/50 rounded-xl p-5 border border-neutral-700/50 shadow-inner">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-1 text-xs font-bold rounded uppercase tracking-wider ${
              currentStep.type === 'call' ? 'bg-orange-500/20 text-orange-400' :
              currentStep.type === 'return' ? 'bg-green-500/20 text-green-400' :
              currentStep.type === 'memo-hit' ? 'bg-blue-500/20 text-blue-400' :
              'bg-neutral-500/20 text-neutral-400'
            }`}>
              {currentStep.type}
            </span>
            <span className="font-mono text-sm text-neutral-300">{currentStep.stateKey}</span>
          </div>
          
          <p className="text-neutral-200 text-lg font-medium leading-relaxed mb-4">
            {currentStep.explanation}
          </p>

          {currentStep.formula && (
            <div className="mt-4 p-4 bg-neutral-900 rounded-lg border border-neutral-800 font-mono text-sm text-orange-200 overflow-x-auto whitespace-nowrap">
              {currentStep.formula}
            </div>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Call Stack</h3>
          <div className="flex flex-col gap-2">
            {steps.slice(0, currentStepIndex + 1)
              .filter(s => s.type === 'call')
              .slice(-5) // show only last 5 calls to save space
              .map((step, idx) => {
                const isReturned = steps.slice(0, currentStepIndex + 1).some(s => s.type === 'return' && s.parentId === step.id);
                if (isReturned) return null; // already returned
                
                return (
                  <div key={step.id} className="text-sm font-mono flex items-center gap-3">
                    <span className="text-neutral-500">depth {step.depth}</span>
                    <span className={step.id === currentStep.id ? "text-orange-400 font-bold" : "text-neutral-300"}>
                      {step.stateKey}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
