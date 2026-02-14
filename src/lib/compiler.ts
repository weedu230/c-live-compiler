const PISTON_API = "https://emkc.org/api/v2/piston/execute";

export interface CompileResult {
  output: string;
  isError: boolean;
  executionTime: number;
}

function stripCompilerHeader(text: string): string {
  return text
    .replace(/Microsoft \(R\) Visual C# Compiler version .+\r?\n/g, "")
    .replace(/Copyright \(C\) Microsoft Corporation\. All rights reserved\.\r?\n?/g, "")
    .replace(/^\s*\n/, "")
    .trim();
}

export async function compileCSharp(code: string): Promise<CompileResult> {
  const start = performance.now();

  try {
    const response = await fetch(PISTON_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: "csharp",
        version: "*",
        files: [{ name: "Main.cs", content: code }],
      }),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const elapsed = Math.round(performance.now() - start);

    const compileError = data.compile?.stderr || data.compile?.output;
    if (data.compile?.code !== 0 && compileError) {
      return { output: stripCompilerHeader(compileError), isError: true, executionTime: elapsed };
    }

    const runOutput = (data.run?.stdout || "") + (data.run?.stderr || "");
    const hasError = data.run?.code !== 0 && !!data.run?.stderr;

    return {
      output: stripCompilerHeader(runOutput) || "(No output)",
      isError: hasError,
      executionTime: elapsed,
    };
  } catch (err) {
    const elapsed = Math.round(performance.now() - start);
    return {
      output: `Failed to compile: ${err instanceof Error ? err.message : "Unknown error"}`,
      isError: true,
      executionTime: elapsed,
    };
  }
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
