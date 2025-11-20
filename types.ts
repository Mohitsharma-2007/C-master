
export enum RoadmapStatus {
  LOCKED = 'LOCKED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  theory: string; // Markdown content for the lesson theory
  practiceQuestions: string[]; 
  status: RoadmapStatus;
  defaultCode: string;
  visualType: 'none' | 'memory' | 'pointer' | 'array' | 'struct' | 'loop' | 'flow' | 'stack' | 'grid' | 'file' | 'heap' | 'linked_list';
  subTopics: string[]; 
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface TraceFrame {
  step: number;
  line: number; // Line number in code
  description: string; // What happened this step
  variables: Record<string, string>; // Local variables state
  arrays?: Record<string, (string | number)[]>; // Array states
  pointers?: Record<string, { target: string, address: string, value: string }>;
  heap?: { address: string, value: string, isFreed: boolean }[];
  stack?: string[]; // Function names
  output?: string; // Stdout up to this point
}

export interface CompilerResult {
  output: string;
  success: boolean;
  analysis?: string; 
  visualizationTrace?: TraceFrame[];
}
