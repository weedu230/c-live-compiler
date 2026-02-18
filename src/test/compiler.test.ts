import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { compileCSharp } from "../lib/compiler";

describe("compileCSharp", () => {
  beforeEach(() => {
    // Use real timers for most tests
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should successfully compile and run valid C# code", async () => {
    const mockResponse = {
      compile: { code: 0, stderr: "", output: "" },
      run: { code: 0, stdout: "Hello, World!\n", stderr: "" },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const code = 'using System; class Program { static void Main() { Console.WriteLine("Hello, World!"); } }';
    const result = await compileCSharp(code);

    expect(result.isError).toBe(false);
    expect(result.output).toContain("Hello, World!");
    expect(result.executionTime).toBeGreaterThanOrEqual(0);
  });

  it("should handle compilation errors", async () => {
    const mockResponse = {
      compile: { 
        code: 1, 
        stderr: "Main.cs(1,1): error CS1001: Identifier expected", 
        output: "" 
      },
      run: null,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const code = "invalid C# code";
    const result = await compileCSharp(code);

    expect(result.isError).toBe(true);
    expect(result.output).toContain("error CS1001");
  });

  it("should fallback to next API on failure", async () => {
    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount <= 3) {
        // First API fails with server error (will retry 2 times = 3 total calls)
        return Promise.resolve({
          ok: false,
          status: 500,
        });
      }
      // Next API succeeds
      return Promise.resolve({
        ok: true,
        json: async () => ({
          compile: { code: 0, stderr: "", output: "" },
          run: { code: 0, stdout: "Success from backup API\n", stderr: "" },
        }),
      });
    });

    const code = 'using System; class Program { static void Main() { Console.WriteLine("Test"); } }';
    const result = await compileCSharp(code);

    expect(result.isError).toBe(false);
    expect(result.output).toContain("Success from backup API");
    expect(callCount).toBeGreaterThan(3); // Called first API 3 times (initial + 2 retries) then fallback API
  }, 10000);

  it("should provide network error message", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Failed to fetch"));

    const code = 'using System; class Program { static void Main() { Console.WriteLine("Test"); } }';
    const result = await compileCSharp(code);

    expect(result.isError).toBe(true);
    expect(result.output).toContain("Network error");
  }, 15000);

  it("should handle authentication errors", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
    });

    const code = 'using System; class Program { static void Main() { Console.WriteLine("Test"); } }';
    const result = await compileCSharp(code);

    expect(result.isError).toBe(true);
    expect(result.output).toContain("Authentication");
  });

  it("should strip Microsoft compiler headers from output", async () => {
    const mockResponse = {
      compile: { code: 0, stderr: "", output: "" },
      run: { 
        code: 0, 
        stdout: "Microsoft (R) Visual C# Compiler version 4.8.0\nCopyright (C) Microsoft Corporation. All rights reserved.\n\nHello, World!\n", 
        stderr: "" 
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const code = 'using System; class Program { static void Main() { Console.WriteLine("Hello, World!"); } }';
    const result = await compileCSharp(code);

    expect(result.isError).toBe(false);
    expect(result.output).toBe("Hello, World!");
    expect(result.output).not.toContain("Microsoft");
    expect(result.output).not.toContain("Copyright");
  });
});
