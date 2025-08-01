'use client';

import { useState, useCallback, useEffect } from 'react';

interface StyleProperty {
  property: string;
  value: string;
  unit?: string;
  type: 'number' | 'select' | 'color' | 'toggle';
  options?: string[];
  min?: number;
  max?: number;
}

interface SelectedElement {
  tagName: string;
  className: string;
  styles: Record<string, string>;
}

interface VisualDesignPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onStyleChange: (selector: string, property: string, value: string) => void;
}

const STYLE_CATEGORIES = {
  layout: {
    title: 'Layout',
    properties: [
      { property: 'display', value: 'flex', type: 'select' as const, options: ['block', 'flex', 'grid', 'inline-block', 'none'] },
      { property: 'position', value: 'relative', type: 'select' as const, options: ['static', 'relative', 'absolute', 'fixed', 'sticky'] },
      { property: 'width', value: '100', unit: 'px', type: 'number' as const, min: 0, max: 1000 },
      { property: 'height', value: 'auto', type: 'select' as const, options: ['auto', '100px', '200px', '100%', '100vh'] },
    ]
  },
  spacing: {
    title: 'Spacing',
    properties: [
      { property: 'margin', value: '0', unit: 'px', type: 'number' as const, min: 0, max: 100 },
      { property: 'margin-top', value: '0', unit: 'px', type: 'number' as const, min: 0, max: 100 },
      { property: 'margin-right', value: '0', unit: 'px', type: 'number' as const, min: 0, max: 100 },
      { property: 'margin-bottom', value: '0', unit: 'px', type: 'number' as const, min: 0, max: 100 },
      { property: 'margin-left', value: '0', unit: 'px', type: 'number' as const, min: 0, max: 100 },
      { property: 'padding', value: '0', unit: 'px', type: 'number' as const, min: 0, max: 100 },
      { property: 'padding-top', value: '0', unit: 'px', type: 'number' as const, min: 0, max: 100 },
      { property: 'padding-right', value: '0', unit: 'px', type: 'number' as const, min: 0, max: 100 },
      { property: 'padding-bottom', value: '0', unit: 'px', type: 'number' as const, min: 0, max: 100 },
      { property: 'padding-left', value: '0', unit: 'px', type: 'number' as const, min: 0, max: 100 },
    ]
  },
  flexbox: {
    title: 'Flexbox',
    properties: [
      { property: 'flex-direction', value: 'row', type: 'select' as const, options: ['row', 'column', 'row-reverse', 'column-reverse'] },
      { property: 'justify-content', value: 'flex-start', type: 'select' as const, options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'] },
      { property: 'align-items', value: 'stretch', type: 'select' as const, options: ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'] },
      { property: 'flex-wrap', value: 'nowrap', type: 'select' as const, options: ['nowrap', 'wrap', 'wrap-reverse'] },
      { property: 'gap', value: '0', unit: 'px', type: 'number' as const, min: 0, max: 50 },
    ]
  },
  appearance: {
    title: 'Appearance',
    properties: [
      { property: 'background-color', value: '#ffffff', type: 'color' as const },
      { property: 'color', value: '#000000', type: 'color' as const },
      { property: 'border', value: '1px solid #ccc', type: 'select' as const, options: ['none', '1px solid #ccc', '2px solid #000', '1px dashed #999'] },
      { property: 'border-radius', value: '0', unit: 'px', type: 'number' as const, min: 0, max: 50 },
      { property: 'opacity', value: '1', type: 'number' as const, min: 0, max: 1 },
    ]
  }
};

export default function VisualDesignPanel({ isOpen, onClose, onStyleChange }: VisualDesignPanelProps) {
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('layout');

  // Mock element selection for demo
  useEffect(() => {
    if (isOpen && !selectedElement) {
      setSelectedElement({
        tagName: 'div',
        className: 'example-element',
        styles: {
          display: 'flex',
          padding: '16px',
          margin: '8px',
          'background-color': '#f0f0f0',
          'border-radius': '4px'
        }
      });
    }
  }, [isOpen, selectedElement]);

  const handleStyleChange = useCallback((property: string, value: string, unit?: string) => {
    const fullValue = unit ? `${value}${unit}` : value;
    onStyleChange('.example-element', property, fullValue);
    
    // Update local state
    if (selectedElement) {
      setSelectedElement({
        ...selectedElement,
        styles: {
          ...selectedElement.styles,
          [property]: fullValue
        }
      });
    }
  }, [onStyleChange, selectedElement]);

  const renderPropertyInput = (prop: StyleProperty) => {
    const currentValue = selectedElement?.styles[prop.property] || prop.value;
    
    switch (prop.type) {
      case 'number':
        const numericValue = parseFloat(currentValue) || 0;
        return (
          <div className="flex items-center gap-2">
            <input
              id={`range-${prop.property}`}
              name={`range-${prop.property}`}
              type="range"
              min={prop.min || 0}
              max={prop.max || 100}
              value={numericValue}
              onChange={(e) => handleStyleChange(prop.property, e.target.value, prop.unit)}
              className="flex-1"
            />
            <input
              id={`number-${prop.property}`}
              name={`number-${prop.property}`}
              type="number"
              value={numericValue}
              onChange={(e) => handleStyleChange(prop.property, e.target.value, prop.unit)}
              className="w-16 px-2 py-1 text-xs bg-elevated border border-default rounded text-primary"
            />
            {prop.unit && <span className="text-xs text-muted">{prop.unit}</span>}
          </div>
        );
      
      case 'select':
        return (
          <select
            value={currentValue}
            onChange={(e) => handleStyleChange(prop.property, e.target.value)}
            className="w-full px-2 py-1 text-xs bg-elevated border border-default rounded text-primary"
          >
            {prop.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'color':
        return (
          <div className="flex items-center gap-2">
            <input
              id={`color-${prop.property}`}
              name={`color-${prop.property}`}
              type="color"
              value={currentValue}
              onChange={(e) => handleStyleChange(prop.property, e.target.value)}
              className="w-8 h-6 border border-default rounded"
            />
            <input
              id={`color-text-${prop.property}`}
              name={`color-text-${prop.property}`}
              type="text"
              value={currentValue}
              onChange={(e) => handleStyleChange(prop.property, e.target.value)}
              className="flex-1 px-2 py-1 text-xs bg-elevated border border-default rounded text-primary font-mono"
            />
          </div>
        );
      
      default:
        return (
          <input
            id={`text-${prop.property}`}
            name={`text-${prop.property}`}
            type="text"
            value={currentValue}
            onChange={(e) => handleStyleChange(prop.property, e.target.value)}
            className="w-full px-2 py-1 text-xs bg-elevated border border-default rounded text-primary"
          />
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-elevated border-l border-default flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-default">
        <h2 className="text-sm font-semibold text-primary">🎨 Style Inspector</h2>
        <button
          onClick={onClose}
          className="text-muted hover:text-primary text-lg"
        >
          ×
        </button>
      </div>

      {/* Selected Element Info */}
      {selectedElement && (
        <div className="p-3 border-b border-default bg-sidebar">
          <div className="text-xs text-muted">Selected Element</div>
          <div className="text-sm text-primary font-mono">
            &lt;{selectedElement.tagName}
            {selectedElement.className && (
              <span className="text-[#4fc1ff]"> className=&quot;{selectedElement.className}&quot;</span>
            )}
            &gt;
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex overflow-x-auto border-b border-default">
        {Object.entries(STYLE_CATEGORIES).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-3 py-2 text-xs whitespace-nowrap transition-colors border-b-2 ${
              activeCategory === key
                ? 'border-primary text-primary bg-sidebar'
                : 'border-transparent text-muted hover:text-primary'
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-auto p-3">
        <div className="space-y-4">
          {STYLE_CATEGORIES[activeCategory as keyof typeof STYLE_CATEGORIES]?.properties.map((prop) => (
            <div key={prop.property}>
              <label className="block text-xs font-medium text-primary mb-2">
                {prop.property.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </label>
              {renderPropertyInput(prop)}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-default text-xs text-muted">
        <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Click elements in preview to inspect and edit their styles
      </div>
    </div>
  );
}