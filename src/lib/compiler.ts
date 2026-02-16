// Alternative Piston API endpoints for better reliability
const PISTON_ENDPOINTS = [
  "https://emkc.org/api/v2/piston/execute",
  "https://piston-api.mrafr4sve1.repl.co/api/v2/piston/execute",
];

export interface CompileResult {
  output: string;
  isError: boolean;
  executionTime: number;
}

/**
 * Removes compiler header information from output
 * @param text - Raw compiler output
 * @returns Cleaned output text
 */
function stripCompilerHeader(text: string): string {
  return text
    .replace(/Microsoft \(R\) Visual C# Compiler version .+\r?\n/g, "")
    .replace(/Copyright \(C\) Microsoft Corporation\. All rights reserved\.\r?\n?/g, "")
    .replace(/^\s*\n/, "")
    .trim();
}

/**
 * Compiles and executes C# code using Piston API
 * @param code - C# source code to compile and run
 * @returns Compilation result with output, error status, and execution time
 */
export async function compileCSharp(code: string): Promise<CompileResult> {
  const start = performance.now();

  // Try multiple endpoints for better reliability
  for (let i = 0; i < PISTON_ENDPOINTS.length; i++) {
    const endpoint = PISTON_ENDPOINTS[i];
    
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          language: "csharp",
          version: "*",
          files: [{ name: "Main.cs", content: code }],
        }),
      });

      // If we get 401, try next endpoint
      if (response.status === 401) {
        console.warn(`Authentication failed for ${endpoint}, trying next...`);
        if (i < PISTON_ENDPOINTS.length - 1) continue;
        throw new Error("All API endpoints failed authentication");
      }

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const elapsed = Math.round(performance.now() - start);

      // Check for compilation errors
      const compileError = data.compile?.stderr || data.compile?.output;
      if (data.compile?.code !== 0 && compileError) {
        return { 
          output: stripCompilerHeader(compileError), 
          isError: true, 
          executionTime: elapsed 
        };
      }

      // Get runtime output
      const runOutput = (data.run?.stdout || "") + (data.run?.stderr || "");
      const hasError = data.run?.code !== 0 && !!data.run?.stderr;

      return {
        output: stripCompilerHeader(runOutput) || "(No output)",
        isError: hasError,
        executionTime: elapsed,
      };
    } catch (err) {
      console.error(`Error with endpoint ${endpoint}:`, err);
      
      // If this is the last endpoint, return error
      if (i === PISTON_ENDPOINTS.length - 1) {
        const elapsed = Math.round(performance.now() - start);
        return {
          output: `Failed to compile: ${err instanceof Error ? err.message : "Unknown error"}\n\nPlease try again in a moment. If the issue persists, the compiler service may be temporarily unavailable.`,
          isError: true,
          executionTime: elapsed,
        };
      }
    }
  }

  // Fallback error (should not reach here)
  const elapsed = Math.round(performance.now() - start);
  return {
    output: "Failed to compile: No available endpoints",
    isError: true,
    executionTime: elapsed,
  };
}

export const DEFAULT_CODE = `using System;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello, World!");
        
        // Try modifying this code!
        for (int i = 1; i <= 5; i++)
        {
            Console.WriteLine($"Count: {i}");
        }
    }
}`;