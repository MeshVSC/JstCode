'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ProjectUploader from './ProjectUploader';
import TemplateSelector, { Template } from './TemplateSelector';

interface FileUploaderProps {
  onFileUpload?: (content: string, filename: string) => void;
  onProjectUpload?: (files: Record<string, string>) => void;
  mode?: 'single' | 'project';
}

export default function FileUploader({ 
  onFileUpload, 
  onProjectUpload, 
  mode = 'project' 
}: FileUploaderProps) {
  const [showTemplates, setShowTemplates] = useState(false);

  const handleTemplateSelect = (template: Template) => {
    if (onProjectUpload) {
      onProjectUpload(template.files);
    }
    setShowTemplates(false);
  };
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && onFileUpload) {
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

  // Use ProjectUploader for project mode
  if (mode === 'project' && onProjectUpload) {
    return (
      <>
        <ProjectUploader 
          onProjectUpload={onProjectUpload} 
          onShowTemplates={() => setShowTemplates(true)}
        />
        <TemplateSelector
          isOpen={showTemplates}
          onClose={() => setShowTemplates(false)}
          onSelectTemplate={handleTemplateSelect}
        />
      </>
    );
  }

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
        <div className="text-2xl">
          <svg className="w-8 h-8 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
        </div>
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