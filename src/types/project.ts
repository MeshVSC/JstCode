export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  parent?: string;
  path: string;
  extension?: string;
}

export interface ProjectStructure {
  files: Record<string, FileNode>;
  root: FileNode[];
}

export interface FileTree {
  structure: ProjectStructure;
  activeFileId: string | null;
  openTabs: string[];
}

export interface FileOperation {
  type: 'create' | 'update' | 'delete' | 'rename';
  fileId: string;
  data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type SupportedFileTypes = 
  | 'typescript'
  | 'javascript' 
  | 'json'
  | 'css'
  | 'html'
  | 'markdown'
  | 'text';

export interface FileTypeInfo {
  extension: string;
  language: SupportedFileTypes;
  icon: string;
  color: string;
}

export const FILE_TYPE_MAP: Record<string, FileTypeInfo> = {
  '.ts': { extension: '.ts', language: 'typescript', icon: '📘', color: '#3178c6' },
  '.tsx': { extension: '.tsx', language: 'typescript', icon: '⚛️', color: '#61dafb' },
  '.js': { extension: '.js', language: 'javascript', icon: '📄', color: '#f7df1e' },
  '.jsx': { extension: '.jsx', language: 'javascript', icon: '⚛️', color: '#61dafb' },
  '.json': { extension: '.json', language: 'json', icon: '📋', color: '#000000' },
  '.css': { extension: '.css', language: 'css', icon: '🎨', color: '#1572b6' },
  '.html': { extension: '.html', language: 'html', icon: '🌐', color: '#e34f26' },
  '.md': { extension: '.md', language: 'markdown', icon: '📝', color: '#000000' },
  '.txt': { extension: '.txt', language: 'text', icon: '📄', color: '#000000' },
};

export function getFileTypeInfo(filename: string): FileTypeInfo {
  const extension = '.' + filename.split('.').pop()?.toLowerCase();
  return FILE_TYPE_MAP[extension] || FILE_TYPE_MAP['.txt'];
}

export function createFileNode(
  name: string,
  type: 'file' | 'folder',
  path: string,
  content?: string,
  parent?: string
): FileNode {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    type,
    path,
    content: type === 'file' ? content || '' : undefined,
    children: type === 'folder' ? [] : undefined,
    parent,
    extension: type === 'file' ? '.' + name.split('.').pop()?.toLowerCase() : undefined,
  };
}