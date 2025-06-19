'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploaderProps {
  onFileUpload: (content: string, filename: string) => void;
}

export default function FileUploader({ onFileUpload }: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onFileUpload(content, file.name);
        };
        reader.readAsText(file);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/typescript': ['.tsx', '.ts'],
      'text/javascript': ['.jsx', '.js'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        <div className="text-2xl">📁</div>
        {isDragActive ? (
          <p className="text-blue-600">Drop your TSX file here...</p>
        ) : (
          <div>
            <p className="text-gray-600">
              Drag & drop your TSX file here, or click to select
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Supports .tsx, .ts, .jsx, .js files
            </p>
          </div>
        )}
      </div>
    </div>
  );
}