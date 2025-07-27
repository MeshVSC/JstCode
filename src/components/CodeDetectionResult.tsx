'use client';

import { CodeAnalysis } from '@/utils/codeDetector';
import { formatFeatures, getLanguageIcon } from '@/hooks/useCodeDetection';

interface CodeDetectionResultProps {
  analysis: CodeAnalysis;
  onApplyTemplate?: (templateId: string) => void;
  onDismiss?: () => void;
}

export default function CodeDetectionResult({ 
  analysis, 
  onApplyTemplate, 
  onDismiss 
}: CodeDetectionResultProps) {
  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return 'text-success';
    if (confidence >= 0.6) return 'text-warning';
    if (confidence >= 0.4) return 'text-error';
    return 'text-muted';
  };

  const getConfidenceLevel = (confidence: number): string => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    if (confidence >= 0.4) return 'Low';
    return 'Very Low';
  };

  const confidencePercentage = Math.round(analysis.confidence * 100);

  return (
    <div className="bg-elevated border border-default rounded-lg p-4 mb-4 shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getLanguageIcon(analysis.language)}</span>
          <div>
            <h3 className="text-sm font-semibold text-primary mb-1">
              Code Detected!
            </h3>
            <p className="text-xs text-secondary">
              {analysis.description}
            </p>
          </div>
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-muted hover:text-primary text-lg"
            title="Dismiss"
          >
            ×
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-muted mb-1">Language</div>
          <div className="text-sm text-primary font-medium">
            {analysis.language.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
        </div>
        
        {analysis.framework && (
          <div>
            <div className="text-xs text-muted mb-1">Framework</div>
            <div className="text-sm text-primary font-medium">
              {analysis.framework.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
          </div>
        )}
        
        <div>
          <div className="text-xs text-muted mb-1">Project Type</div>
          <div className="text-sm text-primary font-medium">
            {analysis.projectType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
        </div>
        
        <div>
          <div className="text-xs text-muted mb-1">Confidence</div>
          <div className={`text-sm font-medium ${getConfidenceColor(analysis.confidence)}`}>
            {getConfidenceLevel(analysis.confidence)} ({confidencePercentage}%)
          </div>
        </div>
      </div>

      {analysis.features.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-muted mb-2">Detected Features</div>
          <div className="flex flex-wrap gap-1">
            {analysis.features.slice(0, 6).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-surface text-xs text-secondary rounded border border-default"
              >
                {feature}
              </span>
            ))}
            {analysis.features.length > 6 && (
              <span className="px-2 py-1 text-xs text-muted">
                +{analysis.features.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      {analysis.suggestedTemplate && onApplyTemplate && (
        <div className="flex items-center justify-between pt-3 border-t border-default">
          <div>
            <div className="text-xs text-muted">Suggested Template</div>
            <div className="text-sm text-primary font-medium">
              {analysis.suggestedTemplate.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
          </div>
          <button
            onClick={() => onApplyTemplate(analysis.suggestedTemplate!)}
            className="btn btn-primary btn-sm"
          >
            Apply Template
          </button>
        </div>
      )}
      
      {analysis.confidence < 0.5 && (
        <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded text-xs text-warning">
          <strong>Low confidence detection:</strong> The code analysis isn't very confident about this detection. 
          You may want to manually select the appropriate template.
        </div>
      )}
    </div>
  );
}