'use client';

import { useState, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import FileUploader from '@/components/FileUploader';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import PDFExporter from '@/components/PDFExporter';

export default function Home() {
  const [code, setCode] = useState('');
  const [filename, setFilename] = useState('component.tsx');
  const previewRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (content: string, name: string) => {
    setCode(content);
    setFilename(name);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">JstCode</h1>
            <p className="text-gray-400 text-sm">just code</p>
          </div>
          <div className="flex items-center gap-4">
            {code && (
              <PDFExporter previewRef={previewRef} filename={filename} />
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {!code ? (
          <div className="h-full flex items-center justify-center p-8">
            <div className="max-w-md w-full">
              <FileUploader onFileUpload={handleFileUpload} />
            </div>
          </div>
        ) : (
          <PanelGroup direction="horizontal" className="h-full">
            <Panel defaultSize={50} minSize={30}>
              <div className="h-full flex flex-col">
                <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                  <p className="text-white text-sm font-medium">{filename}</p>
                </div>
                <div className="flex-1">
                  <CodeEditor
                    value={code}
                    onChange={handleCodeChange}
                    language="typescript"
                  />
                </div>
              </div>
            </Panel>
            
            <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-gray-600 transition-colors" />
            
            <Panel defaultSize={50} minSize={30}>
              <div className="h-full flex flex-col">
                <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                  <p className="text-white text-sm font-medium">Live Preview</p>
                </div>
                <div className="flex-1" ref={previewRef}>
                  <LivePreview code={code} filename={filename} />
                </div>
              </div>
            </Panel>
          </PanelGroup>
        )}
      </main>
    </div>
  );
}