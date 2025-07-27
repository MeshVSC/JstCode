'use client';

import { useState, useEffect, useRef } from 'react';
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
  searchQuery?: string;
}

function FileTreeNode({ node, isActive, onFileSelect, onFileDelete, level, activeFileId, searchQuery }: FileTreeNodeProps) {
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
      return isExpanded ? (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
      );
    }
    return getFileTypeInfo(node.name).icon;
  };

  // const getNodeColor = () => {
  //   if (node.type === 'folder') {
  //     return '#cccccc';
  //   }
  //   return getFileTypeInfo(node.name).color;
  // };

  const highlightText = (text: string, query?: string) => {
    if (!query || !query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-400 text-black rounded px-0.5">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div>
      <div
        className={`
          flex items-center px-2 py-1 text-sm cursor-pointer
          hover:bg-hover transition-colors
          ${isActive ? 'bg-active text-on-accent' : 'text-primary'}
        `}
        style={{ paddingLeft: `${8 + indentation}px` }}
        onClick={handleClick}
      >
        <span className="mr-2 text-xs flex items-center">{getNodeIcon()}</span>
        <span className="flex-1 truncate" style={{ color: '#39ff14' }}>
          {highlightText(node.name, searchQuery)}
        </span>
        {onFileDelete && (
          <button
            onClick={handleDelete}
            className="ml-2 opacity-0 hover:opacity-100 text-muted hover:text-error transition-all"
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
                isActive={child.id === activeFileId}
                onFileSelect={onFileSelect}
                onFileDelete={onFileDelete}
                level={level + 1}
                activeFileId={activeFileId}
                searchQuery={searchQuery}
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
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut for search (Ctrl+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter files based on search query
  const filterFiles = (nodes: FileNode[], query: string): FileNode[] => {
    if (!query.trim()) return nodes;
    
    return nodes.reduce((acc: FileNode[], node) => {
      const matchesName = node.name.toLowerCase().includes(query.toLowerCase());
      
      if (node.type === 'file') {
        if (matchesName) acc.push(node);
      } else if (node.type === 'folder' && node.children) {
        const filteredChildren = filterFiles(node.children, query);
        if (filteredChildren.length > 0 || matchesName) {
          acc.push({
            ...node,
            children: filteredChildren.length > 0 ? filteredChildren : node.children
          });
        }
      }
      
      return acc;
    }, []);
  };

  const filteredFiles = filterFiles(files, searchQuery);

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-muted text-xs">
        No files in project
      </div>
    );
  }

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    // Folders first, then files
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search Input */}
      <div className="p-2 border-b border-default">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search files... (Ctrl+P)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input text-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary text-xs"
            >
              ×
            </button>
          )}
        </div>
        {searchQuery && filteredFiles.length === 0 && (
          <div className="text-xs text-muted mt-1">No files found</div>
        )}
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-auto">
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
              searchQuery={searchQuery}
            />
          ))}
        </div>
      </div>
    </div>
  );
}