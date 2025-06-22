'use client';

import { useEffect } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import ErrorBoundary from './ErrorBoundary';
import ConsolePanel from './ConsolePanel';
import { useConsoleCapture } from '@/hooks/useConsoleCapture';

interface LivePreviewProps {
  code: string;
  filename: string;
  allFiles?: Record<string, string>;
}

export default function LivePreview({ code, filename, allFiles }: LivePreviewProps) {
  const { messages, clearMessages, handleSandpackMessage } = useConsoleCapture();

  // Listen for console messages from Sandpack
  useEffect(() => {
    window.addEventListener('message', handleSandpackMessage);
    return () => window.removeEventListener('message', handleSandpackMessage);
  }, [handleSandpackMessage]);
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || 'tsx';
  };

  const isTypeScriptFile = (filename: string) => {
    const ext = getFileExtension(filename);
    return ext === 'tsx' || ext === 'ts';
  };

  // Prepare files for Sandpack - support multi-file projects
  const files = allFiles && Object.keys(allFiles).length > 1 
    ? Object.entries(allFiles).reduce((acc, [path, content]) => {
        acc[`/${path}`] = {
          code: content,
          active: path === filename,
        };
        return acc;
      }, {} as Record<string, { code: string; active?: boolean }>)
    : {
        [`/${filename}`]: {
          code: code,
          active: true,
        },
      };

  const template = isTypeScriptFile(filename) ? 'react-ts' : 'react';

  if (!code.trim()) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">👀</div>
          <p>Upload a TSX file to see the live preview</p>
        </div>
      </div>
    );
  }

  const openInCodeSandbox = () => {
    const sandboxConfig = {
      files: {
        [filename]: {
          content: code
        },
        'package.json': {
          content: JSON.stringify({
            dependencies: {
              react: '^18.0.0',
              'react-dom': '^18.0.0',
              'react-scripts': '5.0.0'
            }
          }, null, 2)
        }
      }
    };
    
    const parameters = btoa(JSON.stringify(sandboxConfig));
    window.open(`https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`, '_blank');
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Preview Area */}
      <div className="flex-1 relative">
        <ErrorBoundary>
          <Sandpack
            template={template}
            files={files}
            options={{
              showNavigator: false,
              showTabs: false,
              showLineNumbers: false,
              showInlineErrors: true,
              showConsole: true,
              showConsoleButton: false,
              wrapContent: true,
              editorHeight: '100%',
              editorWidthPercentage: 0,
              autoReload: true,
              recompileMode: 'delayed',
              recompileDelay: 300,
              classes: {
                'sp-wrapper': 'h-full',
                'sp-layout': 'h-full',
                'sp-preview-container': 'h-full',
                'sp-preview-iframe': 'h-full',
              },
            }}
            theme="dark"
          />
        </ErrorBoundary>
        
        <button
          onClick={openInCodeSandbox}
          className="absolute bottom-4 right-4 w-8 h-8 bg-[#3e3e42] hover:bg-[#4e4e52] text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors z-10"
          title="Open in CodeSandbox"
        >
          🚀
        </button>
      </div>
      
      {/* Console Panel */}
      <ConsolePanel 
        messages={messages} 
        onClear={clearMessages} 
      />
    </div>
  );
}