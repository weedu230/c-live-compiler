import { Terminal, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface OutputPanelProps {
  output: string;
  isRunning: boolean;
  isError: boolean;
  executionTime?: number;
}

const OutputPanel = ({ output, isRunning, isError, executionTime }: OutputPanelProps) => {
  return (
    <div className="flex h-full flex-col bg-terminal">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <Terminal className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Output
        </span>
        {isRunning && (
          <div className="ml-auto flex items-center gap-1.5 text-info animate-fade-in">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="font-mono text-xs animate-[pulse_1s_ease-in-out_infinite]">Compiling...</span>
          </div>
        )}
        {!isRunning && output && !isError && (
          <div className="ml-auto flex items-center gap-1.5 text-success animate-scale-in">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="font-mono text-xs">
              Success{executionTime ? ` (${executionTime}ms)` : ""}
            </span>
          </div>
        )}
        {!isRunning && isError && (
          <div className="ml-auto flex items-center gap-1.5 text-destructive animate-scale-in">
            <XCircle className="h-3.5 w-3.5 animate-[pulse_1s_ease-in-out_3]" />
            <span className="font-mono text-xs">Error</span>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-auto p-4">
        {output ? (
          <pre
            className={`animate-fade-in font-mono text-sm whitespace-pre-wrap leading-relaxed ${
              isError ? "text-destructive" : "text-foreground"
            }`}
          >
            {output}
          </pre>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 animate-fade-in">
            <Terminal className="h-10 w-10 text-muted-foreground/30 animate-[pulse_3s_ease-in-out_infinite]" />
            <p className="font-mono text-sm text-muted-foreground/60 italic">
              Click "Run" to compile and execute your C# code...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
