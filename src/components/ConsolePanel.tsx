'use client';

import { useState, useEffect, useRef } from 'react';

export interface ConsoleMessage {
  id: string;
  type: 'log' | 'warn' | 'error' | 'info';
  message: string;
  timestamp: number;
  args?: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface ConsolePanelProps {
  messages: ConsoleMessage[];
  onClear: () => void;
}

const getMessageIcon = (type: ConsoleMessage['type']) => {
  switch (type) {
    case 'error':
      return '❌';
    case 'warn':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    default:
      return '📝';
  }
};

const getMessageColor = (type: ConsoleMessage['type']) => {
  switch (type) {
    case 'error':
      return 'text-red-400';
    case 'warn':
      return 'text-yellow-400';
    case 'info':
      return 'text-blue-400';
    default:
      return 'text-[#cccccc]';
  }
};

function formatMessage(message: string, args?: any[]): string { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!args || args.length === 0) return message;
  
  // Simple string interpolation for console messages
  let formatted = message;
  args.forEach((arg, index) => {
    const placeholder = `%${index + 1}`;
    if (formatted.includes(placeholder)) {
      formatted = formatted.replace(placeholder, String(arg));
    } else {
      formatted += ` ${String(arg)}`;
    }
  });
  
  return formatted;
}

export default function ConsolePanel({ messages, onClear }: ConsolePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && isExpanded) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isExpanded]);

  const errorCount = messages.filter(m => m.type === 'error').length;
  const warningCount = messages.filter(m => m.type === 'warn').length;

  return (
    <div className="border-t border-[#3e3e42] bg-[#1e1e1e]">
      {/* Console Header */}
      <div 
        className="h-8 bg-[#2d2d30] flex items-center justify-between px-3 cursor-pointer hover:bg-[#37373d] transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#cccccc] uppercase tracking-wide">Console</span>
          <span className="text-xs text-[#858585]">
            {isExpanded ? '▼' : '▶'}
          </span>
          {(errorCount > 0 || warningCount > 0) && (
            <div className="flex gap-1">
              {errorCount > 0 && (
                <span className="text-xs bg-red-600 text-white px-1 rounded">
                  {errorCount}
                </span>
              )}
              {warningCount > 0 && (
                <span className="text-xs bg-yellow-600 text-white px-1 rounded">
                  {warningCount}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="text-xs text-[#858585] hover:text-[#cccccc] px-2 py-1 hover:bg-[#3e3e42] rounded transition-colors"
            title="Clear console"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Console Messages */}
      {isExpanded && (
        <div className="h-48 overflow-auto bg-[#1e1e1e] border-t border-[#3e3e42]">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[#858585] text-sm">
              Console output will appear here
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 text-xs font-mono ${getMessageColor(msg.type)}`}
                >
                  <span className="text-[10px] mt-0.5">{getMessageIcon(msg.type)}</span>
                  <span className="text-[#858585] text-[10px] mt-0.5 min-w-[50px]">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="flex-1 break-words">
                    {formatMessage(msg.message, msg.args)}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}