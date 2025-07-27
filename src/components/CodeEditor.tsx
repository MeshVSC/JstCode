'use client';

import { useRef, useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { FileNode } from '@/types/project';
import EditorToolbar from './EditorToolbar';
import SettingsPanel, { useEditorSettings } from './SettingsPanel';
import { useTheme } from '@/contexts/ThemeContext';
import PackageManager, { Package } from './PackageManager';

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
  const editorRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const { settings, updateSettings } = useEditorSettings();
  const { currentTheme } = useTheme();
  
  // Auto-detect editor theme based on app theme
  const editorTheme = currentTheme === 'clean-light' ? 'jstcode-light' : 'jstcode-dark';
  const [showSettings, setShowSettings] = useState(false);
  const [showPackages, setShowPackages] = useState(false);
  
  // Update Monaco themes when app theme changes
  useEffect(() => {
    if (editorRef.current) {
      updateMonacoThemes();
    }
  }, [currentTheme]);
  
  const updateMonacoThemes = () => {
    if (!editorRef.current) return;
    
    const monaco = (window as any).monaco;
    if (!monaco) return;
    
    // Function to get current CSS variable values
    const getCSSVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    
    // Re-define themes with current CSS variables
    monaco.editor.defineTheme('jstcode-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': getCSSVar('--surface-elevated') || '#161B22',
        'editor.foreground': getCSSVar('--text-primary') || '#E6EDF3',
        'editor.lineHighlightBackground': getCSSVar('--surface-hover') || '#262C36',
        'editor.selectionBackground': (getCSSVar('--primary') || '#007ACC') + '40',
        'editorLineNumber.foreground': getCSSVar('--text-muted') || '#656D76',
        'editorLineNumber.activeForeground': getCSSVar('--text-secondary') || '#7D8590',
        'editorWidget.background': getCSSVar('--surface-elevated') || '#161B22',
        'editorWidget.border': getCSSVar('--surface-border') || '#30363D',
        'input.background': getCSSVar('--surface-input') || '#30363D',
        'input.border': getCSSVar('--surface-border') || '#30363D',
        'dropdown.background': getCSSVar('--surface-elevated') || '#161B22',
        'dropdown.border': getCSSVar('--surface-border') || '#30363D',
      }
    });

    monaco.editor.defineTheme('jstcode-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': getCSSVar('--surface-elevated') || '#F8F9FA',
        'editor.foreground': getCSSVar('--text-primary') || '#212529',
        'editor.lineHighlightBackground': getCSSVar('--surface-hover') || '#E9ECEF',
        'editor.selectionBackground': (getCSSVar('--primary') || '#0969DA') + '40',
        'editorLineNumber.foreground': getCSSVar('--text-muted') || '#ADB5BD',
        'editorLineNumber.activeForeground': getCSSVar('--text-secondary') || '#6C757D',
        'editorWidget.background': getCSSVar('--surface-elevated') || '#F8F9FA',
        'editorWidget.border': getCSSVar('--surface-border') || '#DEE2E6',
        'input.background': getCSSVar('--surface-input') || '#FFFFFF',
        'input.border': getCSSVar('--surface-border') || '#DEE2E6',
        'dropdown.background': getCSSVar('--surface-elevated') || '#F8F9FA',
        'dropdown.border': getCSSVar('--surface-border') || '#DEE2E6',
      }
    });
    
    // Apply the correct theme
    const newTheme = currentTheme === 'clean-light' ? 'jstcode-light' : 'jstcode-dark';
    monaco.editor.setTheme(newTheme);
  };
  
  const handleChange = (newValue: string | undefined) => {
    onChange(newValue || '');
  };

  const handleAddPackage = (pkg: Package) => {
    if (!activeFile || !activeFile.content) return;
    
    // Add import statement at the top of the file
    const importStatement = pkg.imports[0];
    const currentCode = activeFile.content;
    
    // Check if import already exists
    if (currentCode.includes(importStatement)) {
      return; // Already imported
    }
    
    // Find existing imports and add after them, or at the top
    const lines = currentCode.split('\n');
    let insertIndex = 0;
    
    // Find the last import statement
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ') || lines[i].trim().startsWith('//')) {
        insertIndex = i + 1;
      } else if (lines[i].trim() !== '') {
        break;
      }
    }
    
    // Insert the import
    lines.splice(insertIndex, 0, importStatement);
    
    // Add empty line if needed
    if (insertIndex < lines.length - 1 && lines[insertIndex + 1].trim() !== '') {
      lines.splice(insertIndex + 1, 0, '');
    }
    
    const newCode = lines.join('\n');
    onChange(newCode);
  };

  const handleEditorDidMount = (editor: any, monaco: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    editorRef.current = editor;
    
    // Enhanced TypeScript configuration
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types'],
      strict: false, // More lenient for beginners
      noImplicitAny: false,
    });

    // Add React type definitions
    const reactTypes = `
    declare module 'react' {
      export interface Component<P = {}, S = {}> {
        props: P;
        state: S;
        setState(state: Partial<S>): void;
      }
      export function useState<T>(initial: T): [T, (value: T) => void];
      export function useEffect(effect: () => void, deps?: any[]): void;
      export function useCallback<T extends Function>(callback: T, deps: any[]): T;
      export function useMemo<T>(factory: () => T, deps: any[]): T;
      export function useRef<T>(initial: T | null): { current: T | null };
      export const Fragment: any;
      export default React;
    }
    
    declare global {
      namespace JSX {
        interface IntrinsicElements {
          div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
          span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
          button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
          input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
          img: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
          h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
          h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
          h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
          p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
          a: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
          ul: React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
          li: React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
        }
      }
    }`;

    monaco.languages.typescript.typescriptDefaults.addExtraLib(reactTypes, 'react.d.ts');

    // Enhanced autocomplete for React patterns
    monaco.languages.registerCompletionItemProvider('typescript', {
      provideCompletionItems: (model: any, position: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = [
          // React hooks
          {
            label: 'useState',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'React hook for managing component state',
            insertText: 'useState(${1:initialValue})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
          },
          {
            label: 'useEffect',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'React hook for side effects',
            insertText: 'useEffect(() => {\n\t${1:// effect}\n}, [${2:dependencies}])',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
          },
          // Common React patterns
          {
            label: 'component',
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: 'Create a React functional component',
            insertText: 'function ${1:ComponentName}() {\n\treturn (\n\t\t<div>\n\t\t\t${2:// content}\n\t\t</div>\n\t);\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
          },
          // CSS classes autocomplete
          {
            label: 'className',
            kind: monaco.languages.CompletionItemKind.Property,
            documentation: 'CSS class names for styling',
            insertText: 'className="${1:class-name}"',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
          },
        ];

        return { suggestions };
      },
    });

    // Initialize themes
    updateMonacoThemes();

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      const toolbar = document.querySelector('[data-format-button]') as HTMLButtonElement;
      if (toolbar && !toolbar.disabled) {
        toolbar.click();
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      editor.getAction('actions.find').run();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH, () => {
      editor.getAction('editor.action.startFindReplaceAction').run();
    });
  };

  return (
    <div className="h-full w-full flex flex-col">
      <EditorToolbar 
        activeFile={activeFile ?? null} 
        onCodeChange={onChange}
        minimapEnabled={settings.minimap}
        onToggleMinimap={() => updateSettings({ ...settings, minimap: !settings.minimap })}
        // onShowSettings={() => setShowSettings(true)} // Removed redundant settings button
        onShowPackages={() => setShowPackages(true)}
      />
      
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage={language}
          value={value}
          onChange={handleChange}
          onMount={handleEditorDidMount}
          theme={editorTheme}
          options={{
            minimap: { enabled: settings.minimap },
            scrollBeyondLastLine: false,
            fontSize: settings.fontSize,
            lineNumbers: settings.lineNumbers,
            roundedSelection: false,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            automaticLayout: true,
            tabSize: settings.tabSize,
            insertSpaces: true,
            wordWrap: settings.wordWrap,
            formatOnPaste: true,
            formatOnType: true,
            // Enhanced IntelliSense options
            quickSuggestions: {
              other: true,
              comments: true,
              strings: true,
            },
            parameterHints: {
              enabled: true,
              cycle: true,
            },
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'smart',
            acceptSuggestionOnCommitCharacter: true,
            snippetSuggestions: 'inline',
            hover: {
              enabled: true,
              delay: 300,
            },
            find: {
              addExtraSpaceOnTop: false,
              autoFindInSelection: 'never',
              seedSearchStringFromSelection: 'always',
            },
          }}
        />
      </div>
      
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={updateSettings}
      />
      
      <PackageManager
        isOpen={showPackages}
        onClose={() => setShowPackages(false)}
        onAddPackage={handleAddPackage}
      />
    </div>
  );
}