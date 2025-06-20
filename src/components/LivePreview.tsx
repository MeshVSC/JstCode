'use client';

import { Sandpack } from '@codesandbox/sandpack-react';
import ErrorBoundary from './ErrorBoundary';

interface LivePreviewProps {
  code: string;
  filename: string;
}

export default function LivePreview({ code, filename }: LivePreviewProps) {
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || 'tsx';
  };

  const isTypeScriptFile = (filename: string) => {
    const ext = getFileExtension(filename);
    return ext === 'tsx' || ext === 'ts';
  };

  const files = {
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
    <div className="h-full w-full relative">
      <ErrorBoundary>
        <Sandpack
          template={template}
          files={files}
          options={{
            showNavigator: false,
            showTabs: false,
            showLineNumbers: false,
            showInlineErrors: true,
            wrapContent: true,
            editorHeight: '100%',
            editorWidthPercentage: 0,
            showOpenInCodeSandbox: false,
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
        className="absolute bottom-4 right-4 w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors z-10"
        title="Open in CodeSandbox"
      >
        ?
      </button>
    </div>
  );
}