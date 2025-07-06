// Import prettier dynamically to avoid SSR issues
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

async function loadPrettierWithPlugins(language: SupportedFileTypes) {
  if (typeof window === 'undefined') {
    throw new Error('Prettier can only be used in the browser');
  }
  
  const prettier = await import('prettier/standalone');
  
  let plugins = [];
  
  switch (language) {
    case 'typescript':
      const parserTypeScript = await import('prettier/plugins/typescript');
      const parserEstree = await import('prettier/plugins/estree');
      plugins = [parserTypeScript.default, parserEstree.default];
      break;
    case 'javascript':
      const parserBabel = await import('prettier/plugins/babel');
      const parserEstree2 = await import('prettier/plugins/estree');
      plugins = [parserBabel.default, parserEstree2.default];
      break;
    case 'json':
      const parserBabel2 = await import('prettier/plugins/babel');
      const parserEstree3 = await import('prettier/plugins/estree');
      plugins = [parserBabel2.default, parserEstree3.default];
      break;
    case 'css':
      const parserPostcss = await import('prettier/plugins/postcss');
      plugins = [parserPostcss.default];
      break;
    case 'html':
      const parserHtml = await import('prettier/plugins/html');
      plugins = [parserHtml.default];
      break;
    case 'markdown':
      const parserMarkdown = await import('prettier/plugins/markdown');
      plugins = [parserMarkdown.default];
      break;
    default:
      const parserBabelDefault = await import('prettier/plugins/babel');
      const parserEstreeDefault = await import('prettier/plugins/estree');
      plugins = [parserBabelDefault.default, parserEstreeDefault.default];
      break;
  }
  
  return { prettier: prettier.default, plugins };
}

export async function formatCode(
  code: string, 
  language: SupportedFileTypes,
  options: FormatOptions = {}
): Promise<string> {
  try {
    const { prettier, plugins } = await loadPrettierWithPlugins(language);
    
    const parser = getParserForLanguage(language);
    
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
    
    // If it's a parsing error with DecimalLiteral or similar, return original code
    if (error instanceof Error && error.message.includes('DecimalLiteral')) {
      console.warn('Skipping formatting due to unsupported syntax');
      return code;
    }
    
    throw new Error(`Failed to format code: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function canFormatLanguage(language: SupportedFileTypes): boolean {
  return ['typescript', 'javascript', 'json', 'css', 'html', 'markdown'].includes(language);
}