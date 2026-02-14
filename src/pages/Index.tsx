import { useState, useCallback } from "react";
import { Play, RotateCcw, Code2 } from "lucide-react";
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
      <header className="flex items-center justify-between border-b border-border bg-toolbar px-4 py-2">
        <div className="flex items-center gap-2.5">
          <Code2 className="h-5 w-5 text-primary" />
          <h1 className="font-mono text-sm font-bold tracking-tight text-foreground">
            C# Compiler
          </h1>
          <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
            .NET
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 font-mono text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 font-mono text-xs font-bold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" />
            {isRunning ? "Running..." : "Run"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex flex-1 flex-col border-r border-border">
          <div className="flex items-center border-b border-border bg-tab-active px-4 py-1.5">
            <span className="font-mono text-xs text-muted-foreground">Main.cs</span>
          </div>
          <div className="flex-1">
            <CodeEditor code={code} onChange={setCode} />
          </div>
        </div>

        {/* Output */}
        <div className="flex w-[40%] min-w-[300px] flex-col">
          <OutputPanel
            output={output}
            isRunning={isRunning}
            isError={isError}
            executionTime={executionTime}
          />
        </div>
      </div>

      {/* Status Bar */}
      <footer className="flex items-center justify-between border-t border-border bg-status-bar px-4 py-1">
        <span className="font-mono text-[11px] text-muted-foreground">C#</span>
        <span className="font-mono text-[11px] text-muted-foreground">
          UTF-8
        </span>
      </footer>
    </div>
  );
};

export default Index;
