import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

const CodeEditor = ({ code, onChange }: CodeEditorProps) => {
  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage="csharp"
        theme="vs-dark"
        value={code}
        onChange={(value) => onChange(value || "")}
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 16 },
          lineNumbers: "on",
          renderLineHighlight: "line",
          cursorBlinking: "smooth",
          smoothScrolling: true,
          wordWrap: "on",
          automaticLayout: true,
          bracketPairColorization: { enabled: true },
          suggestOnTriggerCharacters: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
