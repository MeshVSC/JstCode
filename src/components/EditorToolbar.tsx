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
    <div className="h-8 bg-elevated border-b border-default flex items-center justify-between px-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted uppercase tracking-wide font-medium">Editor</span>
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
          className="btn btn-secondary btn-sm text-xs"
          title="Find - Ctrl/Cmd+F"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
        
        <button
          onClick={handleReplace}
          className="btn btn-secondary btn-sm text-xs"
          title="Replace - Ctrl/Cmd+H"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 6c1.38 0 2.63.56 3.54 1.46L12 10h6V4l-2.05 2.05C14.68 4.78 12.93 4 11 4c-3.53 0-6.43 2.61-6.92 6H6.1c.46-2.28 2.48-4 4.9-4zm0 12c-1.38 0-2.63-.56-3.54-1.46L10 14H4v6l2.05-2.05C7.32 19.22 9.07 20 11 20c3.53 0 6.43-2.61 6.92-6h-2.02c-.46 2.28-2.48 4-4.9 4z"/>
          </svg>
        </button>

        {onToggleMinimap && (
          <button
            onClick={onToggleMinimap}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              minimapEnabled 
                ? 'bg-primary text-on-accent' 
                : 'bg-elevated hover:bg-hover text-muted hover:text-primary'
            }`}
            title={`${minimapEnabled ? 'Hide' : 'Show'} Minimap`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47zm-5 .99l3-1.01v11.7l-3 1.16V6.46zm14 11.08l-3 1.01V6.86l3-1.16v11.84z"/>
            </svg>
          </button>
        )}

        {onShowPackages && (
          <button
            onClick={onShowPackages}
            className="btn btn-secondary btn-sm text-xs"
            title="Add Package"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3 3 3-3v7l-3 3-3-3V2zM6.5 6C4.01 6 2 8.01 2 10.5S4.01 15 6.5 15 11 12.99 11 10.5 8.99 6 6.5 6zm11 8c-2.49 0-4.5 2.01-4.5 4.5S15.01 22 17.5 22s4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5z"/>
            </svg>
          </button>
        )}

        {onShowSettings && (
          <button
            onClick={onShowSettings}
            className="btn btn-secondary btn-sm text-xs"
            title="Editor Settings"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
            </svg>
          </button>
        )}

        {canFormatFile && (
          <button
            onClick={handleFormat}
            disabled={isFormatting || !activeFile.content?.trim()}
            data-format-button
            className={`
              px-2 py-1 text-xs rounded transition-colors flex items-center gap-1
              ${isFormatting
                ? 'bg-elevated text-muted cursor-not-allowed'
                : 'bg-elevated hover:bg-hover text-muted hover:text-primary'
              }
            `}
            title="Format code (Prettier) - Ctrl/Cmd+S"
          >
            {isFormatting ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="animate-spin">
                <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.89,3L14.85,3.4L11.11,21L9.15,20.6L12.89,3M19.59,12L16.76,9.17L18.17,7.76L22.41,12L18.17,16.24L16.76,14.83L19.59,12M4.41,12L7.24,14.83L5.83,16.24L1.59,12L5.83,7.76L7.24,9.17L4.41,12Z"/>
              </svg>
            )}
            {isFormatting ? 'Formatting...' : 'Format'}
          </button>
        )}
        
        <div className="w-px h-4 bg-border mx-1" />
        
        <span className="text-xs text-muted">
          {fileTypeInfo.language}
        </span>
      </div>
    </div>
  );
}