
import React, { useState, useRef, useEffect } from 'react';
import { ROADMAP_DATA } from './constants';
import { RoadmapItem, RoadmapStatus, CompilerResult, ChatMessage } from './types';
import CodeEditor from './components/CodeEditor';
import OutputConsole from './components/OutputConsole';
import Visualizer from './components/Visualizer';
import { simulateCompiler, getAiExplanation } from './services/geminiService';
import ReactMarkdown from 'react-markdown';

const IntroScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [text, setText] = useState("");
  const fullText = "Initializing C-Master AI...";
  
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      setText(fullText.substring(0, idx + 1));
      idx++;
      if (idx === fullText.length) {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col items-center justify-center">
       <div className="text-4xl font-bold font-mono text-white mb-4 tracking-tighter">
         <span className="text-accent-500">&lt;C&gt;</span> C-Master
       </div>
       <div className="h-6 text-green-400 font-mono text-sm">
         {text}<span className="animate-pulse">_</span>
       </div>
    </div>
  );
};

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);

  // Load completed topics from local storage
  const loadCompletedTopics = (): string[] => {
    const saved = localStorage.getItem('c-master-completed');
    return saved ? JSON.parse(saved) : [];
  };

  const [completedTopics, setCompletedTopics] = useState<string[]>(loadCompletedTopics);
  const [activeTopicId, setActiveTopicId] = useState<string>(ROADMAP_DATA[0].id);
  const [code, setCode] = useState<string>(ROADMAP_DATA[0].defaultCode);
  const [compilerResult, setCompilerResult] = useState<CompilerResult | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [activeSubTopic, setActiveSubTopic] = useState<string | null>(null);
  
  // Visualization Sync State
  const [executionLine, setExecutionLine] = useState<number | null>(null);
  
  // Tabs for Right Panel
  const [activeTab, setActiveTab] = useState<'theory' | 'visualizer'>('theory');

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Welcome to C-Master! I'm your AI tutor. Ask me to generate code (e.g., 'Write a program for Bubble Sort') or explain concepts.",
      timestamp: Date.now()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const theoryContentRef = useRef<HTMLDivElement>(null);

  const activeTopic = ROADMAP_DATA.find(t => t.id === activeTopicId) || ROADMAP_DATA[0];

  // Persist completed topics
  useEffect(() => {
    localStorage.setItem('c-master-completed', JSON.stringify(completedTopics));
  }, [completedTopics]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiTyping]);

  const handleTopicChange = (topic: RoadmapItem) => {
    setActiveTopicId(topic.id);
    setCode(topic.defaultCode);
    setCompilerResult(null);
    setExecutionLine(null);
    setActiveTab('theory');
    setActiveSubTopic(null);
  };

  // Scroll to subtopic in theory view
  const handleSubTopicClick = (sub: string) => {
    setActiveSubTopic(sub);
    setActiveTab('theory');
    
    // Simple text search for scrolling since we don't have anchors
    setTimeout(() => {
        if (theoryContentRef.current) {
            const headers = theoryContentRef.current.querySelectorAll('h3');
            for (let i = 0; i < headers.length; i++) {
                if (headers[i].textContent?.toLowerCase().includes(sub.toLowerCase())) {
                    headers[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
                    break;
                }
            }
        }
    }, 100);
  };

  const handleRunCode = async () => {
    if (isCompiling) return;
    setIsCompiling(true);
    setCompilerResult(null);
    setExecutionLine(null);
    
    // Switch to visualizer tab to show execution
    setActiveTab('visualizer');

    const result = await simulateCompiler(code);
    setCompilerResult(result);
    setIsCompiling(false);

    if (result.success && !completedTopics.includes(activeTopicId)) {
      setCompletedTopics(prev => [...prev, activeTopicId]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputMessage,
      timestamp: Date.now()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsAiTyping(true);

    const responseText = await getAiExplanation(activeTopic.title, code, userMsg.text);

    setIsAiTyping(false);
    setChatMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    }]);
  };

  const insertCode = (codeBlock: string) => {
    setCode(codeBlock.trim());
  };

  const markAsCompleted = () => {
    if (!completedTopics.includes(activeTopicId)) {
      setCompletedTopics(prev => [...prev, activeTopicId]);
    }
  };

  if (showIntro) {
    return <IntroScreen onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="flex h-screen w-full bg-gray-950 text-gray-200 font-sans selection:bg-accent-500/30 overflow-hidden">
      
      {/* Sidebar Roadmap */}
      <div className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0 z-10 shadow-xl h-full">
        <div className="p-4 border-b border-gray-800 bg-gray-900">
          <h1 className="text-xl font-bold text-white flex items-center tracking-tight">
            <span className="text-accent-500 mr-2">&lt;C&gt;</span> C-Master AI
          </h1>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Complete Course</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {ROADMAP_DATA.map((topic) => (
            <div key={topic.id} className="mb-1">
              <button
                onClick={() => handleTopicChange(topic)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-all flex items-center justify-between group ${
                  activeTopicId === topic.id
                    ? 'bg-gray-800 text-white border-l-4 border-accent-500 shadow-lg shadow-black/20'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                }`}
              >
                <span className="truncate font-medium">{topic.title}</span>
                {completedTopics.includes(topic.id) && (
                    <svg className="w-3 h-3 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                )}
              </button>
              
              {/* Sub Topics - Always render if active */}
              {activeTopicId === topic.id && topic.subTopics && (
                  <div className="ml-3 pl-3 border-l border-gray-700 my-1 space-y-0.5">
                      {topic.subTopics.map((sub, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => handleSubTopicClick(sub)}
                            className={`block w-full text-left text-xs py-1.5 px-2 rounded transition-colors ${
                                activeSubTopic === sub 
                                ? 'text-accent-400 bg-gray-800/50 font-bold' 
                                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'
                            }`}
                          >
                              • {sub}
                          </button>
                      ))}
                  </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        
        {/* Main Grid */}
        <div className="flex-1 flex p-2 gap-2 overflow-hidden">
          
          {/* Left Column: Code Editor & Output */}
          <div className="flex flex-col w-[55%] gap-2 min-w-[450px] h-full">
             <div className="flex-1 min-h-0">
                <CodeEditor 
                  code={code} 
                  onChange={setCode} 
                  onRun={handleRunCode}
                  isCompiling={isCompiling}
                  compilerResult={compilerResult}
                  executionLine={executionLine}
                />
             </div>
             <div className="h-[30%] min-h-[150px] shrink-0">
                <OutputConsole result={compilerResult} />
             </div>
          </div>

          {/* Right Column: Theory/Visualizer & Chat */}
          <div className="flex flex-col w-[45%] gap-2 min-w-[400px] h-full">
            
            {/* Top Right: Tabs (Theory vs Visualizer) */}
            <div className="h-[50%] bg-gray-900 border border-gray-800 rounded-lg flex flex-col shadow-md overflow-hidden shrink-0">
               <div className="flex border-b border-gray-800 bg-gray-950">
                 <button 
                   onClick={() => setActiveTab('theory')}
                   className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'theory' ? 'bg-gray-900 text-white border-b-2 border-accent-500' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'}`}
                 >
                   Theory & Concepts
                 </button>
                 <button 
                   onClick={() => setActiveTab('visualizer')}
                   className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'visualizer' ? 'bg-gray-900 text-white border-b-2 border-accent-500' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'}`}
                 >
                   Visualizer
                 </button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-0 bg-gray-900 relative custom-scrollbar" ref={theoryContentRef}>
                 {activeTab === 'theory' ? (
                   <div className="p-6">
                      <div className="mb-6 border-b border-gray-800 pb-4">
                        <h2 className="text-2xl text-white font-bold mb-1 tracking-tight">{activeTopic.title}</h2>
                        <p className="text-gray-500 text-sm">{activeTopic.description}</p>
                      </div>
                      
                      <div className="prose prose-invert prose-sm max-w-none prose-headings:text-accent-400 prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-2 prose-p:text-gray-300 prose-p:leading-relaxed prose-code:text-accent-200 prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-800">
                         <ReactMarkdown>{activeTopic.theory}</ReactMarkdown>
                      </div>
                      
                      {activeTopic.practiceQuestions.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-800 bg-gray-800/30 -mx-6 px-6 pb-6">
                          <h3 className="text-sm font-bold text-yellow-500 uppercase mb-4 tracking-wider">Practice Exercises</h3>
                          <ul className="space-y-3">
                            {activeTopic.practiceQuestions.map((q, i) => (
                              <li key={i} className="flex items-start text-gray-300 text-xs leading-relaxed">
                                <span className="mr-2 text-yellow-500/50 mt-0.5">•</span>
                                {q}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                   </div>
                 ) : (
                   <div className="h-full p-2">
                      <Visualizer 
                        type={activeTopic.visualType} 
                        trace={compilerResult?.visualizationTrace}
                        onLineChange={setExecutionLine}
                      />
                   </div>
                 )}
               </div>
            </div>

            {/* Bottom Right: Chat */}
            <div className="flex-1 bg-gray-900 border border-gray-800 rounded-lg flex flex-col shadow-md overflow-hidden min-h-0">
              <div className="bg-gray-850 px-4 py-2 border-b border-gray-800 flex items-center justify-between shrink-0">
                <span className="text-xs font-bold text-gray-300 flex items-center gap-2 uppercase tracking-wide">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  AI Tutor
                </span>
                {!completedTopics.includes(activeTopicId) && (
                    <button 
                      onClick={markAsCompleted} 
                      className="text-[10px] border border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 px-2 py-0.5 rounded transition-colors"
                    >
                      Mark Topic Done
                    </button>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50 custom-scrollbar">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[95%] rounded-lg px-4 py-3 text-sm shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-accent-700 text-white rounded-br-none' 
                        : 'bg-gray-800 text-gray-300 rounded-bl-none border border-gray-700'
                    }`}>
                      {msg.role === 'model' ? (
                        <ReactMarkdown 
                            components={{
                                code(props) {
                                    const {children, className, node, ...rest} = props;
                                    const match = /language-(\w+)/.exec(className || '');
                                    const isBlock = match || (String(children).includes('\n'));
                                    
                                    if (isBlock) {
                                      return (
                                        <div className="relative mt-2 mb-2 group">
                                          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <button 
                                              onClick={() => insertCode(String(children))}
                                              className="bg-accent-600 hover:bg-accent-500 text-white text-[10px] px-2 py-1 rounded shadow-md flex items-center gap-1 border border-accent-400 font-bold uppercase tracking-wide"
                                            >
                                              Insert Code
                                            </button>
                                          </div>
                                          <code className="block bg-gray-950 p-3 rounded border border-gray-700 overflow-x-auto font-mono text-xs text-blue-200" {...rest}>
                                            {children}
                                          </code>
                                        </div>
                                      );
                                    }
                                    return <code className="bg-gray-950 px-1.5 py-0.5 rounded text-accent-300 font-mono text-xs border border-gray-700" {...rest}>{children}</code>
                                }
                            }}
                        >
                            {msg.text}
                        </ReactMarkdown>
                      ) : msg.text}
                    </div>
                  </div>
                ))}
                {isAiTyping && (
                   <div className="flex justify-start">
                     <div className="bg-gray-800 rounded-lg px-3 py-2 border border-gray-700 flex space-x-1">
                       <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                       <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                       <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                     </div>
                   </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-2 bg-gray-850 border-t border-gray-800 shrink-0">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask for help, code, or logic..."
                    className="flex-1 bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent-500 transition-colors"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isAiTyping}
                    className="bg-gray-700 hover:bg-accent-600 hover:text-white text-gray-300 px-3 py-2 rounded transition-all disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
