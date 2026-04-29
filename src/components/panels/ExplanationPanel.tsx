"use client";

import { usePlaybackStore } from '../../store/playbackStore';
import Link from 'next/link';

export function ExplanationPanel({ problem }: { problem: any }) {
  const { steps, currentStepIndex } = usePlaybackStore();

  const currentStep = steps[currentStepIndex];
  const visibleSteps = steps.slice(0, currentStepIndex + 1);

  return (
    <div className="flex flex-col h-full bg-[#fbfbfb]">
      <div className="p-6 border-b border-gray-200 bg-white">
        <Link href="/" className="text-gray-400 hover:text-black transition-colors font-medium text-xs flex items-center gap-2 mb-6">
          &larr; Back to Explorer
        </Link>
        <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-1">Instructor Walkthrough</h2>
        <p className="text-xs text-gray-500 font-mono">Step {currentStepIndex + 1} of {steps.length}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
        
        {/* Rules to Write Recurrence (Teacher's Checklist) */}
        <div className="relative p-6 border border-gray-200 rounded-md bg-white shadow-sm">
          <div className="absolute -top-2.5 left-4 px-2 bg-white text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-200 rounded-sm">
            Rules to write
          </div>
          <ul className="space-y-4 text-xs">
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">1</span>
              <span className="text-gray-600 leading-tight">Define the <span className="text-black font-semibold underline decoration-red-200 decoration-2 underline-offset-2">State</span> clearly (what do parameters represent?).</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">2</span>
              <span className="text-gray-600 leading-tight">Explore all <span className="text-black font-semibold underline decoration-red-200 decoration-2 underline-offset-2">Possibilities</span> from that state.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">3</span>
              <span className="text-gray-600 leading-tight">Take the <span className="text-black font-semibold underline decoration-red-200 decoration-2 underline-offset-2">Best/Sum</span> among all decisions.</span>
            </li>
          </ul>
        </div>

        {/* Step 2: Semantic Meaning */}
        <div className="space-y-3">
           <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Define the state:</h3>
           <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm text-sm leading-relaxed text-gray-600">
              <p className="flex items-center gap-2 mb-2">
                <span className="font-mono text-black font-bold">f(</span>
                <span className="bg-red-50 text-red-600 px-2 rounded-sm border border-red-100">ind</span>
                <span className="font-mono text-black font-bold">, ... )</span>
              </p>
              <p className="text-xs text-gray-500 italic leading-relaxed">
                "{problem.inputMeaning}"
              </p>
           </div>
        </div>
        
        {/* Step 3: Current Thinking Item */}
        {steps.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white rounded-md border border-gray-200 p-5 shadow-[0_4px_12px_rgba(0,0,0,0.03)] relative overflow-hidden transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-gray-900">
                    {currentStep.stateKey}
                  </span>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded-sm uppercase tracking-wider ${
                    currentStep.type === 'call' ? 'bg-red-50 text-red-600 border border-red-100' :
                    currentStep.type === 'return' ? 'bg-green-50 text-green-600 border border-green-100' :
                    'bg-sky-50 text-sky-600 border border-sky-100'
                  }`}>
                    {currentStep.type}
                  </span>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {currentStep.explanation}
                  </p>

                  {/* Visual Choice Cards */}
                  {currentStep.choices && (
                    <div className="grid grid-cols-1 gap-3 py-2">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available Choices</h4>
                      {currentStep.choices.map((choice, i) => (
                        <div key={i} className="border border-gray-100 bg-gray-50/50 p-3 rounded-md hover:border-gray-300 transition-colors">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-black">{choice.label}</span>
                            <span className="text-[9px] font-medium bg-white px-1.5 py-0.5 rounded border border-gray-200">{choice.impact}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 leading-tight mb-1">{choice.description}</p>
                          <p className="text-[10px] text-gray-400 italic">Next: {choice.nextState}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentStep.decisionLogic && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 underline decoration-gray-200 underline-offset-4">The Logic</span>
                      <p className="text-[11px] text-gray-500 whitespace-pre-line leading-relaxed italic">
                        {currentStep.decisionLogic}
                      </p>
                    </div>
                  )}

                  {currentStep.formula && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Derived Recurrence:</span>
                      <div className="font-mono text-[11px] text-[#ef4444] bg-red-50/50 p-3 rounded-sm border border-red-100/50 overflow-x-auto whitespace-nowrap">
                        {currentStep.formula}
                      </div>
                    </div>
                  )}
                </div>
             </div>
          </div>
        )}

        {/* Memoization Progress */}
        {visibleSteps.some(s => s.value !== undefined) && (
          <div className="space-y-4">
             <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Memoized Answers:</h3>
             <div className="grid grid-cols-2 gap-2">
                {Array.from(new Set(visibleSteps.filter(s => s.value !== undefined).map(s => s.stateKey)))
                  .slice(-6)
                  .map(key => (
                    <div key={key} className="bg-white border border-gray-100 rounded-sm p-3 flex justify-between items-center shadow-sm">
                       <span className="text-[10px] font-mono text-gray-400">{key}</span>
                       <span className="text-xs font-bold text-[#22c55e]">{visibleSteps.find(s => s.stateKey === key)?.value}</span>
                    </div>
                  ))}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
