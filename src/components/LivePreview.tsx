'use client';

import { useEffect, useState } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import ErrorBoundary from './ErrorBoundary';
import ConsolePanel from './ConsolePanel';
import CustomPreview from './CustomPreview';
import { useConsoleCapture } from '@/hooks/useConsoleCapture';
import { useTheme } from '@/contexts/ThemeContext';

interface LivePreviewProps {
  code: string;
  filename: string;
  allFiles?: Record<string, string>;
}

export default function LivePreview({ code, filename, allFiles }: LivePreviewProps) {
  const { messages, clearMessages, handleSandpackMessage } = useConsoleCapture();
  const { currentTheme } = useTheme();
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Determine Sandpack theme based on app theme
  const sandpackTheme = currentTheme === 'clean-light' ? 'light' : 'dark';

  // Listen for console messages from Sandpack
  useEffect(() => {
    window.addEventListener('message', handleSandpackMessage);
    return () => window.removeEventListener('message', handleSandpackMessage);
  }, [handleSandpackMessage]);
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || 'tsx';
  };

  const isTypeScriptFile = (filename: string) => {
    const ext = getFileExtension(filename);
    return ext === 'tsx' || ext === 'ts';
  };

  const isReactFile = (filename: string) => {
    const ext = getFileExtension(filename);
    // Allow TSX/JSX for React components, and TS files that contain React code
    if (ext === 'tsx' || ext === 'jsx') {
      return true;
    }
    // For .ts files, check if they contain React-like code
    if (ext === 'ts') {
      return code.includes('React') || code.includes('JSX') || code.includes('<') || code.includes('export default function');
    }
    return false;
  };

  const isHtmlFile = (filename: string) => {
    const ext = getFileExtension(filename);
    return ext === 'html' || ext === 'htm';
  };

  // Prepare files for Sandpack - support multi-file projects with path resolution
  const files = allFiles && Object.keys(allFiles).length > 1 
    ? Object.entries(allFiles).reduce((acc, [path, content]) => {
        // Convert path aliases (@/) to relative paths for Sandpack
        let processedContent = content;
        if (content.includes('@/')) {
          // Replace @/components/ with /src/components/
          processedContent = content.replace(/@\/components\//g, '/src/components/');
          // Replace @/hooks/ with /src/hooks/
          processedContent = processedContent.replace(/@\/hooks\//g, '/src/hooks/');
          // Replace @/lib/ with /src/lib/
          processedContent = processedContent.replace(/@\/lib\//g, '/src/lib/');
          // Replace @/utils/ with /src/utils/
          processedContent = processedContent.replace(/@\/utils\//g, '/src/utils/');
          // Replace @/types/ with /src/types/
          processedContent = processedContent.replace(/@\/types\//g, '/src/types/');
        }
        
        // Fix HTML comments to JSX comments
        if (processedContent.includes('<!--')) {
          processedContent = processedContent.replace(/<!--\s*(.*?)\s*-->/g, '{/* $1 */}');
        }
        
        // Fix CSS in style tags
        if (processedContent.includes('<style>')) {
          processedContent = processedContent.replace(
            /(<style>\s*)([\s\S]*?)(\s*<\/style>)/g,
            (match, openTag, cssContent, closeTag) => {
              return `${openTag}{\`${cssContent}\`}${closeTag}`;
            }
          );
        }
        
        // Fix common Cloud Desktop export issues
        if (processedContent.includes('export default function') && !processedContent.includes('import React')) {
          processedContent = `import React from 'react';\n\n${processedContent}`;
        }
        
        // Fix HTML-style inline styles to JSX style objects
        if (processedContent.includes('style="')) {
          processedContent = processedContent.replace(/style="([^"]+)"/g, (match, styleString) => {
            // Convert CSS string to JSX style object
            const styleObj = styleString
              .split(';')
              .filter(prop => prop.trim())
              .map(prop => {
                const [key, value] = prop.split(':').map(s => s.trim());
                if (!key || !value) return '';
                // Convert kebab-case to camelCase
                const camelKey = key.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
                return `${camelKey}: '${value}'`;
              })
              .filter(prop => prop)
              .join(', ');
            
            return `style={{${styleObj}}}`;
          });
        }
        
        // Fix missing component wrapper for raw SVG
        if (processedContent.includes('<svg') && !processedContent.includes('export default function') && !processedContent.includes('function ')) {
          processedContent = `import React from 'react';

export default function Component() {
  return (
    ${processedContent}
  );
}`;
        }
        
        // Fix routing: Convert BrowserRouter to HashRouter for compatibility
        if (processedContent.includes('BrowserRouter') || processedContent.includes('react-router-dom')) {
          // Replace BrowserRouter imports with HashRouter
          processedContent = processedContent.replace(
            /import\s*{\s*([^}]*?)BrowserRouter([^}]*?)\s*}\s*from\s*['"]react-router-dom['"]/g,
            'import { $1HashRouter$2 } from "react-router-dom"'
          );
          
          // Handle different import patterns
          processedContent = processedContent.replace(
            /import\s*{\s*BrowserRouter\s*}\s*from\s*['"]react-router-dom['"]/g,
            'import { HashRouter } from "react-router-dom"'
          );
          
          processedContent = processedContent.replace(
            /import\s*{\s*([^}]*?),\s*BrowserRouter\s*([^}]*?)\s*}\s*from\s*['"]react-router-dom['"]/g,
            'import { $1, HashRouter$2 } from "react-router-dom"'
          );
          
          // Replace JSX usage of BrowserRouter with HashRouter
          processedContent = processedContent.replace(
            /<BrowserRouter(\s[^>]*)?>/g,
            '<HashRouter$1>'
          );
          
          processedContent = processedContent.replace(
            /<\/BrowserRouter>/g,
            '</HashRouter>'
          );
        }
        
        // Use the original path structure
        const sandpackPath = path.startsWith('/') ? path : `/${path}`;
        acc[sandpackPath] = {
          code: processedContent,
          active: path === filename,
        };
        return acc;
      }, {} as Record<string, { code: string; active?: boolean }>)
    : {
        '/App.tsx': {
          code: code,
          active: true,
        },
      };

  // Fix CSS-in-JSX and HTML comment issues from Cloud Desktop for single files too
  if (files['/App.tsx']) {
    let code = files['/App.tsx'].code;
    
    // Fix CSS in style tags
    if (code.includes('<style>')) {
      code = code.replace(
        /(<style>\s*)([\s\S]*?)(\s*<\/style>)/g,
        (match, openTag, cssContent, closeTag) => {
          return `${openTag}{\`${cssContent}\`}${closeTag}`;
        }
      );
    }
    
    // Fix HTML comments to JSX comments
    if (code.includes('<!--')) {
      code = code.replace(/<!--\s*(.*?)\s*-->/g, '{/* $1 */}');
    }
    
    // Fix common Cloud Desktop export issues
    if (code.includes('export default function') && !code.includes('import React')) {
      code = `import React from 'react';\n\n${code}`;
    }
    
    // Fix HTML-style inline styles to JSX style objects
    if (code.includes('style="')) {
      code = code.replace(/style="([^"]+)"/g, (match, styleString) => {
        // Convert CSS string to JSX style object
        const styleObj = styleString
          .split(';')
          .filter(prop => prop.trim())
          .map(prop => {
            const [key, value] = prop.split(':').map(s => s.trim());
            if (!key || !value) return '';
            // Convert kebab-case to camelCase
            const camelKey = key.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
            return `${camelKey}: '${value}'`;
          })
          .filter(prop => prop)
          .join(', ');
        
        return `style={{${styleObj}}}`;
      });
    }
    
    // Fix missing component wrapper for raw SVG
    if (code.includes('<svg') && !code.includes('export default function') && !code.includes('function ')) {
      code = `import React from 'react';

export default function Component() {
  return (
    ${code}
  );
}`;
    }
    
    files['/App.tsx'].code = code;
  }

  // Detect additional dependencies from import statements
  const detectDependencies = (allFileContents: Record<string, string>) => {
    const baseDeps = {
      react: '^18.0.0',
      'react-dom': '^18.0.0',
      '@types/react': '^18.0.0',
      '@types/react-dom': '^18.0.0'
    };
    
    const detectedDeps: Record<string, string> = { ...baseDeps };
    
    // Common dependency patterns
    const depPatterns: Record<string, string> = {
      'react-youtube': '^10.1.0',
      'lucide-react': '^0.263.1', 
      'react-router-dom': '^6.8.0',
      'clsx': '^2.0.0',
      'tailwindcss': '^3.3.0',
      'framer-motion': '^10.16.0',
      'recharts': '^2.8.0',
      'react-hook-form': '^7.47.0',
      'zod': '^3.22.4',
      'date-fns': '^2.30.0',
      '@radix-ui/react-dialog': '^1.0.5',
      '@radix-ui/react-dropdown-menu': '^2.0.6',
      '@radix-ui/react-toast': '^1.1.5',
      'sonner': '^1.4.0',
      'react-resizable-panels': '^0.0.55',
      'next-themes': '^0.2.1'
    };
    
    // Scan all files for import statements
    Object.values(allFileContents).forEach(content => {
      Object.keys(depPatterns).forEach(pkg => {
        const patterns = [
          new RegExp(`import.*from\\s+['"]${pkg}['"]`, 'g'),
          new RegExp(`import\\s+['"]${pkg}['"]`, 'g'),
          new RegExp(`require\\(['"]${pkg}['"]\\)`, 'g')
        ];
        
        if (patterns.some(pattern => pattern.test(content))) {
          detectedDeps[pkg] = depPatterns[pkg];
        }
      });
    });
    
    return detectedDeps;
  };

  const allFileContents = allFiles && Object.keys(allFiles).length > 1 ? allFiles : { [filename]: code };
  const dependencies = detectDependencies(allFileContents);

  // Add package.json with dynamically detected dependencies
  files['/package.json'] = {
    code: JSON.stringify({
      dependencies
    }, null, 2)
  };

  // Add error logging wrapper to the main entry file
  if (files['/src/main.tsx']) {
    files['/src/main.tsx'].code = `
// Error logging wrapper
window.addEventListener('error', (e) => {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'position:fixed;top:10px;left:10px;background:red;color:white;padding:10px;z-index:9999;font-size:12px;max-width:300px;';
  errorDiv.innerText = 'Error: ' + e.message + ' in ' + e.filename + ':' + e.lineno;
  document.body.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 5000);
});

window.addEventListener('unhandledrejection', (e) => {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'position:fixed;top:60px;left:10px;background:orange;color:white;padding:10px;z-index:9999;font-size:12px;max-width:300px;';
  errorDiv.innerText = 'Promise Error: ' + e.reason;
  document.body.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 5000);
});

` + files['/src/main.tsx'].code;
  }

  const template = (isTypeScriptFile(filename) || getFileExtension(filename) === 'ts') ? 'react-ts' : 'react';
  
  // Debug: log actual code being rendered
  console.log('Actual code being rendered:', code);

  // Check if this is an HTML file or project has multiple HTML files
  const hasMultipleHtmlFiles = Object.keys(allFiles || {}).filter(path => 
    path.endsWith('.html') || path.endsWith('.htm')
  ).length > 1;

  if (isHtmlFile(filename) || hasMultipleHtmlFiles) {
    // For multi-page HTML projects, create a mini server-like experience
    const createMultiPageHtml = () => {
      const htmlFiles = Object.keys(allFiles || {}).filter(path => 
        path.endsWith('.html') || path.endsWith('.htm')
      );
      
      let mainHtml = code;
      
      // If this is a multi-page project, inject navigation handling
      if (hasMultipleHtmlFiles) {
        const navigationScript = `
          <script>
            // Multi-page navigation handler
            window.addEventListener('click', function(e) {
              const link = e.target.closest('a, [onclick], button, .card, [data-href], div, span');
              if (link) {
                let href = link.getAttribute('href') || 
                           link.getAttribute('data-href') || 
                           link.getAttribute('onclick') ||
                           link.textContent;
                
                if (href && (href.includes('dashboard') || href.includes('.html'))) {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  // Look for dashboard.html file
                  const files = ${JSON.stringify(allFiles)};
                  const dashboardPath = Object.keys(files).find(path => 
                    path.includes('dashboard.html') || path.endsWith('dashboard.html')
                  );
                  
                  if (dashboardPath && files[dashboardPath]) {
                    // Replace current page content
                    document.documentElement.innerHTML = files[dashboardPath];
                    
                    // Re-run this script for the new page
                    const newScript = document.createElement('script');
                    newScript.textContent = arguments.callee.toString() + '; (' + arguments.callee.toString() + ')();';
                    document.head.appendChild(newScript);
                  }
                }
              }
            });
          </script>
        `;
        
        // Inject the navigation script before closing body tag
        mainHtml = mainHtml.replace(
          /<\/body>/i, 
          navigationScript + '</body>'
        );
      }
      
      return mainHtml;
    };

    return (
      <div className="h-full w-full flex flex-col">
        {/* Preview Header */}
        <div className="h-8 bg-elevated border-b border-default flex items-center justify-between px-3">
          <span className="text-xs text-muted uppercase tracking-wide font-medium">Preview</span>
          <span className="text-xs text-secondary">{filename}</span>
        </div>
        
        <div className="flex-1 relative">
          <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left', width: `${10000 / zoomLevel}%`, height: `${10000 / zoomLevel}%` }}>
          <iframe
            srcDoc={createMultiPageHtml()}
            className="w-full h-full border-none"
            title="HTML Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
        
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex gap-1 z-10">
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 bg-elevated hover:bg-hover text-on-accent rounded flex items-center justify-center text-sm transition-colors"
            title="Zoom Out"
            disabled={zoomLevel <= 50}
          >
            −
          </button>
          <div className="bg-elevated text-on-accent rounded px-2 py-1 text-xs flex items-center min-w-[50px] justify-center">
            {zoomLevel}%
          </div>
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 bg-elevated hover:bg-hover text-on-accent rounded flex items-center justify-center text-sm transition-colors"
            title="Zoom In"
            disabled={zoomLevel >= 200}
          >
            +
          </button>
          <button
            onClick={handleZoomReset}
            className="w-8 h-8 bg-elevated hover:bg-hover text-on-accent rounded flex items-center justify-center text-xs transition-colors"
            title="Reset Zoom"
          >
            1:1
          </button>
        </div>
        </div>
      </div>
    );
  }

  // Check if this is a React file that can be previewed
  if (!isReactFile(filename)) {
    // Special message for .ts files that don't contain React code
    const ext = getFileExtension(filename);
    const isPlainTypeScript = ext === 'ts' && !code.includes('React') && !code.includes('<');
    
    return (
      <div className="h-full w-full flex flex-col">
        {/* Preview Header */}
        <div className="h-8 bg-elevated border-b border-default flex items-center justify-between px-3">
          <span className="text-xs text-muted uppercase tracking-wide font-medium">Preview</span>
          <span className="text-xs text-secondary">{filename}</span>
        </div>
        
        <div className="flex-1 flex items-center justify-center bg-surface">
          <div className="text-center text-muted">
            <div className="text-4xl mb-2">
              <svg className="w-10 h-10 mx-auto text-muted" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            </div>
            {isPlainTypeScript ? (
              <>
                <p>Plain TypeScript files (.ts) cannot be previewed.</p>
                <p className="text-sm mt-2">Try using a React TypeScript component (.tsx) instead.</p>
              </>
            ) : (
              <>
                <p>Live preview is available for React files (.tsx, .jsx) and HTML files (.html, .htm)</p>
                <p className="text-sm mt-2">Current file: {filename}</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!code.trim()) {
    return (
      <div className="h-full w-full flex flex-col">
        {/* Preview Header */}
        <div className="h-8 bg-elevated border-b border-default flex items-center justify-between px-3">
          <span className="text-xs text-muted uppercase tracking-wide font-medium">Preview</span>
          <span className="text-xs text-secondary">{filename}</span>
        </div>
        
        <div className="flex-1 flex items-center justify-center bg-surface">
          <div className="text-center text-muted">
            <div className="text-4xl mb-2">
              <svg className="w-10 h-10 mx-auto text-muted" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p>Upload a TSX, JSX, or TS file to see the live preview</p>
          </div>
        </div>
      </div>
    );
  }

  const openInCodeSandbox = () => {
    const sandboxConfig = {
      files: {
        [filename]: {
          content: code
        },
        'package.json': {
          content: JSON.stringify({
            dependencies: {
              react: '^18.0.0',
              'react-dom': '^18.0.0',
              'react-scripts': '5.0.0'
            }
          }, null, 2)
        }
      }
    };
    
    const parameters = btoa(JSON.stringify(sandboxConfig));
    window.open(`https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`, '_blank');
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleZoomReset = () => {
    setZoomLevel(100);
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Preview Header */}
      <div className="h-8 bg-elevated border-b border-default flex items-center justify-between px-3">
        <span className="text-xs text-muted uppercase tracking-wide font-medium">Preview</span>
        <span className="text-xs text-secondary">{filename}</span>
      </div>
      
      {/* Preview Area */}
      <div className="flex-1 relative">
        <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left', width: `${10000 / zoomLevel}%`, height: `${10000 / zoomLevel}%` }}>
          <ErrorBoundary>
            <Sandpack
              template={template}
              files={files}
              options={{
                showNavigator: false,
                showTabs: false,
                editorWidthPercentage: 0,
                autoReload: true,
                recompileMode: 'delayed',
                recompileDelay: 1000,
              }}
              theme={sandpackTheme}
            />
          </ErrorBoundary>
        </div>
        
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex gap-1 z-10">
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 bg-elevated hover:bg-hover text-on-accent rounded flex items-center justify-center text-sm transition-colors"
            title="Zoom Out"
            disabled={zoomLevel <= 50}
          >
            −
          </button>
          <div className="bg-elevated text-on-accent rounded px-2 py-1 text-xs flex items-center min-w-[50px] justify-center">
            {zoomLevel}%
          </div>
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 bg-elevated hover:bg-hover text-on-accent rounded flex items-center justify-center text-sm transition-colors"
            title="Zoom In"
            disabled={zoomLevel >= 200}
          >
            +
          </button>
          <button
            onClick={handleZoomReset}
            className="w-8 h-8 bg-elevated hover:bg-hover text-on-accent rounded flex items-center justify-center text-xs transition-colors"
            title="Reset Zoom"
          >
            1:1
          </button>
        </div>
        
        <button
          onClick={openInCodeSandbox}
          className="absolute bottom-4 right-4 w-8 h-8 bg-elevated hover:bg-hover text-on-accent rounded-full flex items-center justify-center text-sm font-bold transition-colors z-10"
          title="Open in CodeSandbox"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Console Panel */}
      <ConsolePanel 
        messages={messages} 
        onClear={clearMessages} 
      />
    </div>
  );
}