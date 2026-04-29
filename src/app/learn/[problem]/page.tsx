"use client";

import { useParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { fibonacciProblem } from '../../../modules/fibonacci';
import { usePlaybackStore } from '../../../store/playbackStore';
import { PlaybackControls } from '../../../components/controls/PlaybackControls';
import { TreeRenderer } from '../../../components/visualizers/TreeRenderer';
import { ExplanationPanel } from '../../../components/panels/ExplanationPanel';
import Link from 'next/link';

export default function LearnProblemPage() {
  const params = useParams();
  const problemId = params?.problem as string;

  const problem = useMemo(() => {
    if (problemId === 'fibonacci') return fibonacciProblem;
    return null;
  }, [problemId]);

  const [inputVal, setInputVal] = useState<string>("5");
  
  const { setSteps, reset } = usePlaybackStore();

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
    
    const steps = problem.generateSteps({ n: val });
    reset();
    setSteps(steps);
  };

  if (!problem) {
    return <div className="p-8 text-white">Problem not found.</div>;
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-white font-sans overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-80 border-r border-neutral-800 bg-neutral-900/50 flex flex-col">
        <div className="p-6 border-b border-neutral-800">
          <Link href="/" className="text-orange-500 hover:text-orange-400 text-sm font-semibold mb-4 inline-block">&larr; Back Home</Link>
          <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
          <p className="text-sm text-neutral-400">{problem.description}</p>
        </div>
        
        <div className="p-6 flex-grow">
          <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider mb-4">Input Controls</h3>
          {problem.inputSchema.map(field => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm text-neutral-400 mb-1">{field.label}</label>
              <input 
                type={field.type} 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                min={field.min}
                max={field.max}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          ))}
          <button 
            onClick={handleGenerate}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-2 px-4 rounded-lg transition-colors mt-2"
          >
            Generate Visualization
          </button>
        </div>
      </div>

      {/* Main Center Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-neutral-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="flex-1 relative z-10 overflow-auto">
          <TreeRenderer />
        </div>
        <PlaybackControls />
      </div>

      {/* Right Panel */}
      <div className="w-80 border-l border-neutral-800 bg-neutral-900/50 flex flex-col">
        <ExplanationPanel />
      </div>
    </div>
  );
}
