'use client';

import { useState, useCallback } from 'react';
import { ConsoleMessage } from '@/components/ConsolePanel';

export function useConsoleCapture() {
  const [messages, setMessages] = useState<ConsoleMessage[]>();

  const addMessage = useCallback((
    type: ConsoleMessage['type'],
    message: string,
    args?: any[]
  ) => {
    const newMessage: ConsoleMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: Date.now(),
      args,
    };

    setMessages(prev => [...(prev || []), newMessage]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const handleSandpackMessage = useCallback((event: MessageEvent) => {
    // Handle messages from Sandpack iframe
    if (event.data && event.data.type === 'console') {
      const { method, data } = event.data;
      
      switch (method) {
        case 'log':
          addMessage('log', data.join(' '), data);
          break;
        case 'warn':
          addMessage('warn', data.join(' '), data);
          break;
        case 'error':
          addMessage('error', data.join(' '), data);
          break;
        case 'info':
          addMessage('info', data.join(' '), data);
          break;
      }
    }
    
    // Handle build errors
    if (event.data && event.data.type === 'build-error') {
      addMessage('error', `Build Error: ${event.data.message}`);
    }
    
    // Handle runtime errors
    if (event.data && event.data.type === 'runtime-error') {
      addMessage('error', `Runtime Error: ${event.data.message}`);
    }
  }, [addMessage]);

  return {
    messages: messages || [],
    addMessage,
    clearMessages,
    handleSandpackMessage,
  };
}