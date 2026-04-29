"use client";

import { useMemo, useRef, useEffect, useState } from 'react';
import { usePlaybackStore } from '../../store/playbackStore';
import { buildTreeLayout } from '../../utils/treeLayout';
import { motion } from 'framer-motion';

export function TreeRenderer() {
  const { steps, currentStepIndex } = usePlaybackStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const nodes = useMemo(() => {
    if (steps.length === 0) return [];
    return buildTreeLayout(steps, currentStepIndex);
  }, [steps, currentStepIndex]);

  // Center the view on render
  const [offset, setOffset] = useState({ x: 0, y: 50 });

  useEffect(() => {
    if (nodes.length > 0 && containerRef.current) {
      const minX = Math.min(...nodes.map(n => n.x));
      const maxX = Math.max(...nodes.map(n => n.x));
      const width = maxX - minX;
      
      const containerWidth = containerRef.current.clientWidth;
      setOffset({
        x: (containerWidth - width) / 2 - minX,
        y: 80
      });
    }
  }, [nodes.length]); // update offset less frequently

  if (steps.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-neutral-600">
        Waiting for generation...
      </div>
    );
  }

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      <svg className="w-full h-full absolute inset-0 pointer-events-none">
        <g transform={`translate(${offset.x}, ${offset.y})`}>
          {nodes.map(node => {
            if (!node.parentId) return null;
            const parent = nodes.find(n => n.id === node.parentId);
            if (!parent) return null;

            return (
              <motion.line
                key={`edge-${node.id}`}
                x1={parent.x}
                y1={parent.y + 20}
                x2={node.x}
                y2={node.y - 20}
                stroke="#3f3f46"
                strokeWidth={2}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            );
          })}
        </g>
      </svg>
      
      <div className="absolute inset-0 pointer-events-none" style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}>
        {nodes.map(node => {
          const isActive = steps[currentStepIndex]?.id === node.id || steps[currentStepIndex]?.parentId === node.id;
          const isComplete = node.value !== undefined;
          
          return (
            <motion.div
              key={node.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-lg border-2 z-10 
                ${node.isMemoHit ? 'bg-blue-900/80 border-blue-500 text-blue-100' : 
                  isActive ? 'bg-orange-600 border-orange-300 text-white' : 
                  isComplete ? 'bg-green-900/80 border-green-500 text-green-100' : 
                  'bg-neutral-800 border-neutral-600 text-neutral-300'}`}
              style={{ left: node.x, top: node.y }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
            >
              <div className="text-sm">{node.stateKey}</div>
              {isComplete && (
                <motion.div 
                  className="absolute -top-6 bg-neutral-900 border border-neutral-700 text-white text-xs px-2 py-1 rounded shadow"
                  initial={{ opacity: 0, y: 10 }}
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
