'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ProjectUploader from './ProjectUploader';
import TemplateSelector, { Template } from './TemplateSelector';
import { useCodeDetection } from '@/hooks/useCodeDetection';
import CodeDetectionResult from './CodeDetectionResult';

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
  const { analysis, isAnalyzing, analyzeCodeContent, resetDetection } = useCodeDetection();

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
        reader.onload = async (e) => {
          const content = e.target?.result as string;
          
          // Analyze the code automatically
          try {
            await analyzeCodeContent(content, file.name);
          } catch (error) {
            console.warn('Code analysis failed:', error);
          }
          
          // Still upload the file
          onFileUpload(content, file.name);
        };
        reader.readAsText(file);
      }
    },
    [onFileUpload, analyzeCodeContent]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/typescript': ['.tsx', '.ts'],
      'text/javascript': ['.jsx', '.js'],
    },
    multiple: false,
  });

  const handleApplyTemplate = (templateId: string) => {
    // Find the template and apply it
    setShowTemplates(true);
    // The TemplateSelector will handle the actual template application
  };

  // Use ProjectUploader for project mode
  if (mode === 'project' && onProjectUpload) {
    return (
      <>
        {/* Show code detection result if available */}
        {analysis && (
          <CodeDetectionResult
            analysis={analysis}
            onApplyTemplate={handleApplyTemplate}
            onDismiss={resetDetection}
          />
        )}
        
        <ProjectUploader 
          onProjectUpload={onProjectUpload} 
          onShowTemplates={() => setShowTemplates(true)}
          isAnalyzing={isAnalyzing}
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
    <>
      {/* Show code detection result if available */}
      {analysis && (
        <div className="mb-4">
          <CodeDetectionResult
            analysis={analysis}
            onApplyTemplate={handleApplyTemplate}
            onDismiss={resetDetection}
          />
        </div>
      )}
      
      {/* Show analyzing state */}
      {isAnalyzing && (
        <div className="mb-4 p-4 bg-elevated border border-default rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
            <span className="text-sm text-primary">Analyzing code...</span>
          </div>
        </div>
      )}
      
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? 'border-primary bg-primary/10'
              : 'border-default hover:border-primary'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <div className="text-2xl">
            <svg className="w-8 h-8 mx-auto text-muted" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          </div>
          {isDragActive ? (
            <p className="text-primary">Drop your TSX file here...</p>
          ) : (
            <div>
              <p className="text-secondary">
                Drag & drop your code file here, or click to select
              </p>
              <p className="text-sm text-muted mt-1">
                Auto-detects: React, Vue, Angular, TypeScript, JavaScript, HTML, CSS
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}