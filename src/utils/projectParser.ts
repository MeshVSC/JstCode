import JSZip from 'jszip';

export interface ParsedFile {
  path: string;
  content: string;
  isDirectory: boolean;
}

export async function parseProjectFromFiles(files: FileList): Promise<Record<string, string>> {
  const projectFiles: Record<string, string> = {};
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (file.name.endsWith('.zip')) {
      // Handle zip files
      const zipFiles = await parseZipFile(file);
      Object.assign(projectFiles, zipFiles);
    } else if (isValidCodeFile(file.name)) {
      // Handle individual code files
      const content = await readFileContent(file);
      const path = getCleanPath(file);
      projectFiles[path] = content;
    }
  }
  
  return projectFiles;
}

export async function parseProjectFromDataTransfer(dataTransfer: DataTransferItem[]): Promise<Record<string, string>> {
  const projectFiles: Record<string, string> = {};
  
  for (const item of dataTransfer) {
    if (item.kind === 'file') {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        await traverseFileTree(entry, projectFiles);
      }
    }
  }
  
  return projectFiles;
}

async function parseZipFile(zipFile: File): Promise<Record<string, string>> {
  const projectFiles: Record<string, string> = {};
  
  try {
    const zip = await JSZip.loadAsync(zipFile);
    
    for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
      if (!zipEntry.dir && isValidCodeFile(relativePath)) {
        const content = await zipEntry.async('text');
        const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
        projectFiles[cleanPath] = content;
      }
    }
  } catch (error) {
    console.error('Error parsing zip file:', error);
    throw new Error('Failed to parse zip file');
  }
  
  return projectFiles;
}

async function traverseFileTree(
  entry: FileSystemEntry, 
  projectFiles: Record<string, string>,
  basePath = ''
): Promise<void> {
  if (entry.isFile) {
    const fileEntry = entry as FileSystemFileEntry;
    
    if (isValidCodeFile(entry.name)) {
      try {
        const file = await new Promise<File>((resolve, reject) => {
          fileEntry.file(resolve, reject);
        });
        
        const content = await readFileContent(file);
        const fullPath = basePath ? `${basePath}/${entry.name}` : entry.name;
        projectFiles[fullPath] = content;
      } catch (error) {
        console.warn(`Failed to read file ${entry.name}:`, error);
      }
    }
  } else if (entry.isDirectory) {
    const dirEntry = entry as FileSystemDirectoryEntry;
    const reader = dirEntry.createReader();
    
    try {
      const entries = await new Promise<FileSystemEntry[]>((resolve, reject) => {
        reader.readEntries(resolve, reject);
      });
      
      for (const childEntry of entries) {
        const newBasePath = basePath ? `${basePath}/${entry.name}` : entry.name;
        await traverseFileTree(childEntry, projectFiles, newBasePath);
      }
    } catch (error) {
      console.warn(`Failed to read directory ${entry.name}:`, error);
    }
  }
}

function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function getCleanPath(file: File): string {
  // For individual files, use just the filename
  // For files with webkitRelativePath, use that
  return (file as any).webkitRelativePath || file.name; // eslint-disable-line @typescript-eslint/no-explicit-any
}

function isValidCodeFile(filename: string): boolean {
  const validExtensions = [
    '.js', '.jsx', '.ts', '.tsx',
    '.json', '.css', '.scss', '.sass',
    '.html', '.htm', '.md', '.txt',
    '.vue', '.svelte'
  ];
  
  const lowerFilename = filename.toLowerCase();
  
  // Skip common non-code files and directories
  const skipPatterns = [
    'node_modules/', '.git/', '.next/', 'dist/', 'build/',
    '.ds_store', 'thumbs.db', '.env', '.env.local',
    '.gitignore', '.npmignore', 'package-lock.json', 'yarn.lock'
  ];
  
  for (const pattern of skipPatterns) {
    if (lowerFilename.includes(pattern)) {
      return false;
    }
  }
  
  return validExtensions.some(ext => lowerFilename.endsWith(ext));
}

export function detectProjectType(files: Record<string, string>): string {
  const filenames = Object.keys(files);
  
  // Check for specific project indicators
  if (filenames.some(f => f.includes('package.json'))) {
    const packageJson = Object.entries(files).find(([path]) => 
      path.endsWith('package.json')
    )?.[1];
    
    if (packageJson) {
      try {
        const pkg = JSON.parse(packageJson);
        if (pkg.dependencies?.react || pkg.devDependencies?.react) {
          return filenames.some(f => f.endsWith('.tsx') || f.endsWith('.ts')) 
            ? 'react-ts' 
            : 'react';
        }
        if (pkg.dependencies?.vue || pkg.devDependencies?.vue) {
          return 'vue';
        }
      } catch {
        // Invalid JSON, continue with other detection
      }
    }
    return 'node';
  }
  
  // Check by file extensions
  if (filenames.some(f => f.endsWith('.tsx') || f.endsWith('.ts'))) {
    return 'react-ts';
  }
  
  if (filenames.some(f => f.endsWith('.jsx'))) {
    return 'react';
  }
  
  if (filenames.some(f => f.endsWith('.vue'))) {
    return 'vue';
  }
  
  if (filenames.some(f => f.endsWith('.svelte'))) {
    return 'svelte';
  }
  
  return 'vanilla';
}