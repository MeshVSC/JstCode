'use client';

import { useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { FileNode } from '@/types/project';
import EditorToolbar from './EditorToolbar';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  activeFile?: FileNode | null;
}

export default function CodeEditor({ 
  value, 
  onChange, 
  language = 'typescript',
  activeFile
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const handleChange = (newValue: string | undefined) => {
    onChange(newValue || '');
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Add Ctrl+S / Cmd+S shortcut for formatting
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // This will be handled by the toolbar's format function
      const toolbar = document.querySelector('[data-format-button]') as HTMLButtonElement;
      if (toolbar && !toolbar.disabled) {
        toolbar.click();
      }
    });
  };

  return (
    <div className="h-full w-full flex flex-col">
      <EditorToolbar activeFile={activeFile || null} onCodeChange={onChange} />
      
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage={language}
          value={value}
          onChange={handleChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
    </div>
  );
}