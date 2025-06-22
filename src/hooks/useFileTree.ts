'use client';

import { useState, useCallback, useEffect } from 'react';
import { FileNode, FileTree, createFileNode } from '@/types/project';

interface UseFileTreeReturn {
  fileTree: FileTree;
  isHydrated: boolean;
  addFile: (name: string, content: string, parentPath?: string) => void;
  addFolder: (name: string, parentPath?: string) => void;
  updateFile: (fileId: string, content: string) => void;
  deleteFile: (fileId: string) => void;
  setActiveFile: (fileId: string | null) => void;
  openTab: (fileId: string) => void;
  closeTab: (fileId: string) => void;
  getFileById: (fileId: string) => FileNode | undefined;
  getFileByPath: (path: string) => FileNode | undefined;
  clearProject: () => void;
  loadProject: (files: Record<string, string>) => void;
  getProjectSize: () => { files: number; sizeKB: number };
}

const STORAGE_KEY = 'jstcode-project';

export function useFileTree(): UseFileTreeReturn {
  const [fileTree, setFileTree] = useState<FileTree>({
    structure: { files: {}, root: [] },
    activeFileId: null,
    openTabs: [],
  });
  
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after hydration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsedData = JSON.parse(saved);
          setFileTree(parsedData);
        } catch (e) {
          console.warn('Failed to parse saved project:', e);
        }
      }
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage whenever fileTree changes with error handling
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const dataString = JSON.stringify(fileTree);
        
        // Check if data is too large (5MB limit for most browsers)
        if (dataString.length > 5 * 1024 * 1024) {
          console.warn('Project too large for localStorage, skipping save');
          return;
        }
        
        localStorage.setItem(STORAGE_KEY, dataString);
      } catch (error) {
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          console.warn('localStorage quota exceeded, clearing old data');
          // Clear the stored project and try again with current state
          localStorage.removeItem(STORAGE_KEY);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(fileTree));
          } catch {
            console.error('Still unable to save after clearing, project too large');
          }
        } else {
          console.error('Error saving to localStorage:', error);
        }
      }
    }
  }, [fileTree]);

  const getFileById = useCallback((fileId: string): FileNode | undefined => {
    return fileTree.structure.files[fileId];
  }, [fileTree.structure.files]);

  const getFileByPath = useCallback((path: string): FileNode | undefined => {
    return Object.values(fileTree.structure.files).find(file => file.path === path);
  }, [fileTree.structure.files]);

  const addFile = useCallback((name: string, content: string, parentPath = '') => {
    const path = parentPath ? `${parentPath}/${name}` : name;
    const existingFile = getFileByPath(path);
    
    if (existingFile) {
      // Update existing file
      setFileTree(prev => ({
        ...prev,
        structure: {
          ...prev.structure,
          files: {
            ...prev.structure.files,
            [existingFile.id]: { ...existingFile, content }
          }
        }
      }));
      return;
    }

    const newFile = createFileNode(name, 'file', path, content);
    
    setFileTree(prev => {
      const parentFile = parentPath ? getFileByPath(parentPath) : null;
      const newFiles = { ...prev.structure.files, [newFile.id]: newFile };
      
      const newRoot = [...prev.structure.root];
      
      if (parentFile && parentFile.type === 'folder') {
        // Add to parent folder
        newFiles[parentFile.id] = {
          ...parentFile,
          children: [...(parentFile.children || []), newFile]
        };
        newFile.parent = parentFile.id;
      } else {
        // Add to root
        newRoot.push(newFile);
      }

      return {
        ...prev,
        structure: { files: newFiles, root: newRoot },
        activeFileId: newFile.id,
        openTabs: prev.openTabs.includes(newFile.id) ? prev.openTabs : [...prev.openTabs, newFile.id]
      };
    });
  }, [getFileByPath]);

  const addFolder = useCallback((name: string, parentPath = '') => {
    const path = parentPath ? `${parentPath}/${name}` : name;
    const existingFolder = getFileByPath(path);
    
    if (existingFolder) return;

    const newFolder = createFileNode(name, 'folder', path);
    
    setFileTree(prev => {
      const parentFile = parentPath ? getFileByPath(parentPath) : null;
      const newFiles = { ...prev.structure.files, [newFolder.id]: newFolder };
      
      const newRoot = [...prev.structure.root];
      
      if (parentFile && parentFile.type === 'folder') {
        // Add to parent folder
        newFiles[parentFile.id] = {
          ...parentFile,
          children: [...(parentFile.children || []), newFolder]
        };
        newFolder.parent = parentFile.id;
      } else {
        // Add to root
        newRoot.push(newFolder);
      }

      return {
        ...prev,
        structure: { files: newFiles, root: newRoot }
      };
    });
  }, [getFileByPath]);

  const updateFile = useCallback((fileId: string, content: string) => {
    setFileTree(prev => ({
      ...prev,
      structure: {
        ...prev.structure,
        files: {
          ...prev.structure.files,
          [fileId]: {
            ...prev.structure.files[fileId],
            content
          }
        }
      }
    }));
  }, []);

  const deleteFile = useCallback((fileId: string) => {
    setFileTree(prev => {
      const file = prev.structure.files[fileId];
      if (!file) return prev;

      const newFiles = { ...prev.structure.files };
      delete newFiles[fileId];

      // Remove from parent or root
      let newRoot = [...prev.structure.root];
      
      if (file.parent) {
        const parent = newFiles[file.parent];
        if (parent && parent.children) {
          newFiles[parent.id] = {
            ...parent,
            children: parent.children.filter(child => child.id !== fileId)
          };
        }
      } else {
        newRoot = newRoot.filter(node => node.id !== fileId);
      }

      return {
        ...prev,
        structure: { files: newFiles, root: newRoot },
        activeFileId: prev.activeFileId === fileId ? null : prev.activeFileId,
        openTabs: prev.openTabs.filter(tabId => tabId !== fileId)
      };
    });
  }, []);

  const setActiveFile = useCallback((fileId: string | null) => {
    setFileTree(prev => ({
      ...prev,
      activeFileId: fileId
    }));
  }, []);

  const openTab = useCallback((fileId: string) => {
    setFileTree(prev => ({
      ...prev,
      activeFileId: fileId,
      openTabs: prev.openTabs.includes(fileId) ? prev.openTabs : [...prev.openTabs, fileId]
    }));
  }, []);

  const closeTab = useCallback((fileId: string) => {
    setFileTree(prev => {
      const newTabs = prev.openTabs.filter(id => id !== fileId);
      const newActiveFile = prev.activeFileId === fileId 
        ? (newTabs.length > 0 ? newTabs[newTabs.length - 1] : null)
        : prev.activeFileId;

      return {
        ...prev,
        activeFileId: newActiveFile,
        openTabs: newTabs
      };
    });
  }, []);

  const clearProject = useCallback(() => {
    setFileTree({
      structure: { files: {}, root: [] },
      activeFileId: null,
      openTabs: [],
    });
  }, []);

  const loadProject = useCallback((files: Record<string, string>) => {
    const newFileTree: FileTree = {
      structure: { files: {}, root: [] },
      activeFileId: null,
      openTabs: [],
    };

    // Create file nodes
    const fileNodes: FileNode[] = [];
    const folders = new Set<string>();

    // First pass: identify all folders
    Object.keys(files).forEach(path => {
      const parts = path.split('/');
      for (let i = 0; i < parts.length - 1; i++) {
        const folderPath = parts.slice(0, i + 1).join('/');
        folders.add(folderPath);
      }
    });

    // Create folder nodes
    const sortedFolders = Array.from(folders).sort();
    sortedFolders.forEach(folderPath => {
      const name = folderPath.split('/').pop() || folderPath;
      const folder = createFileNode(name, 'folder', folderPath);
      newFileTree.structure.files[folder.id] = folder;
    });

    // Create file nodes
    Object.entries(files).forEach(([path, content]) => {
      const name = path.split('/').pop() || path;
      const file = createFileNode(name, 'file', path, content);
      newFileTree.structure.files[file.id] = file;
      fileNodes.push(file);
    });

    // Build tree structure
    const pathToNodeId = new Map<string, string>();
    Object.values(newFileTree.structure.files).forEach(node => {
      pathToNodeId.set(node.path, node.id);
    });

    // Set up parent-child relationships
    Object.values(newFileTree.structure.files).forEach(node => {
      const parentPath = node.path.split('/').slice(0, -1).join('/');
      if (parentPath && pathToNodeId.has(parentPath)) {
        const parentId = pathToNodeId.get(parentPath)!;
        const parent = newFileTree.structure.files[parentId];
        if (parent.type === 'folder') {
          parent.children = parent.children || [];
          parent.children.push(node);
          node.parent = parentId;
        }
      }
    });

    // Set root nodes (nodes without parents)
    newFileTree.structure.root = Object.values(newFileTree.structure.files)
      .filter(node => !node.parent)
      .sort((a, b) => a.name.localeCompare(b.name));

    // Set first file as active
    const firstFile = fileNodes[0];
    if (firstFile) {
      newFileTree.activeFileId = firstFile.id;
      newFileTree.openTabs = [firstFile.id];
    }

    setFileTree(newFileTree);
  }, []);

  const getProjectSize = useCallback(() => {
    const fileCount = Object.keys(fileTree.structure.files).length;
    const sizeBytes = JSON.stringify(fileTree).length;
    const sizeKB = Math.round(sizeBytes / 1024);
    return { files: fileCount, sizeKB };
  }, [fileTree]);

  return {
    fileTree,
    isHydrated,
    addFile,
    addFolder,
    updateFile,
    deleteFile,
    setActiveFile,
    openTab,
    closeTab,
    getFileById,
    getFileByPath,
    clearProject,
    loadProject,
    getProjectSize,
  };
}