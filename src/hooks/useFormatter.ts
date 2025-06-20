'use client';

import { useState, useCallback } from 'react';
import { formatCode, FormatOptions, canFormatLanguage } from '@/utils/formatter';
import { SupportedFileTypes } from '@/types/project';

interface UseFormatterReturn {
  isFormatting: boolean;
  formatError: string | null;
  format: (code: string, language: SupportedFileTypes, options?: FormatOptions) => Promise<string>;
  canFormat: (language: SupportedFileTypes) => boolean;
}

export function useFormatter(): UseFormatterReturn {
  const [isFormatting, setIsFormatting] = useState(false);
  const [formatError, setFormatError] = useState<string | null>(null);

  const format = useCallback(async (
    code: string, 
    language: SupportedFileTypes,
    options?: FormatOptions
  ): Promise<string> => {
    setIsFormatting(true);
    setFormatError(null);

    try {
      const formattedCode = await formatCode(code, language, options);
      return formattedCode;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown formatting error';
      setFormatError(errorMessage);
      throw error;
    } finally {
      setIsFormatting(false);
    }
  }, []);

  const canFormat = useCallback((language: SupportedFileTypes) => {
    return canFormatLanguage(language);
  }, []);

  return {
    isFormatting,
    formatError,
    format,
    canFormat,
  };
}