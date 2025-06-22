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
            ⚠️ Format Error
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