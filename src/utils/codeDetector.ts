export interface CodeAnalysis {
  language: string;
  framework?: string;
  projectType: 'single-file' | 'component' | 'full-app' | 'library';
  confidence: number;
  suggestedTemplate?: string;
  features: string[];
  description: string;
}

export interface DetectionPattern {
  name: string;
  patterns: RegExp[];
  imports?: RegExp[];
  keywords?: RegExp[];
  fileExtensions?: string[];
  confidence: number;
}

// Language detection patterns
const LANGUAGE_PATTERNS: Record<string, DetectionPattern> = {
  'typescript-react': {
    name: 'TypeScript React',
    patterns: [
      /interface\s+\w+.*\{/,
      /type\s+\w+\s*=/,
      /React\.FC/,
      /React\.Component/,
      /<\w+.*>/,
      /export\s+default\s+function/,
      /const\s+\w+:\s*React\./
    ],
    imports: [
      /import.*from\s+['"]react['"]/,
      /import.*React.*from/,
      /import\s+\{.*\}\s+from\s+['"]react['"]/
    ],
    keywords: [
      /useState/,
      /useEffect/,
      /useContext/,
      /props:\s*\w+/,
      /JSX\.Element/
    ],
    fileExtensions: ['.tsx'],
    confidence: 0.9
  },
  
  'javascript-react': {
    name: 'JavaScript React',
    patterns: [
      /React\.createElement/,
      /class\s+\w+\s+extends\s+React\.Component/,
      /function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*return\s*\(/,
      /<\w+.*>/,
      /export\s+default\s+function/
    ],
    imports: [
      /import.*from\s+['"]react['"]/,
      /import.*React.*from/,
      /const\s+React\s*=\s*require/
    ],
    keywords: [
      /useState/,
      /useEffect/,
      /useState/,
      /props\./
    ],
    fileExtensions: ['.jsx'],
    confidence: 0.8
  },

  'typescript': {
    name: 'TypeScript',
    patterns: [
      /interface\s+\w+/,
      /type\s+\w+\s*=/,
      /enum\s+\w+/,
      /:\s*(string|number|boolean|object)\s*[;,=]/,
      /as\s+\w+/,
      /public\s+|private\s+|protected\s+/
    ],
    keywords: [
      /declare/,
      /namespace/,
      /module/,
      /implements/
    ],
    fileExtensions: ['.ts'],
    confidence: 0.8
  },

  'javascript': {
    name: 'JavaScript',
    patterns: [
      /function\s+\w+/,
      /const\s+\w+\s*=/,
      /let\s+\w+\s*=/,
      /var\s+\w+\s*=/,
      /=>\s*\{/,
      /console\.log/
    ],
    keywords: [
      /async\/await/,
      /Promise/,
      /callback/
    ],
    fileExtensions: ['.js'],
    confidence: 0.7
  },

  'html': {
    name: 'HTML',
    patterns: [
      /<!DOCTYPE\s+html>/i,
      /<html[\s>]/i,
      /<head[\s>]/i,
      /<body[\s>]/i,
      /<div[\s>]/i,
      /<p[\s>]/i,
      /<script[\s>]/i
    ],
    keywords: [
      /<meta\s+/,
      /<link\s+/,
      /<title>/
    ],
    fileExtensions: ['.html', '.htm'],
    confidence: 0.9
  },

  'css': {
    name: 'CSS',
    patterns: [
      /\.[a-zA-Z-_]+\s*\{/,
      /#[a-zA-Z-_]+\s*\{/,
      /[a-zA-Z-_]+\s*:\s*[^;]+;/,
      /@media\s+/,
      /@import\s+/,
      /rgba?\(/
    ],
    keywords: [
      /display\s*:/,
      /background\s*:/,
      /color\s*:/,
      /margin\s*:/,
      /padding\s*:/
    ],
    fileExtensions: ['.css'],
    confidence: 0.9
  }
};

// Framework detection patterns
const FRAMEWORK_PATTERNS: Record<string, DetectionPattern> = {
  'next.js': {
    name: 'Next.js',
    patterns: [
      /import.*from\s+['"]next\//,
      /getServerSideProps/,
      /getStaticProps/,
      /getStaticPaths/,
      /next\/head/,
      /next\/image/,
      /next\/router/
    ],
    imports: [
      /import.*from\s+['"]next\/.*['"]/
    ],
    confidence: 0.95
  },

  'vue': {
    name: 'Vue.js',
    patterns: [
      /<template>/,
      /<script>/,
      /<style>/,
      /Vue\.component/,
      /new Vue\(/,
      /export\s+default\s*\{/
    ],
    imports: [
      /import.*from\s+['"]vue['"]/
    ],
    keywords: [
      /data\(\)/,
      /computed:/,
      /methods:/,
      /mounted:/
    ],
    confidence: 0.9
  },

  'angular': {
    name: 'Angular',
    patterns: [
      /@Component/,
      /@Injectable/,
      /@NgModule/,
      /import.*from\s+['"]@angular\//
    ],
    imports: [
      /import.*from\s+['"]@angular\/.*['"]/
    ],
    confidence: 0.95
  },

  'tailwind': {
    name: 'Tailwind CSS',
    patterns: [
      /class(Name)?=["'][^"']*\b(bg-|text-|flex|grid|p-|m-|w-|h-)/,
      /@apply\s+/,
      /@tailwind\s+/
    ],
    confidence: 0.8
  },

  'styled-components': {
    name: 'Styled Components',
    patterns: [
      /styled\./,
      /styled\(/,
      /css`/,
      /styled\.div/,
      /styled\.button/
    ],
    imports: [
      /import.*styled.*from\s+['"]styled-components['"]/
    ],
    confidence: 0.9
  }
};

// Project type detection
export function detectProjectType(code: string, filename?: string): 'single-file' | 'component' | 'full-app' | 'library' {
  const hasMultipleComponents = (code.match(/export\s+(default\s+)?(function|class|const)/g) || []).length > 1;
  const hasAppStructure = /App\.tsx?|index\.html|package\.json/.test(filename || '');
  const hasLibraryExports = /export\s*\{[\s\S]*\}/.test(code);
  const hasDefaultExport = /export\s+default/.test(code);
  const hasComponentStructure = /<\w+/.test(code) && hasDefaultExport;

  if (hasAppStructure) return 'full-app';
  if (hasLibraryExports && hasMultipleComponents) return 'library';
  if (hasComponentStructure) return 'component';
  return 'single-file';
}

// Main analysis function
export function analyzeCode(code: string, filename?: string): CodeAnalysis {
  const features: string[] = [];
  let bestLanguageMatch = { name: 'javascript', confidence: 0.1 };
  let bestFrameworkMatch: { name: string; confidence: number } | null = null;

  // Detect language
  for (const [key, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
    let confidence = 0;
    let matches = 0;

    // Check file extension first
    if (filename && pattern.fileExtensions) {
      const ext = '.' + filename.split('.').pop()?.toLowerCase();
      if (pattern.fileExtensions.includes(ext)) {
        confidence += 0.3;
      }
    }

    // Check main patterns
    pattern.patterns.forEach(regex => {
      if (regex.test(code)) {
        matches++;
        confidence += 0.2;
      }
    });

    // Check imports
    if (pattern.imports) {
      pattern.imports.forEach(regex => {
        if (regex.test(code)) {
          confidence += 0.3;
          features.push(`${pattern.name} imports`);
        }
      });
    }

    // Check keywords
    if (pattern.keywords) {
      pattern.keywords.forEach(regex => {
        if (regex.test(code)) {
          confidence += 0.1;
        }
      });
    }

    // Apply base confidence
    confidence *= pattern.confidence;

    if (confidence > bestLanguageMatch.confidence) {
      bestLanguageMatch = { name: key, confidence };
    }
  }

  // Detect framework
  for (const [key, pattern] of Object.entries(FRAMEWORK_PATTERNS)) {
    let confidence = 0;
    
    pattern.patterns.forEach(regex => {
      if (regex.test(code)) {
        confidence += 0.3;
      }
    });

    if (pattern.imports) {
      pattern.imports.forEach(regex => {
        if (regex.test(code)) {
          confidence += 0.4;
        }
      });
    }

    if (pattern.keywords) {
      pattern.keywords.forEach(regex => {
        if (regex.test(code)) {
          confidence += 0.1;
        }
      });
    }

    confidence *= pattern.confidence;

    if (confidence > 0.3 && (!bestFrameworkMatch || confidence > bestFrameworkMatch.confidence)) {
      bestFrameworkMatch = { name: key, confidence };
      features.push(pattern.name);
    }
  }

  // Detect additional features
  const additionalFeatures = [
    { pattern: /useState|useEffect|useContext/, name: 'React Hooks' },
    { pattern: /async\/await/, name: 'Async/Await' },
    { pattern: /Promise/, name: 'Promises' },
    { pattern: /fetch\(/, name: 'Fetch API' },
    { pattern: /localStorage|sessionStorage/, name: 'Web Storage' },
    { pattern: /addEventListener/, name: 'Event Listeners' },
    { pattern: /querySelector|getElementById/, name: 'DOM Manipulation' },
    { pattern: /import.*\.css/, name: 'CSS Imports' },
    { pattern: /\.map\(|\.filter\(|\.reduce\(/, name: 'Array Methods' },
    { pattern: /interface\s+\w+|type\s+\w+\s*=/, name: 'TypeScript Types' }
  ];

  additionalFeatures.forEach(({ pattern, name }) => {
    if (pattern.test(code)) {
      features.push(name);
    }
  });

  const projectType = detectProjectType(code, filename);
  const finalConfidence = Math.min(bestLanguageMatch.confidence + (bestFrameworkMatch?.confidence || 0), 1.0);

  // Generate description
  let description = `Detected ${LANGUAGE_PATTERNS[bestLanguageMatch.name]?.name || bestLanguageMatch.name}`;
  if (bestFrameworkMatch) {
    description += ` with ${bestFrameworkMatch.name}`;
  }
  description += ` (${projectType.replace('-', ' ')})`;

  // Suggest template based on detection
  const suggestedTemplate = getSuggestedTemplate(bestLanguageMatch.name, bestFrameworkMatch?.name, projectType);

  return {
    language: bestLanguageMatch.name,
    framework: bestFrameworkMatch?.name,
    projectType,
    confidence: finalConfidence,
    suggestedTemplate,
    features,
    description
  };
}

// Template suggestion logic
function getSuggestedTemplate(language: string, framework?: string, projectType?: string): string {
  // React templates
  if (language === 'typescript-react') {
    if (framework === 'next.js') return 'nextjs-typescript';
    if (framework === 'tailwind') return 'react-typescript-tailwind';
    return 'react-typescript-component';
  }
  
  if (language === 'javascript-react') {
    if (framework === 'next.js') return 'nextjs-javascript';
    return 'react-javascript-component';
  }

  // Vue templates
  if (framework === 'vue') {
    return projectType === 'component' ? 'vue-component' : 'vue-app';
  }

  // Angular templates
  if (framework === 'angular') {
    return projectType === 'component' ? 'angular-component' : 'angular-app';
  }

  // Basic templates
  if (language === 'typescript') return 'typescript-function';
  if (language === 'javascript') return 'javascript-function';
  if (language === 'html') return 'html-page';
  if (language === 'css') return 'css-stylesheet';

  // Default fallback
  return 'blank-javascript';
}

// Quick detection for file uploads
export function quickDetectLanguage(filename: string, content?: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  // File extension based detection
  const extensionMap: Record<string, string> = {
    'tsx': 'typescript-react',
    'jsx': 'javascript-react', 
    'ts': 'typescript',
    'js': 'javascript',
    'html': 'html',
    'htm': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'vue': 'vue',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'cs': 'csharp',
    'php': 'php',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'swift': 'swift'
  };

  if (ext && extensionMap[ext]) {
    return extensionMap[ext];
  }

  // If we have content, do a quick analysis
  if (content) {
    const analysis = analyzeCode(content, filename);
    return analysis.language;
  }

  return 'javascript'; // Default fallback
}