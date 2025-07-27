import { useState, useCallback } from 'react';
import { analyzeCode, quickDetectLanguage, CodeAnalysis } from '@/utils/codeDetector';

export interface DetectionResult {
  analysis: CodeAnalysis | null;
  isAnalyzing: boolean;
  error: string | null;
}

export function useCodeDetection() {
  const [detectionResult, setDetectionResult] = useState<DetectionResult>({
    analysis: null,
    isAnalyzing: false,
    error: null
  });

  // Analyze code content
  const analyzeCodeContent = useCallback(async (code: string, filename?: string): Promise<CodeAnalysis> => {
    setDetectionResult(prev => ({ ...prev, isAnalyzing: true, error: null }));
    
    try {
      // Add small delay to show loading state for very fast analysis
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const analysis = analyzeCode(code, filename);
      
      setDetectionResult({
        analysis,
        isAnalyzing: false,
        error: null
      });
      
      return analysis;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      setDetectionResult({
        analysis: null,
        isAnalyzing: false,
        error: errorMessage
      });
      throw error;
    }
  }, []);

  // Quick language detection (for file uploads)
  const detectLanguageQuick = useCallback((filename: string, content?: string): string => {
    return quickDetectLanguage(filename, content);
  }, []);

  // Reset detection state
  const resetDetection = useCallback(() => {
    setDetectionResult({
      analysis: null,
      isAnalyzing: false,
      error: null
    });
  }, []);

  // Get confidence level description
  const getConfidenceLevel = useCallback((confidence: number): string => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    if (confidence >= 0.4) return 'Low';
    return 'Very Low';
  }, []);

  // Get confidence color for UI
  const getConfidenceColor = useCallback((confidence: number): string => {
    if (confidence >= 0.8) return 'text-success';
    if (confidence >= 0.6) return 'text-warning';
    if (confidence >= 0.4) return 'text-error';
    return 'text-muted';
  }, []);

  return {
    ...detectionResult,
    analyzeCodeContent,
    detectLanguageQuick,
    resetDetection,
    getConfidenceLevel,
    getConfidenceColor
  };
}

// Helper to format features for display
export function formatFeatures(features: string[]): string {
  if (features.length === 0) return 'No specific features detected';
  if (features.length <= 3) return features.join(', ');
  return `${features.slice(0, 3).join(', ')} and ${features.length - 3} more`;
}

// Helper to get file icon based on language
export function getLanguageIcon(language: string): string {
  const iconMap: Record<string, string> = {
    'typescript-react': '⚛️',
    'javascript-react': '⚛️', 
    'typescript': '🔷',
    'javascript': '🟨',
    'html': '🌐',
    'css': '🎨',
    'vue': '💚',
    'angular': '🅰️',
    'python': '🐍',
    'java': '☕',
    'cpp': '⚙️',
    'c': '⚙️',
    'csharp': '#️⃣',
    'php': '🐘',
    'ruby': '💎',
    'go': '🐹',
    'rust': '🦀',
    'swift': '🍎'
  };
  
  return iconMap[language] || '📄';
}