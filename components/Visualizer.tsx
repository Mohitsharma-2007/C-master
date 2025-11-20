
import React, { useState, useEffect } from 'react';
import { TraceFrame } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface VisualizerProps {
  type: 'none' | 'memory' | 'pointer' | 'array' | 'struct' | 'loop' | 'flow' | 'stack' | 'grid' | 'file' | 'heap' | 'linked_list';
  trace?: TraceFrame[];
  onLineChange?: (line: number) => void;
}

const Visualizer: React.FC<VisualizerProps> = ({ type, trace, onLineChange }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Reset when trace changes
  useEffect(() => {
    if (trace && trace.length > 0) {
      setStepIndex(0);
      setIsPlaying(true);
    } else {
      setStepIndex(0);
      setIsPlaying(false);
    }
  }, [trace]);

  // Playback Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && trace && stepIndex < trace.length - 1) {
      interval = setInterval(() => {
        setStepIndex((prev) => prev + 1);
      }, 1500); // 1.5s per step
    } else if (stepIndex >= (trace?.length || 0) - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, stepIndex, trace]);

  // Notify parent of line change
  useEffect(() => {
    if (trace && trace[stepIndex]) {
      onLineChange?.(trace[stepIndex].line);
    }
  }, [stepIndex, trace, onLineChange]);

  const currentFrame = trace ? trace[stepIndex] : null;

  // --- Renderers ---

  const renderVariables = (variables: Record<string, any> = {}) => (
    <div className="grid grid-cols-2 gap-2 w-full">
      {Object.entries(variables).map(([name, val]) => (
        <motion.div 
          key={name} 
          layout
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-800 border border-gray-700 p-2 rounded flex justify-between items-center shadow-sm"
        >
          <span className="text-xs text-blue-300 font-mono">{name}</span>
          <span className="text-sm text-white font-bold font-mono">{val}</span>
        </motion.div>
      ))}
      {Object.keys(variables).length === 0 && <div className="text-gray-600 text-xs italic col-span-2 text-center">No local variables</div>}
    </div>
  );

  const renderContent = () => {
    // If no trace is available, show specific static educational content (fallback)
    // If trace is available, show dynamic content
    const vars = currentFrame?.variables || {};
    const arrays = currentFrame?.arrays || {};

    // Fallback Static Views (Pre-run)
    if (!trace) {
      return renderStaticConcept(type);
    }

    // Dynamic Views (Post-run)
    switch (type) {
      case 'memory':
      case 'loop':
      case 'flow':
      case 'struct':
        return (
          <div className="flex flex-col w-full h-full p-4 overflow-y-auto">
             <div className="mb-4">
               <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-2">Variables (Stack)</h4>
               {renderVariables(vars)}
             </div>
             {type === 'loop' && (
               <div className="flex-1 flex items-center justify-center">
                 <div className="relative w-32 h-32 border-4 border-gray-800 border-t-accent-500 rounded-full flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500 uppercase">Iteration</span>
                    {/* Try to infer iteration count from a variable named i, j, k or count */}
                    <span className="text-2xl text-white font-bold">
                      {vars['i'] ?? vars['j'] ?? vars['count'] ?? '-'}
                    </span>
                 </div>
               </div>
             )}
          </div>
        );

      case 'array':
      case 'grid':
        // Find the first array in the trace
        const arrName = Object.keys(arrays)[0];
        const arrData = arrName ? arrays[arrName] : [];
        
        return (
          <div className="flex flex-col items-center justify-center w-full h-full p-4">
            <h3 className="text-accent-500 mb-2 font-mono text-sm">{arrName ? `${arrName}[]` : 'Array Memory'}</h3>
            <div className="flex flex-wrap justify-center gap-2">
               <AnimatePresence>
                 {arrData.map((val, idx) => (
                   <motion.div 
                     key={`${arrName}-${idx}`}
                     initial={{ y: -10, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     exit={{ scale: 0 }}
                     className="flex flex-col items-center"
                   >
                     <div className="w-10 h-10 border border-gray-600 bg-gray-800 flex items-center justify-center text-white font-bold text-sm rounded shadow-lg">
                       {val}
                     </div>
                     <span className="text-[10px] text-gray-500 mt-1">[{idx}]</span>
                   </motion.div>
                 ))}
               </AnimatePresence>
            </div>
            <div className="mt-8 w-full">
                <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-2">Variables</h4>
                {renderVariables(vars)}
            </div>
          </div>
        );
      
      case 'stack': // Recursion
        const stack = currentFrame?.stack || [];
        return (
           <div className="flex flex-col items-center w-full h-full p-4">
             <h3 className="text-accent-500 mb-4 font-mono text-sm">Call Stack</h3>
             <div className="flex flex-col-reverse space-y-1 space-y-reverse w-full max-w-[200px]">
               <AnimatePresence>
                  {stack.length === 0 ? (
                    <div className="text-gray-600 text-xs text-center">Main function not started</div>
                  ) : (
                    stack.map((func, idx) => (
                      <motion.div
                        key={`${func}-${idx}`}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 50, opacity: 0 }}
                        className={`p-2 rounded border text-center text-xs ${
                          idx === stack.length - 1 
                          ? 'bg-accent-900/30 border-accent-500 text-white font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                          : 'bg-gray-800 border-gray-600 text-gray-400'
                        }`}
                      >
                        {func}
                      </motion.div>
                    ))
                  )}
               </AnimatePresence>
             </div>
             <div className="mt-auto w-full pt-4">
               {renderVariables(vars)}
             </div>
           </div>
        );

      default:
        // Generic Fallback for other types in dynamic mode
        return (
          <div className="p-4 w-full h-full overflow-y-auto">
            <div className="mb-4">
              <h4 className="text-accent-500 text-xs font-bold uppercase mb-2">Current State</h4>
              {renderVariables(vars)}
            </div>
            {Object.keys(arrays).length > 0 && (
              <div className="mb-4">
                <h4 className="text-accent-500 text-xs font-bold uppercase mb-2">Arrays</h4>
                {Object.entries(arrays).map(([name, data]) => (
                   <div key={name} className="mb-2">
                      <span className="text-xs text-gray-400 block mb-1">{name}</span>
                      <div className="flex gap-1 flex-wrap">
                        {data.map((v, i) => (
                          <span key={i} className="bg-gray-800 border border-gray-700 px-1.5 py-0.5 text-xs rounded text-gray-300">{v}</span>
                        ))}
                      </div>
                   </div>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  // Static Concepts (Same as before but extracted)
  const renderStaticConcept = (t: string) => {
     // ... Reuse the previous static render logic (shortened for brevity, keeping key visuals)
     // Just returning the switch block from the previous file for the 'none' trace case.
     switch (t) {
        case 'flow': return <StaticFlow />;
        case 'memory': return <StaticMemory />;
        case 'array': return <StaticArray />;
        case 'pointer': return <StaticPointer />;
        case 'loop': return <StaticLoop />;
        case 'struct': return <StaticStruct />;
        case 'grid': return <StaticGrid />;
        case 'stack': return <StaticStack />;
        case 'file': return <StaticFile />;
        case 'heap': return <StaticHeap />;
        case 'linked_list': return <StaticLinkedList />;
        default: return <div className="flex items-center justify-center h-full text-gray-600 text-sm">Ready to Visualize</div>;
     }
  };

  return (
    <div className="w-full h-full bg-gray-900 border border-gray-800 rounded-lg overflow-hidden relative shadow-inner flex flex-col">
      <div className="absolute top-0 left-0 bg-gray-800 px-2 py-1 text-[10px] text-gray-400 uppercase tracking-wider rounded-br z-10">
        {trace ? 'Live Execution' : 'Concept Preview'}
      </div>
      
      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden">
         {renderContent()}
         
         {/* Trace Description Overlay */}
         {trace && currentFrame && (
           <div className="absolute bottom-0 left-0 right-0 bg-gray-900/90 p-3 border-t border-gray-800 backdrop-blur-sm">
              <div className="text-xs text-accent-400 font-bold mb-1">Step {stepIndex + 1}: Line {currentFrame.line}</div>
              <div className="text-xs text-white">{currentFrame.description}</div>
           </div>
         )}
      </div>

      {/* Playback Controls (Only if trace exists) */}
      {trace && (
        <div className="h-12 bg-gray-950 border-t border-gray-800 flex items-center px-4 space-x-4 shrink-0">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white hover:text-accent-500 transition-colors"
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>

          <input 
            type="range" 
            min="0" 
            max={trace.length - 1} 
            value={stepIndex} 
            onChange={(e) => {
              setIsPlaying(false);
              setStepIndex(parseInt(e.target.value));
            }}
            className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent-500"
          />

          <div className="text-[10px] text-gray-500 font-mono w-12 text-right">
            {stepIndex + 1}/{trace.length}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Static Components for Pre-Run State ---
const StaticFlow = () => (
    <div className="flex flex-col items-center justify-center h-full p-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="w-24 h-10 border-2 border-blue-500 rounded-lg flex items-center justify-center text-xs text-blue-400 font-bold">START</div>
        <div className="h-6 w-0.5 bg-gray-700"></div>
        <div className="w-6 h-6 bg-gray-700 rotate-45 border border-yellow-500"></div>
        <div className="h-6 w-0.5 bg-gray-700"></div>
        <div className="w-24 h-10 border-2 border-gray-500 rounded-lg flex items-center justify-center text-xs text-gray-400 font-bold">END</div>
        <p className="mt-4 text-xs text-gray-500">Run code to see execution flow</p>
    </div>
);
const StaticMemory = () => (
    <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="border border-gray-600 rounded p-3 bg-gray-800 mb-2 w-32">
            <div className="text-purple-400 text-xs">int</div>
            <div className="text-white font-bold">var</div>
            <div className="text-accent-500 text-xs">?</div>
        </div>
        <p className="text-xs text-gray-500">Memory Visualizer</p>
    </div>
);
const StaticArray = () => (
    <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="flex space-x-1">
            {[0,1,2,3].map(i => <div key={i} className="w-8 h-8 border border-gray-600 bg-gray-800"></div>)}
        </div>
        <p className="mt-4 text-xs text-gray-500">Array Visualizer</p>
    </div>
);
// ... (simplified placeholders for others to save space, they appear nicely in "Pre-Run")
const StaticPointer = () => <div className="flex items-center justify-center h-full text-xs text-gray-500">Pointer Visualization</div>;
const StaticLoop = () => <div className="flex items-center justify-center h-full text-xs text-gray-500">Loop Visualization</div>;
const StaticStruct = () => <div className="flex items-center justify-center h-full text-xs text-gray-500">Struct Visualization</div>;
const StaticGrid = () => <div className="flex items-center justify-center h-full text-xs text-gray-500">Pattern Grid</div>;
const StaticStack = () => <div className="flex items-center justify-center h-full text-xs text-gray-500">Call Stack</div>;
const StaticFile = () => <div className="flex items-center justify-center h-full text-xs text-gray-500">File I/O</div>;
const StaticHeap = () => <div className="flex items-center justify-center h-full text-xs text-gray-500">Heap Memory</div>;
const StaticLinkedList = () => <div className="flex items-center justify-center h-full text-xs text-gray-500">Linked List</div>;

export default Visualizer;
