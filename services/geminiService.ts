
import { GoogleGenAI, Type } from "@google/genai";
import { CompilerResult, TraceFrame } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Model for chat and fast reasoning
const MODEL_NAME = 'gemini-2.5-flash';

export const simulateCompiler = async (code: string): Promise<CompilerResult> => {
  try {
    const prompt = `
      Act as a C compiler and runtime environment with a debugger attached. 
      Execute the following C code. 
      
      1. If there are syntax errors, return success: false and the error message in 'output'.
      2. If the code runs, return success: true and the standard output.
      3. CRITICAL: Generate a 'visualizationTrace'. This is an array of execution steps (max 20 steps).
         - For loops, capture the first 3 iterations and the last iteration.
         - For recursion, capture the stack growth.
         - For arrays, capture state changes.
         - Include the 'line' number corresponding to the code (approximate if needed).
         - 'variables' should be a list of objects with 'name' and 'value' representing local variables.
         - 'arrays' should be a list of objects with 'name' and 'values' representing array states.
      
      Code:
      ${code}
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            output: { type: Type.STRING, description: "Standard output or error." },
            success: { type: Type.BOOLEAN, description: "Compilation success." },
            analysis: { type: Type.STRING, description: "Brief explanation." },
            visualizationTrace: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step: { type: Type.INTEGER },
                  line: { type: Type.INTEGER },
                  description: { type: Type.STRING },
                  variables: { 
                    type: Type.ARRAY, 
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            value: { type: Type.STRING }
                        }
                    }
                  },
                  arrays: {
                     type: Type.ARRAY,
                     items: {
                         type: Type.OBJECT,
                         properties: {
                             name: { type: Type.STRING },
                             values: { type: Type.ARRAY, items: { type: Type.STRING } }
                         }
                     }
                  },
                  stack: { type: Type.ARRAY, items: { type: Type.STRING } },
                  output: { type: Type.STRING }
                },
                required: ["step", "description", "variables"]
              }
            }
          },
          required: ["output", "success", "analysis"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from AI Compiler");
    }

    const rawResult = JSON.parse(response.text);

    // Transform the KV-list format back to Record format for the application
    const transformedTrace = rawResult.visualizationTrace?.map((step: any) => {
        const variables: Record<string, string> = {};
        if (step.variables && Array.isArray(step.variables)) {
            step.variables.forEach((item: any) => {
                if (item.name) variables[item.name] = String(item.value);
            });
        }

        const arrays: Record<string, any[]> = {};
        if (step.arrays && Array.isArray(step.arrays)) {
            step.arrays.forEach((item: any) => {
                if (item.name) arrays[item.name] = item.values || [];
            });
        }

        return {
            ...step,
            variables,
            arrays
        } as TraceFrame;
    });

    return {
        output: rawResult.output,
        success: rawResult.success,
        analysis: rawResult.analysis,
        visualizationTrace: transformedTrace
    };

  } catch (error) {
    console.error("Compiler Simulation Error:", error);
    return {
      output: "Error: Could not connect to the compiler service. " + (error instanceof Error ? error.message : ""),
      success: false,
      analysis: "Network or API error occurred."
    };
  }
};

export const getAiExplanation = async (topicTitle: string, currentCode: string, userQuestion: string) => {
  try {
    const prompt = `
      You are an expert C Programming Tutor for a university student.
      
      Context Topic: ${topicTitle}
      Current Code in Editor:
      ${currentCode}
      
      User Question: ${userQuestion}
      
      Instructions:
      1. Provide a helpful, encouraging, and technically accurate answer.
      2. If the user asks for code or to write a program, generate valid C code enclosed in a markdown code block (e.g., \`\`\`c ... \`\`\`).
      3. Ensure the code is clean, uses standard C formatting (4 space indentation), and includes comments.
      4. If the user asks to solve a specific problem (like Factorial, Fibonacci, Primes), provide the complete code snippet so they can insert it.
      5. Keep text explanations concise but informative.
      
      Use Markdown for formatting.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "I couldn't generate an explanation at this time.";
  } catch (error) {
    return "Sorry, I'm having trouble connecting to the tutor service.";
  }
};
