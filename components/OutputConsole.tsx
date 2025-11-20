import React from 'react';
import { CompilerResult } from '../types';

interface OutputConsoleProps {
  result: CompilerResult | null;
}

const OutputConsole: React.FC<OutputConsoleProps> = ({ result }) => {
  return (
    <div className="w-full h-full bg-gray-950 border border-gray-800 rounded-lg overflow-hidden flex flex-col font-mono text-sm shadow-inner">
      <div className="bg-gray-900 px-3 py-1 text-xs text-gray-400 border-b border-gray-800 uppercase tracking-wider">
        Terminal / Output
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {!result ? (
          <span className="text-gray-600 italic">// Output will appear here...</span>
        ) : (
          <>
            <div className={result.success ? 'text-green-400' : 'text-red-400'}>
               <span className="opacity-50">$ ./a.out</span>
               <br />
               <pre className="whitespace-pre-wrap break-words mt-2 font-sans">{result.output}</pre>
            </div>
            {result.analysis && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="text-xs text-blue-400 mb-1">AI Analysis:</div>
                    <p className="text-gray-400 text-xs leading-relaxed">{result.analysis}</p>
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OutputConsole;
