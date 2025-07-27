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
import TemplateSelector, { Template } from '@/components/TemplateSelector';
import SettingsPanel, { useEditorSettings } from '@/components/SettingsPanel';
import PasteDetector from '@/components/PasteDetector';
import { useFileTree } from '@/hooks/useFileTree';
import { getFileTypeInfo } from '@/types/project';

export default function Home() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [layoutMode, setLayoutMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [showNewFileTemplates, setShowNewFileTemplates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { settings, updateSettings } = useEditorSettings();
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

    const processEntry = async (entry: FileSystemEntry, files: Record<string, string>, path = '') => {
      if (entry.isFile) {
        const file = await new Promise<File>((resolve) => (entry as FileSystemFileEntry).file(resolve));
        if (isCodeFile(file.name)) {
          const content = await file.text();
          const fullPath = path ? `${path}/${file.name}` : file.name;
          files[fullPath] = content;
        }
      } else if (entry.isDirectory) {
        const reader = (entry as FileSystemDirectoryEntry).createReader();
        const entries = await new Promise<FileSystemEntry[]>((resolve) => reader.readEntries(resolve));
        
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

  const handleNewFileTemplate = (template: Template) => {
    // Add the template's files to the project
    Object.entries(template.files).forEach(([filename, content]) => {
      addFile(filename, content);
    });
    setShowNewFileTemplates(false);
  };

  return (
    <div className="app-container">
      {/* Menu Bar */}
      <MenuBar onSettingsClick={() => setShowSettings(true)} />
      
      {/* Sidebar */}
      <div className="w-64 sidebar flex flex-col">
        {/* Header */}
        <div className="sidebar-header flex items-center justify-between px-3">
          <span className="text-xs font-medium text-primary uppercase tracking-wide">Explorer</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewFileTemplates(true)}
              className="w-6 h-6 icon-btn"
              title="New File"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <Image src="/logoicon_W.png" alt="JstCode" width={40} height={40} className="opacity-90" style={{filter: 'var(--logo-filter, none)'}} />
          </div>
        </div>
        
        {/* File Tree */}
        <div className="flex-1 overflow-auto">
          {!isHydrated ? (
            <div className="text-center py-8 px-2">
              <div className="text-muted text-xs mb-4">Loading...</div>
            </div>
          ) : !hasFiles ? (
            <div className="py-4 px-2">
              <div className="text-center mb-6">
                <div className="text-muted text-xs mb-4">No files uploaded</div>
                <FileUploader 
                  onFileUpload={handleFileUpload}
                  onProjectUpload={handleProjectUpload}
                  mode="project"
                />
              </div>
              
              <div className="border-t border-default pt-6">
                <div className="text-xs text-muted mb-3 text-center">Or paste code directly:</div>
                <PasteDetector 
                  onCodePasted={(code, analysis) => {
                    // Create a filename based on detected language
                    const ext = analysis?.language === 'typescript-react' ? '.tsx' :
                                analysis?.language === 'javascript-react' ? '.jsx' :
                                analysis?.language === 'typescript' ? '.ts' :
                                analysis?.language === 'html' ? '.html' :
                                analysis?.language === 'css' ? '.css' : '.js';
                    
                    const filename = `pasted-code${ext}`;
                    handleFileUpload(code, filename);
                  }}
                  onApplyTemplate={handleNewFileTemplate}
                />
              </div>
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
          <div className="p-2" style={{background: 'var(--surface-elevated)', backdropFilter: 'blur(5px)'}}>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <PDFExporter 
                  previewRef={previewRef} 
                  filename={activeFile?.name || 'preview'} 
                />
                <button
                  onClick={clearProject}
                  className="btn btn-sm"
                  title="Clear all files"
                >
                  Clear
                </button>
              </div>
              <div className="text-xs text-muted">
                {(() => {
                  const size = getProjectSize();
                  return `${size.files} files • ${size.sizeKB}KB`;
                })()}
              </div>
            </div>
          </div>
        )}
        
        {/* Sidebar Footer with Logo */}
        <div className="mt-auto p-4 flex items-center justify-center" style={{background: 'var(--surface-elevated)', backdropFilter: 'blur(5px)'}}>
          <Image src="/all_W.png" alt="JstCode" width={80} height={80} className="opacity-40 hover:opacity-60 transition-opacity" style={{filter: 'var(--logo-filter, none)'}} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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
          <div className="flex-1 relative min-h-0 overflow-hidden">
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
              <PanelGroup direction="horizontal" className="h-full w-full max-w-full overflow-hidden">
                <Panel defaultSize={50} minSize={30} maxSize={70}>
                  <CodeEditor
                    value={activeFile.content || ''}
                    onChange={handleCodeChange}
                    language={getFileTypeInfo(activeFile.name).language}
                    activeFile={activeFile}
                  />
                </Panel>
                
                <PanelResizeHandle className="resize-handle" />
                
                <Panel defaultSize={50} minSize={30} maxSize={70}>
                  <div className="h-full w-full max-w-full overflow-hidden" ref={previewRef}>
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
          <div className="welcome-state flex-1 flex items-center justify-center">
            <div className="text-center">
              <Image src="/blocks_W.png" alt="Upload" width={120} height={120} priority className="mx-auto mb-6 opacity-60" style={{ width: 'auto', height: 'auto', filter: 'brightness(2) contrast(1.2)' }} />
              <div className="welcome-title text-lg mb-2 font-semibold">Welcome to JstCode</div>
              <div className="text-sm text-secondary">Upload a file from the Explorer to get started</div>
            </div>
          </div>
        )}
      </div>

      {/* New File Template Selector */}
      <TemplateSelector
        isOpen={showNewFileTemplates}
        onClose={() => setShowNewFileTemplates(false)}
        onSelectTemplate={handleNewFileTemplate}
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={updateSettings}
      />
    </div>
  );
}