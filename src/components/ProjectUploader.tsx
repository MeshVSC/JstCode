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
            <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
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
                  <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  Start from Template
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}