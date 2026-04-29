"use client";

import { useMemo, useRef, useEffect, useState } from 'react';
import { usePlaybackStore } from '../../store/playbackStore';
import { buildTreeLayout } from '../../utils/treeLayout';
import { motion } from 'framer-motion';

export function TreeRenderer() {
  const { steps, currentStepIndex, visualizationMode } = usePlaybackStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  
  const nodes = useMemo(() => {
    if (steps.length === 0) return [];
    return buildTreeLayout(steps, currentStepIndex, visualizationMode === 'dag' ? 'dag' : 'tree');
  }, [steps, currentStepIndex, visualizationMode]);

  const [position, setPosition] = useState({ x: 0, y: 150 });

  // Auto-center on new run
  useEffect(() => {
    if (nodes.length > 0 && containerRef.current) {
      const minX = Math.min(...nodes.map(n => n.x));
      const maxX = Math.max(...nodes.map(n => n.x));
      const width = maxX - minX;
      const containerWidth = containerRef.current.clientWidth;
      
      setPosition({
        x: (containerWidth - width) / 2 - minX,
        y: 150
      });
      setScale(1);
    }
  }, [nodes.length === 0]); // Reset only when tree cleared/restarted

  if (steps.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 font-medium">
        Enter input and click Run to visualize recursion.
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-white cursor-grab active:cursor-grabbing overflow-hidden" ref={containerRef}>
      {/* Zoom Controls HUD */}
      <div className="absolute bottom-24 right-6 z-30 flex flex-col gap-2 pointer-events-none">
        <div className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-lg p-1 shadow-lg pointer-events-auto flex flex-col gap-1">
          <button 
            onClick={() => setScale(s => Math.min(s + 0.1, 2))}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600 transition-colors"
            title="Zoom In"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </button>
          <div className="h-px bg-gray-100 mx-1" />
          <button 
            onClick={() => setScale(s => Math.max(s - 0.1, 0.2))}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600 transition-colors"
            title="Zoom Out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
          </button>
          <div className="h-px bg-gray-100 mx-1" />
          <button 
            onClick={() => { setScale(1); setPosition({ x: 0, y: 150 }); }}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600 transition-colors"
            title="Reset View"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
      </div>

      <motion.div 
        drag
        dragMomentum={false}
        className="absolute inset-0 origin-center"
        initial={position}
        animate={{ scale }}
        onDragEnd={(_, info) => {
          setPosition(prev => ({
            x: prev.x + info.offset.x,
            y: prev.y + info.offset.y
          }));
        }}
      >
        <div style={{ transform: `translate(${position.x}px, ${position.y}px)` }} className="absolute inset-0">
          <svg className="w-full h-full absolute inset-0 pointer-events-none overflow-visible">
            <g>
              {nodes.map(node => {
                return node.parentIds.map(parentId => {
                  const parent = nodes.find(n => n.id === parentId);
                  if (!parent) return null;

                  return (
                    <motion.line
                      key={`edge-${parentId}-${node.id}`}
                      x1={parent.x}
                      y1={parent.y + 28}
                      x2={node.x}
                      y2={node.y - 28}
                      stroke="#cbd5e1"
                      strokeWidth={1.5}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  );
                });
              })}
            </g>
          </svg>
          
          <div className="absolute inset-0 pointer-events-none">
            {nodes.map(node => {
              const currentStep = steps[currentStepIndex];
              const isActive = currentStep?.stateKey === node.stateKey;
              const isComplete = node.value !== undefined;
              const isBaseCase = isComplete && steps.find(s => s.type === 'return' && s.stateKey === node.stateKey)?.explanation.includes('Base case');
              
              let bgColor = "bg-white text-gray-800 border-gray-200";
              if (isActive) {
                bgColor = "bg-[#ef4444] text-white border-[#ef4444] shadow-[0_0_20px_rgba(239,68,68,0.4)] z-20 scale-110";
              } else if (node.isMemoHit) {
                bgColor = "bg-[#0ea5e9] text-white border-[#0ea5e9]";
              } else if (isBaseCase) {
                bgColor = "bg-[#22c55e] text-white border-[#22c55e]";
              } else if (isComplete) {
                bgColor = "bg-white text-gray-600 border-gray-100";
              }

              return (
                <motion.div
                  key={node.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full w-18 h-18 flex items-center justify-center font-mono font-bold border-2 transition-all duration-300 shadow-sm ${bgColor}`}
                  style={{ left: node.x, top: node.y }}
                >
                  <div className="flex flex-col items-center gap-0.5 px-2 text-center pointer-events-auto">
                    <span className="text-[10px] leading-tight break-all tracking-tighter">{node.stateKey}</span>
                    {isComplete && (
                       <span className={`text-[9px] font-bold ${isActive ? 'text-red-100' : 'text-green-600'}`}>
                         = {node.value}
                       </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Floating Instructions */}
      <div className="absolute bottom-6 right-6 px-3 py-1.5 bg-gray-50/80 backdrop-blur-sm border border-gray-200 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest pointer-events-none z-30">
        Drag to Pan • Click +/- to Zoom
      </div>
    </div>
  );
}
