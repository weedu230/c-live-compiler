// Multiple Piston API endpoints with fallback support
const PISTON_APIS = [
  "https://emkc.org/api/v2/piston/execute",
  "https://piston.turbio.dev/api/v2/execute",
  "https://piston-api.vercel.app/api/v2/execute",
];

const TIMEOUT_MS = 30000; // 30 second timeout
const MAX_RETRIES = 2; // Retry failed requests up to 2 times

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

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout - server took too long to respond");
    }
    throw error;
  }
}

async function tryCompileWithApi(
  apiUrl: string,
  code: string,
  retries: number = 0
): Promise<any> {
  try {
    const response = await fetchWithTimeout(
      apiUrl,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: "csharp",
          version: "*",
          files: [{ name: "Main.cs", content: code }],
        }),
      },
      TIMEOUT_MS
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error("Authentication failed - API access denied");
      }
      if (response.status >= 500 && retries < MAX_RETRIES) {
        // Retry on server errors
        await new Promise((resolve) => setTimeout(resolve, 1000 * (retries + 1)));
        return tryCompileWithApi(apiUrl, code, retries + 1);
      }
      throw new Error(`API returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (retries < MAX_RETRIES && error instanceof Error) {
      // Retry on network errors (except timeout and auth errors)
      if (
        !error.message.includes("timeout") &&
        !error.message.includes("Authentication")
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (retries + 1)));
        return tryCompileWithApi(apiUrl, code, retries + 1);
      }
    }
    throw error;
  }
}

export async function compileCSharp(code: string): Promise<CompileResult> {
  const start = performance.now();
  let lastError: Error | null = null;

  // Try each API endpoint with fallback
  for (let i = 0; i < PISTON_APIS.length; i++) {
    try {
      const data = await tryCompileWithApi(PISTON_APIS[i], code);
      const elapsed = Math.round(performance.now() - start);

      const compileError = data.compile?.stderr || data.compile?.output;
      if (data.compile?.code !== 0 && compileError) {
        return {
          output: stripCompilerHeader(compileError),
          isError: true,
          executionTime: elapsed,
        };
      }

      const runOutput = (data.run?.stdout || "") + (data.run?.stderr || "");
      const hasError = data.run?.code !== 0 && !!data.run?.stderr;

      return {
        output: stripCompilerHeader(runOutput) || "(No output)",
        isError: hasError,
        executionTime: elapsed,
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error("Unknown error");
      // Continue to next API endpoint on error
      continue;
    }
  }

  // All endpoints failed
  const elapsed = Math.round(performance.now() - start);
  const errorMessage = lastError
    ? lastError.message.includes("timeout")
      ? "Request timeout - all API servers are taking too long to respond"
      : lastError.message.includes("Authentication")
      ? "Authentication failed - unable to access compilation API"
      : lastError.message.includes("Failed to fetch") || lastError.message.includes("NetworkError")
      ? "Network error - please check your internet connection"
      : `Failed to compile: ${lastError.message}`
    : "Failed to compile: All API endpoints are unavailable";

  return {
    output: errorMessage,
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
