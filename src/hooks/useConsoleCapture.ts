'use client';

import { useState, useCallback, useRef } from 'react';
import { ConsoleMessage } from '@/components/ConsolePanel';

export function useConsoleCapture() {
  const [messages, setMessages] = useState<ConsoleMessage[]>();
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addMessage = useCallback((
    type: ConsoleMessage['type'],
    message: string,
    args?: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => {
    const newMessage: ConsoleMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: Date.now(),
      args,
    };

    // Debounce message updates to prevent rapid re-renders
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    
    messageTimeoutRef.current = setTimeout(() => {
      setMessages(prev => [...(prev || []), newMessage]);
    }, 100);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const handleSandpackMessage = useCallback((event: MessageEvent) => {
    // Handle various Sandpack message formats
    const data = event.data;
    
    if (!data || typeof data !== 'object') return;
    
    // Handle console messages (new format)
    if (data.type === 'console' && data.codesandbox && data.method) {
      const { method, arguments: args } = data;
      const message = args ? args.map((arg: any) => // eslint-disable-line @typescript-eslint/no-explicit-any 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ') : '';
      
      switch (method) {
        case 'log':
          addMessage('log', message, args);
          break;
        case 'warn':
          addMessage('warn', message, args);
          break;
        case 'error':
          addMessage('error', message, args);
          break;
        case 'info':
          addMessage('info', message, args);
          break;
      }
      return;
    }
    
    // Handle errors from Sandpack
    if (data.type === 'action' && data.action === 'notification' && data.notificationType === 'error') {
      addMessage('error', data.title || 'Runtime Error');
      return;
    }
    
    // Handle compilation errors
    if (data.type === 'compile-error' || data.type === 'runtime-error') {
      addMessage('error', data.message || data.error || 'Compilation Error');
      return;
    }
    
    // Fallback: log any potential error messages
    if (data.error || data.message) {
      const message = data.error || data.message;
      if (typeof message === 'string' && message.trim()) {
        addMessage('error', message);
      }
    }
  }, [addMessage]);

  return {
    messages: messages || [],
    addMessage,
    clearMessages,
    handleSandpackMessage,
  };
}