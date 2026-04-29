"use client";

import { usePlaybackStore } from '../../store/playbackStore';

export function TabulationView() {
  const { steps, currentStepIndex } = usePlaybackStore();

  const visibleSteps = steps.slice(0, currentStepIndex + 1);
  const memoStates = Array.from(new Set(visibleSteps.filter(s => s.type === 'memo-hit' || s.type === 'return').map(s => s.stateKey)));
  
  // Extract numeric values from state keys like "F(5)"
  const solvedValues = new Map<number, number>();
  visibleSteps.forEach(s => {
    if (s.value !== undefined) {
      const match = s.stateKey.match(/\d+/);
      if (match) {
        solvedValues.set(parseInt(match[0]), s.value);
      }
    }
  });

  // Find max N from steps
  let maxN = 0;
  steps.forEach(s => {
    const match = s.stateKey.match(/\d+/);
    if (match) maxN = Math.max(maxN, parseInt(match[0]));
  });

  const tableIndices = Array.from({ length: maxN + 1 }, (_, i) => i);

  return (
    <div className="h-full flex flex-col items-center justify-center p-12">
      <div className="text-center mb-10">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2">Bottom-Up Tabulation</h3>
        <p className="text-xs text-gray-500 max-w-md">The DP table stores results for each subproblem index, filling from left to right (base cases first).</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4">
        {tableIndices.map(i => {
          const val = solvedValues.get(i);
          const isSolved = val !== undefined;
          
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono text-gray-400">i={i}</span>
              <div className={`w-16 h-16 border-2 flex items-center justify-center rounded-sm font-mono font-bold transition-all duration-500 ${
                isSolved 
                  ? 'bg-white border-[#22c55e] text-black shadow-sm' 
                  : 'bg-gray-50 border-gray-100 text-gray-200'
              }`}>
                {isSolved ? val : '?'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 p-6 bg-gray-50 border border-gray-100 rounded-sm text-sm text-gray-600 max-w-lg leading-relaxed">
        <strong className="text-black">Intuition:</strong> In tabulation, we don't use a call stack. We simply iterate through the array and fill each cell using the values from previously computed cells.
        <div className="mt-2 font-mono text-[11px] bg-white p-3 border border-gray-100 text-[#ef4444]">
          dp[i] = dp[i-1] + dp[i-2]
        </div>
      </div>
    </div>
  );
}
