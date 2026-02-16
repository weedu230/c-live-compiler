import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { compileCSharp } from "@/lib/compiler";

describe("compileCSharp", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should return error result when all endpoints fail", async () => {
    // Mock fetch to simulate network failure
    global.fetch = vi.fn(() =>
      Promise.reject(new Error("Failed to fetch"))
    ) as any;

    const promise = compileCSharp("Console.WriteLine('test');");
    vi.runAllTimers();
    const result = await promise;

    expect(result.isError).toBe(true);
    expect(result.output).toContain("Failed to compile");
    expect(result.output).toContain("Network error");
    expect(result.executionTime).toBeGreaterThanOrEqual(0);
  });

  it("should handle timeout errors", async () => {
    // Mock fetch to simulate timeout with AbortController
    global.fetch = vi.fn(() => {
      const error: any = new Error("The operation was aborted");
      error.name = "AbortError";
      return Promise.reject(error);
    }) as any;

    const result = await compileCSharp("Console.WriteLine('test');");

    expect(result.isError).toBe(true);
    expect(result.output).toContain("Request timeout");
    expect(result.executionTime).toBeGreaterThanOrEqual(0);
  });

  it("should handle successful compilation", async () => {
    // Mock successful API response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            compile: { code: 0 },
            run: {
              stdout: "Hello, World!\n",
              stderr: "",
              code: 0,
            },
          }),
      })
    ) as any;

    const result = await compileCSharp(
      'Console.WriteLine("Hello, World!");'
    );

    expect(result.isError).toBe(false);
    expect(result.output).toContain("Hello, World!");
    expect(result.executionTime).toBeGreaterThanOrEqual(0);
  });

  it("should handle compilation errors", async () => {
    // Mock compilation error response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            compile: {
              code: 1,
              stderr: "error CS1002: ; expected",
            },
            run: null,
          }),
      })
    ) as any;

    const result = await compileCSharp("Console.WriteLine('test')"); // missing semicolon

    expect(result.isError).toBe(true);
    expect(result.output).toContain("error");
    expect(result.executionTime).toBeGreaterThanOrEqual(0);
  });

  it("should strip compiler headers from output", async () => {
    // Mock response with Microsoft compiler headers
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            compile: { code: 0 },
            run: {
              stdout:
                "Microsoft (R) Visual C# Compiler version 4.0.0\nCopyright (C) Microsoft Corporation. All rights reserved.\n\nHello, World!\n",
              stderr: "",
              code: 0,
            },
          }),
      })
    ) as any;

    const result = await compileCSharp(
      'Console.WriteLine("Hello, World!");'
    );

    expect(result.output).toBe("Hello, World!");
    expect(result.output).not.toContain("Microsoft");
    expect(result.output).not.toContain("Copyright");
  });

  it("should try multiple endpoints on failure", async () => {
    let callCount = 0;
    global.fetch = vi.fn(() => {
      callCount++;
      return Promise.reject(new Error("Failed to fetch"));
    }) as any;

    const promise = compileCSharp("Console.WriteLine('test');");
    vi.runAllTimers();
    await promise;

    // Should try all 3 endpoints
    expect(callCount).toBe(3);
  });

  it("should handle 401 authentication errors", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
      })
    ) as any;

    const promise = compileCSharp("Console.WriteLine('test');");
    vi.runAllTimers();
    const result = await promise;

    expect(result.isError).toBe(true);
    expect(result.output).toContain("Failed to compile");
  });
});
