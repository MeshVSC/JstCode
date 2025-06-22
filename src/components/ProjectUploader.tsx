'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { parseProjectFromFiles, parseProjectFromDataTransfer } from '@/utils/projectParser';

interface ProjectUploaderProps {
  onProjectUpload: (files: Record<string, string>) => void;
  onShowTemplates?: () => void;
}

export default function ProjectUploader({ onProjectUpload, onShowTemplates }: ProjectUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState('');

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: any[], event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      setIsLoading(true);
      setProgress('Processing files...');

      try {
        const projectFiles: Record<string, string> = {};

        // Check for drag and drop from file system (folders)
        if (event.dataTransfer?.items) {
          setProgress('Processing folders and files...');
          const items = Array.from(event.dataTransfer.items) as DataTransferItem[];
          const folderFiles = await parseProjectFromDataTransfer(items);
          Object.assign(projectFiles, folderFiles);
        }

        // Handle uploaded files (including ZIP)
        if (acceptedFiles.length > 0) {
          setProgress('Reading uploaded files...');
          const uploadedFiles = await parseProjectFromFiles(acceptedFiles as any); // eslint-disable-line @typescript-eslint/no-explicit-any
          Object.assign(projectFiles, uploadedFiles);
        }

        const fileCount = Object.keys(projectFiles).length;
        
        if (fileCount === 0) {
          throw new Error('No valid code files found');
        }

        setProgress(`Loaded ${fileCount} files`);
        
        // Small delay to show success message
        await new Promise(resolve => setTimeout(resolve, 500));
        
        onProjectUpload(projectFiles);
      } catch (error) {
        console.error('Error processing project:', error);
        setProgress(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        // Clear error after 3 seconds
        setTimeout(() => {
          setProgress('');
          setIsLoading(false);
        }, 3000);
        return;
      }

      setIsLoading(false);
      setProgress('');
    },
    [onProjectUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/typescript': ['.tsx', '.ts'],
      'text/javascript': ['.jsx', '.js'],
      'application/json': ['.json'],
      'text/css': ['.css'],
      'text/html': ['.html'],
      'text/markdown': ['.md'],
      'application/zip': ['.zip'],
    },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
        ${isDragActive
          ? 'border-[#4e4e52] bg-[#252526]'
          : 'border-[#3e3e42] hover:border-[#4e4e52] hover:bg-[#252526]'
        }
        ${isLoading ? 'pointer-events-none opacity-70' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div className="space-y-3">
        <div className="flex items-center justify-center h-12">
          {isLoading ? (
            <span className="text-3xl">⏳</span>
          ) : isDragActive ? (
            <Image src="/blocks_W.png" alt="Drop files" width={40} height={40} className="opacity-80" />
          ) : (
            <Image src="/blocks_W.png" alt="Upload files" width={32} height={32} className="opacity-60" />
          )}
        </div>
        
        {isLoading ? (
          <div>
            <p className="text-[#cccccc] font-medium">Loading...</p>
            {progress && (
              <p className="text-[#858585] text-sm mt-1">{progress}</p>
            )}
          </div>
        ) : isDragActive ? (
          <p className="text-[#cccccc] font-medium">Drop your project here...</p>
        ) : (
          <div>
            <p className="text-[#cccccc] font-medium mb-2">
              Drag & drop your project here
            </p>
            <div className="space-y-1 text-sm text-[#858585] mb-3">
              <p>✓ Single files (.tsx, .ts, .jsx, .js)</p>
              <p>✓ Multiple files or folders</p>
              <p>✓ Zip archives</p>
              <p>✓ Full React/Next.js projects</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-[#606060]">
                or click to select files
              </p>
              {onShowTemplates && (
                <button
                  onClick={onShowTemplates}
                  className="px-4 py-2 bg-[#007acc] hover:bg-[#0086d3] text-white text-sm rounded transition-colors"
                >
                  🚀 Start from Template
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}