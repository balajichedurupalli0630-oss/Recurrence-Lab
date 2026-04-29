"use client";

import { useParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { fibonacciProblem } from '../../../modules/fibonacci';
import { climbingStairsProblem } from '../../../modules/climbing-stairs';
import { lcsProblem } from '../../../modules/lcs';
import { stockProblem } from '../../../modules/stock-dp';
import { usePlaybackStore } from '../../../store/playbackStore';
import { PlaybackControls } from '../../../components/controls/PlaybackControls';
import { TreeRenderer } from '../../../components/visualizers/TreeRenderer';
import { TabulationView } from '../../../components/visualizers/TabulationView';
import { ExplanationPanel } from '../../../components/panels/ExplanationPanel';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LearnProblemPage() {
  const params = useParams();
  const problemId = params?.problem as string;

  const problem = useMemo(() => {
    if (problemId === 'fibonacci') return fibonacciProblem;
    if (problemId === 'climbing-stairs') return climbingStairsProblem;
    if (problemId === 'lcs') return lcsProblem;
    if (problemId === 'stock-dp') return stockProblem;
    return null;
  }, [problemId]);

  const [inputs, setInputs] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    problem?.inputSchema.forEach(f => {
      initial[f.name] = f.defaultValue.toString();
    });
    return initial;
  });

  const { setSteps, reset, steps, currentStepIndex, visualizationMode, setVisualizationMode } = usePlaybackStore();

  useEffect(() => {
    if (problem) {
      handleGenerate();
    }
  }, [problem]);

  const handleGenerate = () => {
    if (!problem) return;
    
    if (!problem.maxTreeInputRule(inputs)) {
      alert("Input too large for MVP visualization tree.");
      return;
    }
    
    const generatedSteps = problem.generateSteps(inputs);
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
          <h1 className="text-lg font-semibold text-gray-900">{problem.title}</h1>
        </div>

        {/* View Mode Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-sm border border-gray-200">
          {(['tree', 'table'] as const).map((mode) => (
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
        
        <div></div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Canvas Area */}
        <main className="flex-1 relative overflow-hidden bg-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
          
          {/* Floating Teaching UI Group (Top-Left) */}
          <div className="absolute top-20 left-6 z-20 flex flex-col gap-3 pointer-events-none">
            {/* 1. Execution Context Box */}
            <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-[0_10_40_rgba(0,0,0,0.05)] flex flex-col items-start gap-3 w-[320px] pointer-events-auto transition-all">
              <span className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em]">Execution Context</span>
              
              <div className="flex flex-col gap-4 w-full">
                {problemId === 'stock-dp' && inputs.prices && (
                  <div className="flex flex-col items-start gap-1.5">
                    <div className="flex gap-1.5">
                      {inputs.prices.split(',').map((price, idx) => {
                        const currentInd = Number(steps[currentStepIndex]?.params.ind);
                        const isCurrent = currentInd === idx;
                        const isProcessed = currentInd > idx;
                        return (
                          <div key={idx} className="relative flex flex-col items-center">
                            {isCurrent && (
                              <div className="absolute -top-5 text-[9px] font-bold text-orange-500 font-mono">ind={idx}</div>
                            )}
                            <div 
                              className={`w-10 h-10 flex flex-col items-center justify-center rounded-sm border transition-all duration-300 ${
                                isCurrent 
                                  ? 'border-orange-400 bg-white shadow-sm z-10 scale-105' 
                                  : isProcessed ? 'bg-green-100/30 border-green-200/50' : 'bg-gray-50/30 border-gray-100/50 opacity-40'
                              }`}
                            >
                              <span className={`text-xs font-bold ${isCurrent ? 'text-black' : 'text-gray-500'}`}>
                                {price.trim()}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {problemId === 'lcs' && inputs.text1 && inputs.text2 && (
                   <div className="flex flex-col gap-4">
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex gap-1">
                          {inputs.text1.split('').map((char, idx) => {
                            const currentI = Number(steps[currentStepIndex]?.params.i);
                            const isCurrent = currentI === idx;
                            const isProcessed = currentI > idx;
                            return (
                              <div key={idx} className="relative flex flex-col items-center">
                                {isCurrent && (
                                  <div className="absolute -top-5 text-[9px] font-bold text-orange-500 font-mono">i={idx}</div>
                                )}
                                <div className={`w-8 h-8 flex items-center justify-center rounded-sm border transition-all duration-300 ${
                                  isCurrent ? 'border-orange-400 bg-white shadow-sm z-10 scale-105 text-black font-bold' : 
                                  isProcessed ? 'bg-green-100/30 border-green-200/50 text-green-700/70' : 
                                  'bg-gray-50/30 border-gray-100/50 opacity-40 text-gray-400'
                                } text-xs`}>
                                  {char}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-1">
                        <div className="flex gap-1">
                          {inputs.text2.split('').map((char, idx) => {
                            const currentJ = Number(steps[currentStepIndex]?.params.j);
                            const isCurrent = currentJ === idx;
                            const isProcessed = currentJ > idx;
                            return (
                              <div key={idx} className="relative flex flex-col items-center">
                                {isCurrent && (
                                  <div className="absolute -top-5 text-[9px] font-bold text-orange-500 font-mono">j={idx}</div>
                                )}
                                <div className={`w-8 h-8 flex items-center justify-center rounded-sm border transition-all duration-300 ${
                                  isCurrent ? 'border-orange-400 bg-white shadow-sm z-10 scale-105 text-black font-bold' : 
                                  isProcessed ? 'bg-green-100/30 border-green-200/50 text-green-700/70' : 
                                  'bg-gray-50/30 border-gray-100/50 opacity-40 text-gray-400'
                                } text-xs`}>
                                  {char}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                   </div>
                )}
              </div>
            </div>

            {/* 2. Active Step Explanation Card (Draggable Glassmorphism) */}
            {steps[currentStepIndex] && (
              <motion.div 
                drag
                dragMomentum={false}
                className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-[0_15_50_rgba(0,0,0,0.05)] w-[320px] max-h-[450px] overflow-y-auto pointer-events-auto transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-bold text-gray-800">
                    {steps[currentStepIndex].stateKey}
                  </span>
                  <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded-sm uppercase tracking-wider ${
                    steps[currentStepIndex].type === 'call' ? 'bg-red-50/50 text-red-600 border-red-100/50' :
                    steps[currentStepIndex].type === 'return' ? 'bg-green-50/50 text-green-600 border-green-100/50' :
                    'bg-sky-50/50 text-sky-600 border-sky-100/50'
                  } border`}>
                    {steps[currentStepIndex].type}
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                    {steps[currentStepIndex].explanation}
                  </p>

                  {steps[currentStepIndex].choices && (
                    <div className="grid grid-cols-1 gap-1.5 pt-1">
                      {steps[currentStepIndex].choices?.map((choice, i) => (
                        <div key={i} className="bg-white/30 p-2 rounded-lg border border-white/20">
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="text-[10px] font-bold text-gray-700">{choice.label}</span>
                            <span className="text-[8px] text-gray-400">{choice.impact}</span>
                          </div>
                          <p className="text-[9px] text-gray-500 leading-tight">{choice.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {steps[currentStepIndex].decisionLogic && (
                    <div className="mt-2 pt-2 border-t border-gray-100/30">
                      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Logic</span>
                      <p className="text-[10px] text-gray-500 whitespace-pre-line leading-snug italic">
                        {steps[currentStepIndex].decisionLogic}
                      </p>
                    </div>
                  )}

                  {steps[currentStepIndex].formula && (
                    <div className="mt-2 pt-2 border-t border-gray-100/30">
                      <div className="font-mono text-[10px] text-red-500 bg-red-50/30 p-2 rounded-lg border border-red-100/20">
                        {steps[currentStepIndex].formula}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          <div className="relative w-full h-full z-0">
            {visualizationMode === 'table' ? <TabulationView /> : <TreeRenderer />}
          </div>
          <PlaybackControls />
        </main>

        {/* Right Side HUD Group (Theory & Metrics) - Moved into canvas area */}
        <div className="absolute top-20 right-6 z-20 flex flex-col items-end gap-4 pointer-events-none">
          {/* Metrics Bar */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-full px-5 py-2 shadow-sm flex items-center gap-6 pointer-events-auto">
            <div className="flex flex-col items-end">
              <span className="text-[8px] uppercase tracking-widest text-gray-500 font-bold">Subproblems</span>
              <span className="text-xs font-mono font-bold text-black">{totalVisited}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] uppercase tracking-widest text-gray-500 font-bold">Repeated</span>
              <span className="text-xs font-mono font-bold text-[#0ea5e9]">{repeated}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] uppercase tracking-widest text-gray-500 font-bold">Base Cases</span>
              <span className="text-xs font-mono font-bold text-[#22c55e]">{baseCases}</span>
            </div>
          </div>

          {/* Draggable Theory HUD */}
          <motion.div 
            drag
            dragConstraints={{ left: -800, right: 0, top: 0, bottom: 600 }}
            className="w-[320px] pointer-events-auto"
          >
            <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-[0_15_50_rgba(0,0,0,0.05)] space-y-4 max-h-[600px] overflow-y-auto">
              <div className="space-y-1.5">
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em]">Intuition</span>
                <p className="text-[11px] text-gray-700 leading-relaxed italic font-medium">"{problem.intuition}"</p>
              </div>

              <div className="pt-3 border-t border-gray-200/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em]">Rules to Write</span>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 1, text: "Define the State clearly (what do parameters represent?)." },
                    { id: 2, text: "Explore all Possibilities from that state." },
                    { id: 3, text: "Take the Best/Sum among all decisions." }
                  ].map(rule => (
                    <div key={rule.id} className="flex gap-3 items-start">
                      <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-400 shrink-0 mt-0.5">{rule.id}</span>
                      <p className="text-[10px] text-gray-600 leading-relaxed">{rule.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200/30 space-y-2">
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Define the State</span>
                <div className="bg-white/30 border border-white/40 rounded-lg p-3">
                  <div className="text-sm font-mono font-bold text-gray-800 mb-1">
                    f( <span className="text-red-500 bg-red-50 px-1 rounded">ind</span> , ... )
                  </div>
                  <p className="text-[9px] text-gray-500 italic">"{problem.inputMeaning}"</p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200/30 space-y-2">
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">General Recurrence</span>
                <div className="bg-red-50/40 border border-red-100/50 rounded-lg p-3">
                  <div className="text-[11px] font-mono font-bold text-red-600 leading-relaxed">
                    {problem.buildRecurrenceText({})}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200/30 space-y-3">
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Input Setup</span>
                <div className="space-y-2">
                  {problem.inputSchema.map(field => (
                    <div key={field.name} className="flex flex-col gap-1">
                      <label className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">{field.label}</label>
                      <input 
                        type={field.type} 
                        value={inputs[field.name] || ""}
                        onChange={(e) => setInputs(prev => ({ ...prev, [field.name]: e.target.value }))}
                        className="w-full bg-white/20 border border-white/30 rounded-sm px-2 py-1 text-[10px] focus:outline-none focus:bg-white/40 transition-colors text-black"
                      />
                    </div>
                  ))}
                  <button 
                    onClick={handleGenerate}
                    className="w-full bg-black/80 hover:bg-black text-white text-[9px] font-bold py-1.5 rounded-sm transition-colors mt-1 uppercase tracking-widest"
                  >
                    Run Execution
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Playback Controls - Moved into canvas bottom */}
        <PlaybackControls />
      </div>
    </div>
  );
}
