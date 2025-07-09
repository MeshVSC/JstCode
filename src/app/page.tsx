'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
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
  const [layoutMode, setLayoutMode] = useState<'split' | 'editor' | 'preview'>('split');
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
    getProjectSize,
  } = useFileTree();

  // Initialize layout from settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('jstcode-editor-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.defaultLayout) {
          setLayoutMode(settings.defaultLayout);
        }
      } catch {
        // Ignore parsing errors
      }
    }
  }, []);

  // Global drag and drop for entire app - should just work
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (e.dataTransfer?.items) {
        const items = Array.from(e.dataTransfer.items);
        const projectFiles: Record<string, string> = {};
        
        for (const item of items) {
          if (item.kind === 'file') {
            const entry = item.webkitGetAsEntry();
            if (entry) {
              await processEntry(entry, projectFiles);
            }
          }
        }
        
        if (Object.keys(projectFiles).length > 0) {
          clearProject();
          loadProject(projectFiles);
        }
      }
    };

    const processEntry = async (entry: any, files: Record<string, string>, path = '') => {
      if (entry.isFile) {
        const file = await new Promise<File>((resolve) => entry.file(resolve));
        if (isCodeFile(file.name)) {
          const content = await file.text();
          const fullPath = path ? `${path}/${file.name}` : file.name;
          files[fullPath] = content;
        }
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        const entries = await new Promise<any[]>((resolve) => reader.readEntries(resolve));
        
        for (const childEntry of entries) {
          const newPath = path ? `${path}/${entry.name}` : entry.name;
          await processEntry(childEntry, files, newPath);
        }
      }
    };

    const isCodeFile = (filename: string) => {
      const ext = filename.split('.').pop()?.toLowerCase();
      return ['tsx', 'ts', 'jsx', 'js', 'html', 'htm', 'css', 'json', 'md'].includes(ext || '');
    };

    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, [clearProject, loadProject]);

  const activeFile = fileTree.activeFileId ? getFileById(fileTree.activeFileId) : null;
  const hasFiles = fileTree.structure.root.length > 0;

  // Memoize allFiles to prevent unnecessary Sandpack reloads
  const allFiles = useMemo(() => {
    return Object.values(fileTree.structure.files)
      .filter(file => file.type === 'file')
      .reduce((acc, file) => {
        acc[file.path] = file.content || '';
        return acc;
      }, {} as Record<string, string>);
  }, [fileTree.structure.files]);

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
          <Image src="/logoicon_W.png" alt="JstCode" width={24} height={24} className="opacity-90" style={{ width: 'auto', height: 'auto' }} />
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
            <div className="flex flex-col gap-2">
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
              <div className="text-xs text-[#606060]">
                {(() => {
                  const size = getProjectSize();
                  return `${size.files} files • ${size.sizeKB}KB`;
                })()}
              </div>
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
          layoutMode={layoutMode}
          onLayoutChange={setLayoutMode}
        />

        {/* Editor and Preview */}
        {activeFile ? (
          <div className="flex-1 relative">
            {layoutMode === 'editor' ? (
              // Editor Only
              <CodeEditor
                value={activeFile.content || ''}
                onChange={handleCodeChange}
                language={getFileTypeInfo(activeFile.name).language}
                activeFile={activeFile}
              />
            ) : layoutMode === 'preview' ? (
              // Preview Only
              <div className="h-full" ref={previewRef}>
                <LivePreview 
                  code={activeFile.content || ''} 
                  filename={activeFile.name}
                  allFiles={allFiles}
                />
              </div>
            ) : (
              // Split View
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
                      allFiles={allFiles}
                    />
                  </div>
                </Panel>
              </PanelGroup>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#161617]">
            <div className="text-center text-[#858585]">
              <Image src="/all_G.png" alt="JstCode" width={192} height={192} priority className="mx-auto mb-6" style={{ width: 'auto', height: 'auto' }} />
              <div className="text-lg mb-2">Welcome to JstCode</div>
              <div className="text-sm">Upload a file from the Explorer to get started</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}