// Alternative Piston API endpoints for better reliability
const PISTON_ENDPOINTS = [
  "https://emkc.org/api/v2/piston/execute",
  "https://piston-api.mrafr4sve1.repl.co/api/v2/piston/execute",
];

// Timeout for each API request (in milliseconds)
const REQUEST_TIMEOUT = 10000;

// Maximum retry attempts per endpoint
const MAX_RETRIES = 2;

// Retry delay in milliseconds
const RETRY_DELAY = 1000;

export interface CompileResult {
  output: string;
  isError: boolean;
  executionTime: number;
}

/**
 * Fetch with timeout support
 * @param url - URL to fetch
 * @param options - Fetch options
 * @param timeout - Timeout in milliseconds
 * @returns Promise with the response
 */
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
      throw new Error("Request timeout - the compiler service took too long to respond");
    }
    throw error;
  }
}

/**
 * Sleep for a specified duration
 * @param ms - Milliseconds to sleep
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  const errors: string[] = [];

  // Try multiple endpoints for better reliability
  for (let i = 0; i < PISTON_ENDPOINTS.length; i++) {
    const endpoint = PISTON_ENDPOINTS[i];
    
    // Try with retries for each endpoint
    for (let retry = 0; retry < MAX_RETRIES; retry++) {
      try {
        const response = await fetchWithTimeout(
          endpoint,
          {
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
          },
          REQUEST_TIMEOUT
        );

        // If we get 401, try next endpoint immediately
        if (response.status === 401) {
          console.warn(`Authentication failed for ${endpoint}`);
          errors.push(`${endpoint}: Authentication failed`);
          break; // Move to next endpoint
        }

        if (!response.ok) {
          const errorMsg = `${endpoint}: HTTP ${response.status} ${response.statusText}`;
          console.error(errorMsg);
          errors.push(errorMsg);
          
          // Retry on server errors (5xx)
          if (response.status >= 500 && retry < MAX_RETRIES - 1) {
            await sleep(RETRY_DELAY * (retry + 1));
            continue;
          }
          break; // Move to next endpoint for client errors
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
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        console.error(`Error with endpoint ${endpoint} (attempt ${retry + 1}/${MAX_RETRIES}):`, err);
        errors.push(`${endpoint}: ${errorMsg}`);
        
        // Retry with exponential backoff
        if (retry < MAX_RETRIES - 1) {
          await sleep(RETRY_DELAY * (retry + 1));
        }
      }
    }
  }

  // All endpoints failed
  const elapsed = Math.round(performance.now() - start);
  
  // Create a detailed error message
  let errorMessage = "Failed to compile: Unable to connect to the compiler service.\n\n";
  
  // Check if it's a network/CORS issue
  if (errors.some(e => e.includes("Failed to fetch") || e.includes("timeout"))) {
    errorMessage += "⚠️ Connection Error: The compiler service could not be reached.\n\n";
    errorMessage += "Possible causes:\n";
    errorMessage += "• Network connectivity issues\n";
    errorMessage += "• Browser security/CORS restrictions\n";
    errorMessage += "• Compiler service is temporarily down\n";
    errorMessage += "• Ad blocker or firewall blocking the request\n\n";
    errorMessage += "Please try:\n";
    errorMessage += "1. Check your internet connection\n";
    errorMessage += "2. Disable ad blockers or browser extensions\n";
    errorMessage += "3. Try again in a few moments\n";
  } else {
    errorMessage += "All compiler endpoints are currently unavailable.\n\n";
    errorMessage += "Details:\n";
    errors.forEach((err, idx) => {
      errorMessage += `${idx + 1}. ${err}\n`;
    });
  }

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