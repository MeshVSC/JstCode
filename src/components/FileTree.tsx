'use client';

import { useState } from 'react';
import { FileNode, getFileTypeInfo } from '@/types/project';

interface FileTreeProps {
  files: FileNode[];
  activeFileId: string | null;
  onFileSelect: (fileId: string) => void;
  onFileDelete?: (fileId: string) => void;
  level?: number;
}

interface FileTreeNodeProps {
  node: FileNode;
  isActive: boolean;
  onFileSelect: (fileId: string) => void;
  onFileDelete?: (fileId: string) => void;
  level: number;
  activeFileId: string | null;
}

function FileTreeNode({ node, isActive, onFileSelect, onFileDelete, level, activeFileId }: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const indentation = level * 16;

  const handleClick = () => {
    if (node.type === 'file') {
      onFileSelect(node.id);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFileDelete) {
      onFileDelete(node.id);
    }
  };

  const getNodeIcon = () => {
    if (node.type === 'folder') {
      return isExpanded ? '📂' : '📁';
    }
    return getFileTypeInfo(node.name).icon;
  };

  const getNodeColor = () => {
    if (node.type === 'folder') {
      return '#cccccc';
    }
    return getFileTypeInfo(node.name).color;
  };

  return (
    <div>
      <div
        className={`
          flex items-center px-2 py-1 text-sm cursor-pointer
          hover:bg-[#2a2d2e] transition-colors
          ${isActive ? 'bg-[#37373d] text-white' : 'text-[#cccccc]'}
        `}
        style={{ paddingLeft: `${8 + indentation}px` }}
        onClick={handleClick}
      >
        <span className="mr-2 text-xs">{getNodeIcon()}</span>
        <span className="flex-1 truncate" style={{ color: getNodeColor() }}>
          {node.name}
        </span>
        {onFileDelete && (
          <button
            onClick={handleDelete}
            className="ml-2 opacity-0 hover:opacity-100 text-[#858585] hover:text-red-400 transition-all"
            title="Delete file"
          >
            ×
          </button>
        )}
      </div>
      
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children
            .sort((a, b) => {
              // Folders first, then files
              if (a.type !== b.type) {
                return a.type === 'folder' ? -1 : 1;
              }
              return a.name.localeCompare(b.name);
            })
            .map(child => (
              <FileTreeNode
                key={child.id}
                node={child}
                isActive={activeFileId === child.id}
                onFileSelect={onFileSelect}
                onFileDelete={onFileDelete}
                level={level + 1}
                activeFileId={activeFileId}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default function FileTree({ 
  files, 
  activeFileId, 
  onFileSelect, 
  onFileDelete, 
  level = 0 
}: FileTreeProps) {
  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-[#858585] text-xs">
        No files in project
      </div>
    );
  }

  const sortedFiles = [...files].sort((a, b) => {
    // Folders first, then files
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-0">
      {sortedFiles.map(node => (
        <FileTreeNode
          key={node.id}
          node={node}
          isActive={activeFileId === node.id}
          onFileSelect={onFileSelect}
          onFileDelete={onFileDelete}
          level={level}
          activeFileId={activeFileId}
        />
      ))}
    </div>
  );
}