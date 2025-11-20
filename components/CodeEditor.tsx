
import React, { useState, useEffect, useRef } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onRun: () => void;
  isCompiling: boolean;
  compilerResult: { output: string; success: boolean } | null;
  executionLine?: number | null; // Highlight the line currently being visualized
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, onRun, isCompiling, compilerResult, executionLine }) => {
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  // Parse compiler output for error lines
  useEffect(() => {
    if (compilerResult && !compilerResult.success) {
      // Common GCC/Clang error format: file.c:10:5: error: ...
      const match = compilerResult.output.match(/:(\d+):/) || compilerResult.output.match(/line (\d+)/i);
      if (match && match[1]) {
        setErrorLine(parseInt(match[1], 10));
      } else {
        setErrorLine(null);
      }
    } else {
      setErrorLine(null);
    }
  }, [compilerResult]);

  // Sync scroll between textarea and pre
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const autoFormat = () => {
    const lines = code.split('\n');
    let indentLevel = 0;
    const formattedLines = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      // Decrease indent for closing braces or cases
      if (line.startsWith('}') || line.startsWith('case ') || line.startsWith('default:')) {
        indentLevel = Math.max(0, indentLevel - (line.startsWith('}') ? 1 : 0));
        if (line.startsWith('case ') || line.startsWith('default:')) {
           indentLevel = Math.max(0, indentLevel - 1);
        }
      }

      const indent = '    '.repeat(indentLevel);
      formattedLines.push(indent + line);

      // Increase indent for opening braces
      if (line.endsWith('{')) {
        indentLevel++;
      } else if (line.endsWith(':')) {
         // Case statements increase indent for subsequent lines
         indentLevel++;
      }
    }
    
    onChange(formattedLines.join('\n'));
  };

  // Robust Syntax Highlighter using a tokenizer approach
  const highlightCode = (input: string) => {
    const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Regex order: 
    // 1. Comments
    // 2. Strings
    // 3. Preprocessor
    // 4. Keywords
    // 5. Functions
    // 6. Numbers
    // 7. Everything else
    const tokenRegex = /(\/\/.*)|(\/\*[\s\S]*?\*\/)|(".*?")|('.*?')|(#\w+)|(\b(?:auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|NULL|FILE|true|false)\b)|(\b\w+(?=\())|(\b\d+\b)|([\s\S])/g;

    let html = input.replace(tokenRegex, (match, lineComment, blockComment, stringDouble, stringSingle, preproc, keyword, func, number, other) => {
        if (lineComment) return `<span class="text-gray-500 italic">${escape(lineComment)}</span>`;
        if (blockComment) return `<span class="text-gray-500 italic">${escape(blockComment)}</span>`;
        if (stringDouble) return `<span class="text-green-400">${escape(stringDouble)}</span>`;
        if (stringSingle) return `<span class="text-yellow-300">${escape(stringSingle)}</span>`;
        if (preproc) return `<span class="text-pink-400">${escape(preproc)}</span>`;
        if (keyword) return `<span class="text-purple-400 font-bold">${escape(keyword)}</span>`;
        if (func) return `<span class="text-blue-300">${escape(func)}</span>`;
        if (number) return `<span class="text-orange-300">${escape(number)}</span>`;
        return escape(match);
    });

    const lines = html.split('\n');
    
    // Highlight Error Line
    if (errorLine !== null) {
      const idx = errorLine - 1;
      if (lines[idx] !== undefined) {
        lines[idx] = `<div class="bg-red-900/40 inline-block w-full">${lines[idx]}</div>`;
      }
    }

    // Highlight Execution Line (Visualization)
    if (executionLine !== null && executionLine !== undefined) {
      const idx = executionLine - 1;
      if (lines[idx] !== undefined) {
         // Use a bright highlight for the current line
         lines[idx] = `<div class="bg-accent-900/40 inline-block w-full border-l-2 border-accent-500 pl-1 -ml-1">${lines[idx]}</div>`;
      }
    }

    html = lines.join('\n');
    return html;
  };

  const lineNumbers = code.split('\n').map((_, i) => i + 1).join('\n');

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-lg border border-gray-700 overflow-hidden shadow-lg group">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-700 shrink-0">
        <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-400 ml-2 font-mono">main.c</span>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={autoFormat}
            className="flex items-center space-x-1 text-xs bg-[#333] hover:bg-[#444] text-gray-300 px-3 py-1.5 rounded transition-colors border border-gray-600"
            title="Auto Format Code"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
            <span>Format</span>
          </button>
          <button
            onClick={onRun}
            disabled={isCompiling}
            className={`flex items-center space-x-2 px-4 py-1.5 rounded text-xs font-bold tracking-wide transition-all uppercase ${
              isCompiling 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20'
            }`}
          >
            {isCompiling ? (
              <><span>Compiling...</span></>
            ) : (
              <>
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                 <span>Run</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative flex overflow-hidden text-sm">
        {/* Line Numbers */}
        <div className="bg-[#1e1e1e] text-gray-600 p-4 text-right select-none border-r border-[#333] w-12 shrink-0 z-20 font-mono leading-6">
           {lineNumbers}
        </div>
        
        <div className="relative flex-1 h-full overflow-hidden bg-[#1e1e1e]">
          {/* Highlight Overlay - Underlying layer */}
          <pre
            ref={preRef}
            className="absolute top-0 left-0 w-full h-full p-4 m-0 bg-transparent pointer-events-none whitespace-pre overflow-auto font-mono leading-6 text-gray-100 z-0"
            style={{ fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
            dangerouslySetInnerHTML={{ __html: highlightCode(code) + '<br/>' }}
          ></pre>

          {/* Actual Input - Transparent top layer */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className="absolute top-0 left-0 w-full h-full p-4 m-0 bg-transparent text-transparent caret-white outline-none resize-none font-mono leading-6 z-10 whitespace-pre overflow-auto"
             style={{ fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
