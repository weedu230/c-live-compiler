import { useState, useCallback } from "react";
import { Play, RotateCcw, Code2, Zap } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";
import OutputPanel from "@/components/OutputPanel";
import { compileCSharp, DEFAULT_CODE, type CompileResult } from "@/lib/compiler";

const Index = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isError, setIsError] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | undefined>();

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutput("");
    setIsError(false);

    const result: CompileResult = await compileCSharp(code);

    setOutput(result.output);
    setIsError(result.isError);
    setExecutionTime(result.executionTime);
    setIsRunning(false);
  }, [code]);

  const handleReset = () => {
    setCode(DEFAULT_CODE);
    setOutput("");
    setIsError(false);
    setExecutionTime(undefined);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Top Bar */}
      <header className="animate-fade-in flex items-center justify-between border-b border-border bg-toolbar px-4 py-2">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Code2 className="h-5 w-5 text-primary animate-[pulse_3s_ease-in-out_infinite]" />
            <div className="absolute -inset-1 rounded-full bg-primary/20 animate-[ping_3s_ease-in-out_infinite] opacity-30" />
          </div>
          <h1 className="font-mono text-sm font-bold tracking-tight text-foreground">
            C# Compiler
          </h1>
          <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground animate-scale-in">
            .NET
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="hover-scale flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 font-mono text-xs font-medium text-secondary-foreground transition-all duration-200 hover:bg-muted active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5 transition-transform duration-300 hover:rotate-[-180deg]" />
            Reset
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="group relative flex items-center gap-1.5 overflow-hidden rounded-md bg-primary px-4 py-1.5 font-mono text-xs font-bold text-primary-foreground transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] hover:brightness-110 disabled:opacity-50 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            {isRunning ? (
              <Zap className="h-3.5 w-3.5 animate-[pulse_0.5s_ease-in-out_infinite]" />
            ) : (
              <Play className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110" />
            )}
            {isRunning ? "Running..." : "Run"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="animate-fade-in flex flex-1 flex-col border-r border-border" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center border-b border-border bg-tab-active px-4 py-1.5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/60 animate-scale-in" style={{ animationDelay: "300ms" }} />
                <div className="h-2.5 w-2.5 rounded-full bg-warning/60 animate-scale-in" style={{ animationDelay: "400ms" }} />
                <div className="h-2.5 w-2.5 rounded-full bg-success/60 animate-scale-in" style={{ animationDelay: "500ms" }} />
              </div>
              <span className="font-mono text-xs text-muted-foreground">Main.cs</span>
            </div>
          </div>
          <div className="flex-1">
            <CodeEditor code={code} onChange={setCode} />
          </div>
        </div>

        {/* Output */}
        <div className="animate-fade-in flex w-[40%] min-w-[300px] flex-col" style={{ animationDelay: "200ms" }}>
          <OutputPanel
            output={output}
            isRunning={isRunning}
            isError={isError}
            executionTime={executionTime}
          />
        </div>
      </div>

      {/* Status Bar */}
      <footer className="animate-fade-in flex items-center justify-between border-t border-border bg-status-bar px-4 py-1" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-success animate-[pulse_2s_ease-in-out_infinite]" />
          <span className="font-mono text-[11px] text-muted-foreground">C#</span>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          UTF-8
        </span>
      </footer>
    </div>
  );
};

export default Index;
