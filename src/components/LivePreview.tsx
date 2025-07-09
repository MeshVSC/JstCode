'use client';

import { useEffect } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import ErrorBoundary from './ErrorBoundary';
import ConsolePanel from './ConsolePanel';
import CustomPreview from './CustomPreview';
import { useConsoleCapture } from '@/hooks/useConsoleCapture';

interface LivePreviewProps {
  code: string;
  filename: string;
  allFiles?: Record<string, string>;
}

export default function LivePreview({ code, filename, allFiles }: LivePreviewProps) {
  const { messages, clearMessages, handleSandpackMessage } = useConsoleCapture();

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
    return ext === 'tsx' || ext === 'jsx';
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

  // Add package.json with common dependencies and error logging
  files['/package.json'] = {
    code: JSON.stringify({
      dependencies: {
        react: '^18.0.0',
        'react-dom': '^18.0.0',
        'lucide-react': '^0.263.1',
        'react-router-dom': '^6.8.0',
        '@types/react': '^18.0.0',
        '@types/react-dom': '^18.0.0',
        'clsx': '^2.0.0',
        'tailwindcss': '^3.3.0',
        'class-variance-authority': '^0.7.0',
        '@radix-ui/react-toast': '^1.1.5',
        '@radix-ui/react-dialog': '^1.0.5',
        '@radix-ui/react-dropdown-menu': '^2.0.6',
        '@radix-ui/react-navigation-menu': '^1.1.4',
        '@radix-ui/react-accordion': '^1.1.2',
        '@radix-ui/react-alert-dialog': '^1.0.5',
        '@radix-ui/react-aspect-ratio': '^1.0.3',
        '@radix-ui/react-avatar': '^1.0.4',
        '@radix-ui/react-checkbox': '^1.0.4',
        '@radix-ui/react-collapsible': '^1.0.3',
        '@radix-ui/react-context-menu': '^2.1.5',
        '@radix-ui/react-hover-card': '^1.0.7',
        '@radix-ui/react-label': '^2.0.2',
        '@radix-ui/react-menubar': '^1.0.4',
        '@radix-ui/react-popover': '^1.0.7',
        '@radix-ui/react-progress': '^1.0.3',
        '@radix-ui/react-radio-group': '^1.1.3',
        '@radix-ui/react-scroll-area': '^1.0.5',
        '@radix-ui/react-select': '^2.0.0',
        '@radix-ui/react-separator': '^1.0.3',
        '@radix-ui/react-slider': '^1.1.2',
        '@radix-ui/react-switch': '^1.0.3',
        '@radix-ui/react-tabs': '^1.0.4',
        '@radix-ui/react-toggle': '^1.0.3',
        '@radix-ui/react-toggle-group': '^1.0.4',
        '@radix-ui/react-tooltip': '^1.0.7',
        'sonner': '^1.4.0',
        'vaul': '^0.9.0',
        'cmdk': '^0.2.0',
        'react-day-picker': '^8.10.0',
        'date-fns': '^2.30.0',
        'recharts': '^2.8.0',
        'react-hook-form': '^7.47.0',
        '@hookform/resolvers': '^3.3.2',
        'zod': '^3.22.4',
        'embla-carousel-react': '^8.0.0',
        'react-resizable-panels': '^0.0.55',
        'input-otp': '^1.2.4',
        'next-themes': '^0.2.1',
        'framer-motion': '^10.16.0'
      }
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

  const template = isTypeScriptFile(filename) ? 'react-ts' : 'react';
  
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
      <div className="h-full w-full">
        <iframe
          srcDoc={createMultiPageHtml()}
          className="w-full h-full border-none"
          title="HTML Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    );
  }

  // Check if this is a React file that can be previewed
  if (!isReactFile(filename)) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">
            <svg className="w-10 h-10 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          </div>
          <p>Live preview is available for React files (.tsx, .jsx) and HTML files (.html, .htm)</p>
          <p className="text-sm mt-2">Current file: {filename}</p>
        </div>
      </div>
    );
  }

  if (!code.trim()) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">
            <svg className="w-10 h-10 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p>Upload a TSX file to see the live preview</p>
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

  return (
    <div className="h-full w-full flex flex-col">
      {/* Preview Area */}
      <div className="flex-1 relative">
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
            theme="dark"
          />
        </ErrorBoundary>
        
        <button
          onClick={openInCodeSandbox}
          className="absolute bottom-4 right-4 w-8 h-8 bg-[#3e3e42] hover:bg-[#4e4e52] text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors z-10"
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