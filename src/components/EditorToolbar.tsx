'use client';

import { FileNode, getFileTypeInfo } from '@/types/project';
import { useFormatter } from '@/hooks/useFormatter';

interface EditorToolbarProps {
  activeFile: FileNode | null;
  onCodeChange: (code: string) => void;
}

export default function EditorToolbar({ activeFile, onCodeChange }: EditorToolbarProps) {
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