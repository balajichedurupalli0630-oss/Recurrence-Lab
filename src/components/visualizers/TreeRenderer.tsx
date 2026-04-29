"use client";

import { useMemo, useRef, useEffect, useState } from 'react';
import { usePlaybackStore } from '../../store/playbackStore';
import { buildTreeLayout } from '../../utils/treeLayout';
import { motion } from 'framer-motion';

export function TreeRenderer() {
  const { steps, currentStepIndex, visualizationMode } = usePlaybackStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const nodes = useMemo(() => {
    if (steps.length === 0) return [];
    return buildTreeLayout(steps, currentStepIndex, visualizationMode === 'dag' ? 'dag' : 'tree');
  }, [steps, currentStepIndex, visualizationMode]);

  const [offset, setOffset] = useState({ x: 0, y: 50 });

  useEffect(() => {
    if (nodes.length > 0 && containerRef.current) {
      const minX = Math.min(...nodes.map(n => n.x));
      const maxX = Math.max(...nodes.map(n => n.x));
      const width = maxX - minX;
      
      const containerWidth = containerRef.current.clientWidth;
      setOffset({
        x: (containerWidth - width) / 2 - minX,
        y: 60
      });
    }
  }, [nodes.length]);

  if (steps.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 font-medium">
        Enter input and click Run to visualize recursion.
      </div>
    );
  }

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      <svg className="w-full h-full absolute inset-0 pointer-events-none">
        <g transform={`translate(${offset.x}, ${offset.y})`}>
          {nodes.map(node => {
            return node.parentIds.map(parentId => {
              const parent = nodes.find(n => n.id === parentId);
              if (!parent) return null;

              return (
                <motion.line
                  key={`edge-${parentId}-${node.id}`}
                  x1={parent.x}
                  y1={parent.y + 24}
                  x2={node.x}
                  y2={node.y - 24}
                  stroke="#e5e7eb"
                  strokeWidth={2}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              );
            });
          })}
        </g>
      </svg>
      
      <div className="absolute inset-0 pointer-events-none" style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}>
        {nodes.map(node => {
          // In DAG mode, we highlight the node if the current step matches its stateKey
          const currentStep = steps[currentStepIndex];
          const isActive = visualizationMode === 'dag' 
            ? currentStep?.stateKey === node.stateKey
            : currentStep?.id === node.id || currentStep?.parentId === node.id;
            
          const isComplete = node.value !== undefined;
          const isBaseCase = isComplete && steps.find(s => s.type === 'return' && (visualizationMode === 'dag' ? s.stateKey === node.stateKey : s.parentId === node.id))?.explanation.includes('Base case');
          
          let bgColor = "bg-white text-gray-800 border-gray-300";
          if (isActive) {
            bgColor = "bg-[#ef4444] text-white border-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.3)]";
          } else if (node.isMemoHit) {
            bgColor = "bg-[#0ea5e9] text-white border-[#0ea5e9]";
          } else if (isBaseCase) {
            bgColor = "bg-[#22c55e] text-white border-[#22c55e]";
          } else if (isComplete) {
            bgColor = "bg-white text-gray-600 border-gray-200"; // Finished standard node
          }

          return (
            <motion.div
              key={node.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full w-12 h-12 flex items-center justify-center font-mono font-semibold text-sm border-2 z-10 transition-colors duration-300 ${bgColor}`}
              style={{ left: node.x, top: node.y }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.3 }}
            >
              {node.stateKey}
              
              {isComplete && (
                <motion.div 
                  className="absolute -bottom-7 text-[#ef4444] font-mono text-sm font-bold whitespace-nowrap"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ={node.value}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
