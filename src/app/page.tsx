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
    <div className="h-screen flex bg-[#1e1e1e] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#252526] border-r border-[#2d2d30] flex flex-col">
        {/* Header */}
        <div className="h-9 bg-[#2d2d30] flex items-center justify-between px-3 border-b border-[#3e3e42]">
          <span className="text-xs font-medium text-[#cccccc] uppercase tracking-wide">Explorer</span>
          <img src="/jstcode.png" alt="JstCode" className="h-7 w-auto opacity-80" />
        </div>
        
        {/* File Tree */}
        <div className="flex-1 p-2">
          {!code ? (
            <div className="text-center py-8">
              <div className="text-[#858585] text-xs mb-4">No files uploaded</div>
              <FileUploader onFileUpload={handleFileUpload} />
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center px-2 py-1 hover:bg-[#2a2d2e] rounded text-sm">
                <span className="text-[#519aba] mr-2">📄</span>
                <span className="text-[#cccccc]">{filename}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Bottom Actions */}
        {code && (
          <div className="border-t border-[#3e3e42] p-2">
            <PDFExporter previewRef={previewRef} filename={filename} />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Tab Bar */}
        <div className="h-9 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center">
          {code && (
            <div className="bg-[#1e1e1e] px-4 py-2 text-xs text-[#cccccc] border-r border-[#3e3e42]">
              {filename}
            </div>
          )}
        </div>

        {/* Editor and Preview */}
        {code ? (
          <div className="flex-1">
            <PanelGroup direction="horizontal" className="h-full">
              <Panel defaultSize={50} minSize={30}>
                <CodeEditor
                  value={code}
                  onChange={handleCodeChange}
                  language="typescript"
                />
              </Panel>
              
              <PanelResizeHandle className="w-px bg-[#3e3e42] hover:bg-[#007acc] transition-colors" />
              
              <Panel defaultSize={50} minSize={30}>
                <div className="h-full" ref={previewRef}>
                  <LivePreview code={code} filename={filename} />
                </div>
              </Panel>
            </PanelGroup>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#1e1e1e]">
            <div className="text-center text-[#858585]">
              <img src="/jstcode.png" alt="JstCode" className="h-24 w-auto mx-auto mb-6 opacity-60" />
              <div className="text-lg mb-2">Welcome to JstCode</div>
              <div className="text-sm">Upload a file from the Explorer to get started</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}