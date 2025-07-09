'use client';

import { FileNode, getFileTypeInfo } from '@/types/project';
import { useFormatter } from '@/hooks/useFormatter';

interface EditorToolbarProps {
  activeFile: FileNode | null;
  onCodeChange: (code: string) => void;
  minimapEnabled?: boolean;
  onToggleMinimap?: () => void;
  onShowSettings?: () => void;
  onShowPackages?: () => void;
}

export default function EditorToolbar({ activeFile, onCodeChange, minimapEnabled, onToggleMinimap, onShowSettings, onShowPackages }: EditorToolbarProps) {
  const { isFormatting, formatError, format, canFormat } = useFormatter();

  if (!activeFile) {
    return null;
  }

  const fileTypeInfo = getFileTypeInfo(activeFile.name);
  const canFormatFile = canFormat(fileTypeInfo.language);

  const handleFormat = async () => {
    if (!activeFile || !activeFile.content) return;
    
    try {
      const formattedCode = await format(activeFile.content, fileTypeInfo.language);
      onCodeChange(formattedCode);
    } catch (error) {
      console.error('Format failed:', error);
    }
  };

  const handleFind = () => {
    // Get the Monaco editor instance and trigger find
    const monacoContainer = document.querySelector('.monaco-editor');
    if (monacoContainer) {
      // Dispatch Ctrl+F event
      const event = new KeyboardEvent('keydown', {
        key: 'f',
        ctrlKey: true,
        bubbles: true
      });
      monacoContainer.dispatchEvent(event);
    }
  };

  const handleReplace = () => {
    // Get the Monaco editor instance and trigger replace
    const monacoContainer = document.querySelector('.monaco-editor');
    if (monacoContainer) {
      // Dispatch Ctrl+H event
      const event = new KeyboardEvent('keydown', {
        key: 'h',
        ctrlKey: true,
        bubbles: true
      });
      monacoContainer.dispatchEvent(event);
    }
  };

  return (
    <div className="h-8 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center justify-between px-3">
      <div className="flex items-center gap-2">
        {formatError && (
          <span className="text-xs text-red-400" title={formatError}>
            <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Format Error
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        {/* Find/Replace buttons */}
        <button
          onClick={handleFind}
          className="px-2 py-1 text-xs rounded transition-colors bg-[#3e3e42] hover:bg-[#4e4e52] text-[#cccccc] hover:text-white"
          title="Find - Ctrl/Cmd+F"
        >
          🔍
        </button>
        
        <button
          onClick={handleReplace}
          className="px-2 py-1 text-xs rounded transition-colors bg-[#3e3e42] hover:bg-[#4e4e52] text-[#cccccc] hover:text-white"
          title="Replace - Ctrl/Cmd+H"
        >
          🔄
        </button>

        {onToggleMinimap && (
          <button
            onClick={onToggleMinimap}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              minimapEnabled 
                ? 'bg-[#007acc] text-white' 
                : 'bg-[#3e3e42] hover:bg-[#4e4e52] text-[#cccccc] hover:text-white'
            }`}
            title={`${minimapEnabled ? 'Hide' : 'Show'} Minimap`}
          >
            🗺️
          </button>
        )}

        {onShowPackages && (
          <button
            onClick={onShowPackages}
            className="px-2 py-1 text-xs rounded transition-colors bg-[#3e3e42] hover:bg-[#4e4e52] text-[#cccccc] hover:text-white"
            title="Add Package"
          >
            📦
          </button>
        )}

        {onShowSettings && (
          <button
            onClick={onShowSettings}
            className="px-2 py-1 text-xs rounded transition-colors bg-[#3e3e42] hover:bg-[#4e4e52] text-[#cccccc] hover:text-white"
            title="Editor Settings"
          >
            ⚙️
          </button>
        )}

        {canFormatFile && (
          <button
            onClick={handleFormat}
            disabled={isFormatting || !activeFile.content?.trim()}
            data-format-button
            className={`
              px-2 py-1 text-xs rounded transition-colors
              ${isFormatting
                ? 'bg-[#3e3e42] text-[#858585] cursor-not-allowed'
                : 'bg-[#3e3e42] hover:bg-[#4e4e52] text-[#cccccc] hover:text-white'
              }
            `}
            title="Format code (Prettier) - Ctrl/Cmd+S"
          >
            {isFormatting ? '⏳' : '🎨'} {isFormatting ? 'Formatting...' : 'Format'}
          </button>
        )}
        
        <div className="w-px h-4 bg-[#3e3e42] mx-1" />
        
        <span className="text-xs text-[#858585]">
          {fileTypeInfo.language}
        </span>
      </div>
    </div>
  );
}