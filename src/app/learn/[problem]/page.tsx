"use client";

import { useParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { fibonacciProblem } from '../../../modules/fibonacci';
import { climbingStairsProblem } from '../../../modules/climbing-stairs';
import { usePlaybackStore } from '../../../store/playbackStore';
import { PlaybackControls } from '../../../components/controls/PlaybackControls';
import { TreeRenderer } from '../../../components/visualizers/TreeRenderer';
import { TabulationView } from '../../../components/visualizers/TabulationView';
import { ExplanationPanel } from '../../../components/panels/ExplanationPanel';
import Link from 'next/link';

export default function LearnProblemPage() {
  const params = useParams();
  const problemId = params?.problem as string;

  const problem = useMemo(() => {
    if (problemId === 'fibonacci') return fibonacciProblem;
    if (problemId === 'climbing-stairs') return climbingStairsProblem;
    return null;
  }, [problemId]);

  const [inputVal, setInputVal] = useState<string>("5");
  const { setSteps, reset, steps, currentStepIndex, visualizationMode, setVisualizationMode } = usePlaybackStore();

  useEffect(() => {
    if (problem) {
      handleGenerate();
    }
  }, [problem]);

  const handleGenerate = () => {
    if (!problem) return;
    const val = parseInt(inputVal, 10);
    if (isNaN(val) || val < 0) return;
    
    if (!problem.maxTreeInputRule({ n: val })) {
      alert("Input too large for MVP visualization tree.");
      return;
    }
    
    const generatedSteps = problem.generateSteps({ n: val });
    reset();
    setSteps(generatedSteps);
  };

  // Compute metrics based on currently visible steps up to currentStepIndex
  const visibleSteps = steps.slice(0, currentStepIndex + 1);
  const totalVisited = visibleSteps.filter(s => s.type === 'call').length;
  const repeated = visibleSteps.filter(s => s.type === 'memo-hit').length;
  const baseCases = visibleSteps.filter(s => s.type === 'return' && s.explanation.includes('Base case')).length;

  if (!problem) {
    return <div className="p-8 text-black bg-white min-h-screen">Problem not found.</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-[#fafafa] text-gray-900 font-sans overflow-hidden">
      {/* Top Header & Metrics Area */}
      <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-500 hover:text-black transition-colors font-medium text-sm">
            &larr; Explorer
          </Link>
          <div className="h-6 w-px bg-gray-200"></div>
          <h1 className="text-lg font-semibold text-gray-900">{problem.title}</h1>
        </div>

        {/* View Mode Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-sm border border-gray-200">
          {(['tree', 'dag', 'table'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setVisualizationMode(mode)}
              className={`px-4 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm transition-all ${
                visualizationMode === mode 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Subproblems</span>
            <span className="text-sm font-mono font-medium text-black">{totalVisited}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Repeated</span>
            <span className="text-sm font-mono font-medium text-[#0ea5e9]">{repeated}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Base Cases</span>
            <span className="text-sm font-mono font-medium text-[#22c55e]">{baseCases}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Canvas Area */}
        <main className="flex-1 relative overflow-hidden bg-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
          <div className="relative w-full h-full z-0">
            {visualizationMode === 'table' ? <TabulationView /> : <TreeRenderer />}
          </div>
          <PlaybackControls />
        </main>

        {/* Right Side Panel: Controls & Explanations */}
        <aside className="w-96 border-l border-gray-200 bg-[#fbfbfb] flex flex-col shadow-[-4px_0_15px_rgba(0,0,0,0.02)] z-10 shrink-0">
          <div className="p-6 border-b border-gray-200 bg-white">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Input Setup</h3>
            {problem.inputSchema.map(field => (
              <div key={field.name} className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-600 w-8">{field.label}</label>
                <input 
                  type={field.type} 
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  min={field.min}
                  max={field.max}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-sm px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400 focus:bg-white transition-colors text-black"
                />
                <button 
                  onClick={handleGenerate}
                  className="bg-black hover:bg-gray-800 text-white text-sm font-medium py-1.5 px-4 rounded-sm transition-colors"
                >
                  Run
                </button>
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto bg-[#fbfbfb]">
            <ExplanationPanel problem={problem} />
          </div>
        </aside>
      </div>
    </div>
  );
}
