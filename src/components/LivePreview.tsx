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

  return (
    <div className="h-full w-full">
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
    </div>
  );
}