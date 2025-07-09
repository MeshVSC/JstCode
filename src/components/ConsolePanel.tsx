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
      return (
        <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    case 'warn':
      return (
        <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    case 'info':
      return (
        <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      );
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