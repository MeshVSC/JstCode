'use client';

import { useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import FileUploader from '@/components/FileUploader';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import PDFExporter from '@/components/PDFExporter';
import FileTree from '@/components/FileTree';
import FileTabs from '@/components/FileTabs';
import MenuBar from '@/components/MenuBar';
import { useFileTree } from '@/hooks/useFileTree';
import { getFileTypeInfo } from '@/types/project';

export default function Home() {
  const previewRef = useRef<HTMLDivElement>(null);
  const {
    fileTree,
    isHydrated,
    addFile,
    updateFile,
    deleteFile,
    openTab,
    closeTab,
    setActiveFile,
    getFileById,
    clearProject,
    loadProject,
  } = useFileTree();

  const activeFile = fileTree.activeFileId ? getFileById(fileTree.activeFileId) : null;
  const hasFiles = fileTree.structure.root.length > 0;

  const handleFileUpload = (content: string, name: string) => {
    addFile(name, content);
  };

  const handleProjectUpload = (files: Record<string, string>) => {
    clearProject();
    loadProject(files);
  };

  const handleCodeChange = (newCode: string) => {
    if (activeFile) {
      updateFile(activeFile.id, newCode);
    }
  };

  const handleFileSelect = (fileId: string) => {
    openTab(fileId);
  };

  const handleTabSelect = (fileId: string) => {
    setActiveFile(fileId);
  };

  const handleTabClose = (fileId: string) => {
    closeTab(fileId);
  };

  const handleFileDelete = (fileId: string) => {
    deleteFile(fileId);
  };

  return (
    <div className="h-screen flex bg-[#1e1e1e] text-white">
      {/* Menu Bar */}
      <MenuBar />
      
      {/* Sidebar */}
      <div className="w-64 bg-[#252526] border-r border-[#2d2d30] flex flex-col">
        {/* Header */}
        <div className="h-9 bg-[#2d2d30] flex items-center justify-between px-3 border-b border-[#3e3e42]">
          <span className="text-xs font-medium text-[#cccccc] uppercase tracking-wide">Explorer</span>
          <img src="/logoicon_W.png" alt="JstCode" className="h-6 w-auto opacity-90" />
        </div>
        
        {/* File Tree */}
        <div className="flex-1 overflow-auto">
          {!isHydrated ? (
            <div className="text-center py-8 px-2">
              <div className="text-[#858585] text-xs mb-4">Loading...</div>
            </div>
          ) : !hasFiles ? (
            <div className="text-center py-8 px-2">
              <div className="text-[#858585] text-xs mb-4">No files uploaded</div>
              <FileUploader 
                onFileUpload={handleFileUpload}
                onProjectUpload={handleProjectUpload}
                mode="project"
              />
            </div>
          ) : (
            <FileTree
              files={fileTree.structure.root}
              activeFileId={fileTree.activeFileId}
              onFileSelect={handleFileSelect}
              onFileDelete={handleFileDelete}
            />
          )}
        </div>
        
        {/* Bottom Actions */}
        {hasFiles && (
          <div className="border-t border-[#3e3e42] p-2">
            <div className="flex gap-2">
              <PDFExporter 
                previewRef={previewRef} 
                filename={activeFile?.name || 'preview'} 
              />
              <button
                onClick={clearProject}
                className="px-3 py-1 text-xs bg-[#3e3e42] hover:bg-[#4e4e52] text-[#cccccc] rounded transition-colors"
                title="Clear all files"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Tab Bar */}
        <FileTabs
          openTabs={fileTree.openTabs}
          activeFileId={fileTree.activeFileId}
          getFileById={getFileById}
          onTabSelect={handleTabSelect}
          onTabClose={handleTabClose}
        />

        {/* Editor and Preview */}
        {activeFile ? (
          <div className="flex-1 relative">
            <PanelGroup direction="horizontal" className="h-full">
              <Panel defaultSize={50} minSize={30}>
                <CodeEditor
                  value={activeFile.content || ''}
                  onChange={handleCodeChange}
                  language={getFileTypeInfo(activeFile.name).language}
                  activeFile={activeFile}
                />
              </Panel>
              
              <PanelResizeHandle className="w-px bg-[#3e3e42] hover:bg-[#4e4e52] transition-colors" />
              
              <Panel defaultSize={50} minSize={30}>
                <div className="h-full" ref={previewRef}>
                  <LivePreview 
                    code={activeFile.content || ''} 
                    filename={activeFile.name}
                    allFiles={Object.values(fileTree.structure.files)
                      .filter(file => file.type === 'file')
                      .reduce((acc, file) => {
                        acc[file.path] = file.content || '';
                        return acc;
                      }, {} as Record<string, string>)
                    }
                  />
                </div>
              </Panel>
            </PanelGroup>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#161617]">
            <div className="text-center text-[#858585]">
              <img src="/all_G.png" alt="JstCode" className="h-48 w-auto mx-auto mb-6" />
              <div className="text-lg mb-2">Welcome to JstCode</div>
              <div className="text-sm">Upload a file from the Explorer to get started</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}