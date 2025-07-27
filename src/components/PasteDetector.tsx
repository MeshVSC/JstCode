'use client';

import { useState, useRef, useCallback } from 'react';
import { useCodeDetection } from '@/hooks/useCodeDetection';
import CodeDetectionResult from './CodeDetectionResult';

interface PasteDetectorProps {
  onCodePasted?: (code: string, analysis?: any) => void;
  onApplyTemplate?: (templateId: string) => void;
  placeholder?: string;
  className?: string;
}

export default function PasteDetector({ 
  onCodePasted, 
  onApplyTemplate,
  placeholder = "Paste your code here to auto-detect language and framework...",
  className = ""
}: PasteDetectorProps) {
  const [code, setCode] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { analysis, isAnalyzing, analyzeCodeContent, resetDetection } = useCodeDetection();

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    
    if (pastedText.length > 50) { // Only analyze substantial code
      try {
        const result = await analyzeCodeContent(pastedText);
        setShowAnalysis(true);
        
        if (onCodePasted) {
          onCodePasted(pastedText, result);
        }
      } catch (error) {
        console.warn('Code analysis failed:', error);
        if (onCodePasted) {
          onCodePasted(pastedText);
        }
      }
    } else if (onCodePasted) {
      onCodePasted(pastedText);
    }
  }, [analyzeCodeContent, onCodePasted]);

  const handleInputChange = useCallback(async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    
    // Auto-analyze when substantial code is entered (not just pasted)
    if (newCode.length > 100 && newCode.includes('\n')) {
      try {
        await analyzeCodeContent(newCode);
        setShowAnalysis(true);
      } catch (error) {
        console.warn('Code analysis failed:', error);
      }
    } else if (newCode.length === 0) {
      resetDetection();
      setShowAnalysis(false);
    }
  }, [analyzeCodeContent, resetDetection]);

  const handleClear = () => {
    setCode('');
    resetDetection();
    setShowAnalysis(false);
    textareaRef.current?.focus();
  };

  const handleApplyTemplate = (templateId: string) => {
    if (onApplyTemplate) {
      onApplyTemplate(templateId);
    }
    setShowAnalysis(false);
  };

  const handleDismissAnalysis = () => {
    setShowAnalysis(false);
    resetDetection();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Analysis Result */}
      {showAnalysis && analysis && (
        <CodeDetectionResult
          analysis={analysis}
          onApplyTemplate={handleApplyTemplate}
          onDismiss={handleDismissAnalysis}
        />
      )}
      
      {/* Analyzing State */}
      {isAnalyzing && (
        <div className="p-4 bg-elevated border border-default rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
            <span className="text-sm text-primary">Analyzing pasted code...</span>
          </div>
        </div>
      )}
      
      {/* Code Input Area */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleInputChange}
          onPaste={handlePaste}
          placeholder={placeholder}
          className="w-full h-48 p-4 bg-surface border border-default rounded-lg text-primary font-mono text-sm resize-y focus:outline-none focus:border-primary transition-colors"
          style={{ minHeight: '192px' }}
        />
        
        {/* Clear Button */}
        {code && (
          <button
            onClick={handleClear}
            className="absolute top-3 right-3 text-muted hover:text-primary text-sm px-2 py-1 bg-elevated border border-default rounded hover:bg-hover transition-colors"
            title="Clear code"
          >
            Clear
          </button>
        )}
        
        {/* Helper Text */}
        <div className="absolute bottom-3 left-4 text-xs text-muted">
          {code.length === 0 ? (
            "Supports: React, Vue, Angular, TypeScript, JavaScript, HTML, CSS and more"
          ) : (
            `${code.length} characters ${code.split('\n').length} lines`
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      {code && !showAnalysis && !isAnalyzing && (
        <div className="flex gap-2">
          <button
            onClick={() => analyzeCodeContent(code)}
            className="btn btn-secondary btn-sm"
          >
            🔍 Analyze Code
          </button>
          {onCodePasted && (
            <button
              onClick={() => onCodePasted(code)}
              className="btn btn-primary btn-sm"
            >
              Use Code
            </button>
          )}
        </div>
      )}
    </div>
  );
}