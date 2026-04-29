"use client";

import { usePlaybackStore } from '../../store/playbackStore';

export function ExplanationPanel({ problem }: { problem: any }) {
  const { steps, currentStepIndex } = usePlaybackStore();

  if (steps.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 text-sm leading-relaxed mt-10">
        Waiting for execution to start.<br/> Adjust inputs and click <strong className="text-gray-800">Run</strong>.
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  const visibleSteps = steps.slice(0, currentStepIndex + 1);

  return (
    <div className="flex flex-col h-full bg-[#fbfbfb]">
      <div className="p-6 border-b border-gray-200 bg-white">
        <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-1">Recurrence Derivation</h2>
        <p className="text-xs text-gray-500">Step {currentStepIndex + 1} of {steps.length}</p>
      </div>
      
      <div className="p-6 space-y-6">
        
        {/* Current State Definition */}
        <div className="bg-white rounded-md border border-gray-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Current State</span>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-sm uppercase tracking-wider ${
              currentStep.type === 'call' ? 'bg-red-50 text-red-600 border border-red-100' :
              currentStep.type === 'return' ? 'bg-green-50 text-green-600 border border-green-100' :
              currentStep.type === 'memo-hit' ? 'bg-sky-50 text-sky-600 border border-sky-100' :
              'bg-gray-100 text-gray-500'
            }`}>
              {currentStep.type}
            </span>
          </div>
          
          <div className="font-mono text-lg font-medium text-black mb-2">
            {currentStep.stateKey}
          </div>
          
          <p className="text-sm text-gray-600 leading-relaxed">
            {currentStep.explanation}
          </p>

          {currentStep.formula && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold block mb-2">Formula</span>
              <div className="font-mono text-sm text-[#ef4444] bg-red-50/50 p-3 rounded-sm border border-red-100/50 overflow-x-auto whitespace-nowrap">
                {currentStep.formula}
              </div>
            </div>
          )}
        </div>

        {/* Memoization Cache */}
        {visibleSteps.some(s => s.type === 'memo-hit' || (s.type === 'return' && s.value !== undefined)) && (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Memoization Cache</h3>
            <div className="bg-white border border-gray-200 rounded-md p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100 text-left">
                    <th className="pb-2 font-normal">State</th>
                    <th className="pb-2 font-normal">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(new Set(visibleSteps.filter(s => s.type === 'memo-hit' || s.type === 'return').map(s => s.stateKey)))
                    .sort()
                    .map(key => {
                      const stepWithVal = visibleSteps.find(s => s.stateKey === key && s.value !== undefined);
                      if (!stepWithVal) return null;
                      return (
                        <tr key={key} className="border-b border-gray-50 last:border-0">
                          <td className="py-2 text-gray-600">{key}</td>
                          <td className="py-2 text-[#22c55e] font-bold">{stepWithVal.value}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Call Stack / Ancestry */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Call Stack</h3>
          <div className="bg-white border border-gray-200 rounded-md p-4 flex flex-col gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            {steps.slice(0, currentStepIndex + 1)
              .filter(s => s.type === 'call')
              .slice(-5)
              .map((step, idx) => {
                const isReturned = steps.slice(0, currentStepIndex + 1).some(s => s.type === 'return' && s.parentId === step.id);
                if (isReturned) return null;
                
                const isCurrent = step.id === currentStep.id;
                
                return (
                  <div key={step.id} className="flex items-center gap-3 text-sm">
                    <span className="text-gray-400 font-mono text-xs w-16">depth {step.depth}</span>
                    <span className={`font-mono ${isCurrent ? "text-[#ef4444] font-semibold" : "text-gray-600"}`}>
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
