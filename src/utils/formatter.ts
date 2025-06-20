// Import prettier dynamically to avoid SSR issues
let prettier: any = null;
let parserTypeScript: any = null;
let parserBabel: any = null;
let parserPostcss: any = null;
let parserHtml: any = null;
let parserMarkdown: any = null;
import { SupportedFileTypes } from '@/types/project';

export interface FormatOptions {
  parser?: string;
  semi?: boolean;
  singleQuote?: boolean;
  tabWidth?: number;
  trailingComma?: 'none' | 'es5' | 'all';
  printWidth?: number;
}

const DEFAULT_OPTIONS: FormatOptions = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 80,
};

function getParserForLanguage(language: SupportedFileTypes): string {
  switch (language) {
    case 'typescript':
      return 'typescript';
    case 'javascript':
      return 'babel';
    case 'json':
      return 'json';
    case 'css':
      return 'css';
    case 'html':
      return 'html';
    case 'markdown':
      return 'markdown';
    default:
      return 'babel';
  }
}

function getPluginsForLanguage(language: SupportedFileTypes) {
  switch (language) {
    case 'typescript':
      return [parserTypeScript];
    case 'javascript':
      return [parserBabel];
    case 'json':
      return [parserBabel];
    case 'css':
      return [parserPostcss];
    case 'html':
      return [parserHtml];
    case 'markdown':
      return [parserMarkdown];
    default:
      return [parserBabel];
  }
}

async function loadPrettier() {
  if (typeof window === 'undefined') {
    throw new Error('Prettier can only be used in the browser');
  }
  
  if (!prettier) {
    prettier = await import('prettier/standalone');
    parserTypeScript = await import('prettier/plugins/typescript');
    parserBabel = await import('prettier/plugins/babel');
    parserPostcss = await import('prettier/plugins/postcss');
    parserHtml = await import('prettier/plugins/html');
    parserMarkdown = await import('prettier/plugins/markdown');
  }
}

export async function formatCode(
  code: string, 
  language: SupportedFileTypes,
  options: FormatOptions = {}
): Promise<string> {
  try {
    await loadPrettier();
    
    const parser = getParserForLanguage(language);
    const plugins = getPluginsForLanguage(language);
    
    const formatOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      parser,
      plugins,
    };

    const formatted = await prettier.format(code, formatOptions);
    return formatted;
  } catch (error) {
    console.error('Formatting error:', error);
    throw new Error(`Failed to format code: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function canFormatLanguage(language: SupportedFileTypes): boolean {
  return ['typescript', 'javascript', 'json', 'css', 'html', 'markdown'].includes(language);
}