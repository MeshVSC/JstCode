'use client';

import { FileNode, getFileTypeInfo } from '@/types/project';

interface FileTabsProps {
  openTabs: string[];
  activeFileId: string | null;
  getFileById: (fileId: string) => FileNode | undefined;
  onTabSelect: (fileId: string) => void;
  onTabClose: (fileId: string) => void;
  layoutMode: 'split' | 'editor' | 'preview';
  onLayoutChange: (mode: 'split' | 'editor' | 'preview') => void;
}

interface FileTabProps {
  file: FileNode;
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
}

function FileTab({ file, isActive, onSelect, onClose }: FileTabProps) {
  const fileTypeInfo = getFileTypeInfo(file.name);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className={`
        flex items-center px-3 py-2 text-xs cursor-pointer border-r border-[#3e3e42]
        hover:bg-[#2a2d2e] transition-colors group relative
        ${isActive 
          ? 'bg-[#1e1e1e]' 
          : 'bg-[#2d2d30]'
        }
      `}
      onClick={onSelect}
      title={file.path}
    >
      <span className="mr-2 text-xs">{fileTypeInfo.icon}</span>
      <span 
        className="truncate max-w-[120px]" 
        style={{ 
          color: '#39ff14',
          WebkitTextFillColor: '#39ff14'
        }}
      >
        {file.name}
      </span>
      <button
        onClick={handleClose}
        className={`
          ml-2 w-4 h-4 flex items-center justify-center rounded text-xs
          transition-all opacity-0 group-hover:opacity-100
          hover:bg-[#3e3e42] text-[#858585] hover:text-white
        `}
        title="Close tab"
      >
        ×
      </button>
      
      {/* Modified indicator */}
      {/* We can add this later when we track file modifications */}
      {/* <div className="w-2 h-2 bg-white rounded-full ml-1 opacity-70" /> */}
    </div>
  );
}

export default function FileTabs({ 
  openTabs, 
  activeFileId, 
  getFileById, 
  onTabSelect, 
  onTabClose,
  layoutMode,
  onLayoutChange
}: FileTabsProps) {
  if (openTabs.length === 0) {
    return (
      <div className="h-9 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center justify-between">
        <span className="text-xs text-[#858585] px-3">No files open</span>
        
        {/* Layout Toggle Buttons - Always show */}
        <div className="flex items-center gap-1 px-3">
          <button
            onClick={() => onLayoutChange('editor')}
            className={`w-6 h-6 flex items-center justify-center rounded text-xs transition-colors ${
              layoutMode === 'editor' 
                ? 'bg-[#007acc] text-white' 
                : 'text-[#858585] hover:text-[#cccccc] hover:bg-[#3e3e42]'
            }`}
            title="Editor Only"
          >
            <svg width="14" height="14" viewBox="0 0 24 24">
              <rect x="3" y="3" width="8" height="18" fill="currentColor"/>
              <rect x="11" y="3" width="10" height="18" fill="currentColor" opacity="0.3"/>
            </svg>
          </button>
          <button
            onClick={() => onLayoutChange('split')}
            className={`w-6 h-6 flex items-center justify-center rounded text-xs transition-colors ${
              layoutMode === 'split' 
                ? 'bg-[#007acc] text-white' 
                : 'text-[#858585] hover:text-[#cccccc] hover:bg-[#3e3e42]'
            }`}
            title="Split View"
          >
            <svg width="14" height="14" viewBox="0 0 24 24">
              <rect x="3" y="3" width="8" height="18" fill="currentColor"/>
              <rect x="11" y="3" width="10" height="18" fill="currentColor"/>
            </svg>
          </button>
          <button
            onClick={() => onLayoutChange('preview')}
            className={`w-6 h-6 flex items-center justify-center rounded text-xs transition-colors ${
              layoutMode === 'preview' 
                ? 'bg-[#007acc] text-white' 
                : 'text-[#858585] hover:text-[#cccccc] hover:bg-[#3e3e42]'
            }`}
            title="Preview Only"
          >
            <svg width="14" height="14" viewBox="0 0 24 24">
              <rect x="3" y="3" width="8" height="18" fill="currentColor" opacity="0.3"/>
              <rect x="11" y="3" width="10" height="18" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-9 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center justify-between">
      <div className="flex items-center overflow-x-auto scrollbar-thin">
        {openTabs.map(fileId => {
          const file = getFileById(fileId);
          if (!file) return null;

          return (
            <FileTab
              key={fileId}
              file={file}
              isActive={activeFileId === fileId}
              onSelect={() => onTabSelect(fileId)}
              onClose={() => onTabClose(fileId)}
            />
          );
        })}
      </div>
      
      {/* Layout Toggle Buttons */}
      <div className="flex items-center gap-1 px-3">
        <button
          onClick={() => onLayoutChange('editor')}
          className={`w-6 h-6 flex items-center justify-center rounded text-xs transition-colors ${
            layoutMode === 'editor' 
              ? 'bg-[#007acc] text-white' 
              : 'text-[#858585] hover:text-[#cccccc] hover:bg-[#3e3e42]'
          }`}
          title="Editor Only"
        >
          <svg width="14" height="14" viewBox="0 0 24 24">
            <rect x="3" y="3" width="8" height="18" fill="currentColor"/>
            <rect x="11" y="3" width="10" height="18" fill="currentColor" opacity="0.3"/>
          </svg>
        </button>
        <button
          onClick={() => onLayoutChange('split')}
          className={`w-6 h-6 flex items-center justify-center rounded text-xs transition-colors ${
            layoutMode === 'split' 
              ? 'bg-[#007acc] text-white' 
              : 'text-[#858585] hover:text-[#cccccc] hover:bg-[#3e3e42]'
          }`}
          title="Split View"
        >
          <svg width="14" height="14" viewBox="0 0 24 24">
            <rect x="3" y="3" width="8" height="18" fill="currentColor"/>
            <rect x="11" y="3" width="10" height="18" fill="currentColor"/>
          </svg>
        </button>
        <button
          onClick={() => onLayoutChange('preview')}
          className={`w-6 h-6 flex items-center justify-center rounded text-xs transition-colors ${
            layoutMode === 'preview' 
              ? 'bg-[#007acc] text-white' 
              : 'text-[#858585] hover:text-[#cccccc] hover:bg-[#3e3e42]'
          }`}
          title="Preview Only"
        >
          <svg width="14" height="14" viewBox="0 0 24 24">
            <rect x="3" y="3" width="8" height="18" fill="currentColor" opacity="0.3"/>
            <rect x="11" y="3" width="10" height="18" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>
  );
}