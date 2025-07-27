'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as esbuild from 'esbuild-wasm';

interface CustomPreviewProps {
  code: string;
  filename: string;
  allFiles: Record<string, string>;
}

export default function CustomPreview({ code, filename, allFiles }: CustomPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Initialize esbuild
  useEffect(() => {
    let mounted = true;

    const initEsbuild = async () => {
      try {
        await esbuild.initialize({
          wasmURL: 'https://unpkg.com/esbuild-wasm@0.24.2/esbuild.wasm',
        });
        if (mounted) {
          setIsInitialized(true);
        }
      } catch (err) {
        console.error('Failed to initialize esbuild:', err);
        if (mounted) {
          setError('Failed to initialize bundler');
        }
      }
    };

    initEsbuild();

    return () => {
      mounted = false;
    };
  }, []);

  const transformCode = useCallback(async (files: Record<string, string>, entryFile: string) => {
    if (!isInitialized) return null;

    try {
      // Find the main entry point
      let entryPoint = entryFile;
      if (!files[entryPoint]) {
        // Try common entry points
        const possibleEntries = [
          'src/main.tsx',
          'src/index.tsx', 
          'src/App.tsx',
          'index.tsx',
          'App.tsx'
        ];
        
        for (const entry of possibleEntries) {
          if (files[entry]) {
            entryPoint = entry;
            break;
          }
        }
      }

      if (!files[entryPoint]) {
        throw new Error(`Entry point not found: ${entryPoint}`);
      }

      // Process all files to fix routing globally
      const processedFiles = { ...files };
      
      // Auto-fix BrowserRouter to HashRouter in all files
      for (const [filePath, content] of Object.entries(processedFiles)) {
        if (content.includes('BrowserRouter') || content.includes('react-router-dom')) {
          // Replace BrowserRouter imports
          let processedContent = content.replace(
            /import\s*{\s*([^}]*?)BrowserRouter([^}]*?)\s*}\s*from\s*['"]react-router-dom['"]/g,
            'import { $1HashRouter as BrowserRouter$2 } from "react-router-dom"'
          );
          
          // Also handle named imports
          processedContent = processedContent.replace(
            /import\s*{\s*([^}]*?),\s*BrowserRouter\s*([^}]*?)\s*}\s*from\s*['"]react-router-dom['"]/g,
            'import { $1, HashRouter as BrowserRouter$2 } from "react-router-dom"'
          );
          
          // Handle standalone BrowserRouter imports
          processedContent = processedContent.replace(
            /import\s*{\s*BrowserRouter\s*}\s*from\s*['"]react-router-dom['"]/g,
            'import { HashRouter as BrowserRouter } from "react-router-dom"'
          );
          
          processedFiles[filePath] = processedContent;
        }
      }
      
      let mainContent = processedFiles[entryPoint];

      // Create module resolver
      const resolvePlugin: esbuild.Plugin = {
        name: 'resolve',
        setup(build) {
          // Handle React and other external modules
          build.onResolve({ filter: /^(react|react-dom|react-router-dom)$/ }, args => {
            return {
              path: args.path,
              namespace: 'external'
            };
          });

          // Handle local file imports
          build.onResolve({ filter: /^\./ }, args => {
            let resolvedPath = args.path;
            if (resolvedPath.startsWith('./')) {
              resolvedPath = resolvedPath.substring(2);
            }
            
            // Try different extensions
            const extensions = ['', '.tsx', '.ts', '.jsx', '.js'];
            for (const ext of extensions) {
              const fullPath = resolvedPath + ext;
              if (files[fullPath] || files[`src/${fullPath}`]) {
                return {
                  path: files[fullPath] ? fullPath : `src/${fullPath}`,
                  namespace: 'file'
                };
              }
            }
            
            return { path: resolvedPath, namespace: 'file' };
          });

          // Handle absolute imports (like @/ aliases)
          build.onResolve({ filter: /^@\// }, args => {
            const path = args.path.replace('@/', 'src/');
            return { path, namespace: 'file' };
          });
        }
      };

      const loadPlugin: esbuild.Plugin = {
        name: 'load',
        setup(build) {
          // Load external modules from CDN
          build.onLoad({ filter: /.*/, namespace: 'external' }, args => {
            const moduleMap: Record<string, string> = {
              'react': 'https://esm.sh/react@18',
              'react-dom': 'https://esm.sh/react-dom@18',
              'react-router-dom': 'https://esm.sh/react-router-dom@6'
            };

            return {
              contents: `export * from "${moduleMap[args.path] || `https://esm.sh/${args.path}`}";`,
              loader: 'js'
            };
          });

          // Load local files
          build.onLoad({ filter: /.*/, namespace: 'file' }, args => {
            const content = processedFiles[args.path] || '';
            const loader = args.path.endsWith('.tsx') || args.path.endsWith('.ts') ? 'tsx' : 'jsx';
            
            return {
              contents: content,
              loader
            };
          });
        }
      };

      // Bundle the code
      const result = await esbuild.build({
        entryPoints: [entryPoint],
        bundle: true,
        write: false,
        format: 'esm',
        target: 'es2020',
        jsx: 'automatic',
        plugins: [resolvePlugin, loadPlugin],
        define: {
          'process.env.NODE_ENV': '"development"'
        }
      });

      if (result.outputFiles && result.outputFiles.length > 0) {
        return result.outputFiles[0].text;
      }

      throw new Error('No output generated');
    } catch (err) {
      console.error('Transform error:', err);
      throw err;
    }
  }, [isInitialized]);

  const updatePreview = useCallback(async () => {
    if (!iframeRef.current || !isInitialized) return;

    try {
      setError(null);
      setDebugInfo('Bundling code...');
      
      const bundledCode = await transformCode(allFiles, filename);
      
      if (!bundledCode) {
        setDebugInfo('No bundled code generated');
        return;
      }

      setDebugInfo('Bundle successful, rendering...');

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Preview</title>
          <style>
            body { margin: 0; padding: 20px; font-family: system-ui, sans-serif; }
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <div id="debug" style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 4px; font-size: 12px; z-index: 9999;">
            Routing: HashRouter enabled
          </div>
          <script type="module">
            window.addEventListener('error', (e) => {
              const debug = document.getElementById('debug');
              if (debug) debug.innerHTML = 'Error: ' + e.message;
            });
            
            ${bundledCode}
          </script>
        </body>
        </html>
      `;

      const iframe = iframeRef.current;
      iframe.srcdoc = htmlContent;
      setDebugInfo('Preview loaded successfully');
    } catch (err) {
      console.error('Preview update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update preview');
      setDebugInfo('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  }, [allFiles, filename, transformCode, isInitialized]);

  // Update preview when code changes
  useEffect(() => {
    if (isInitialized) {
      const timer = setTimeout(updatePreview, 500);
      return () => clearTimeout(timer);
    }
  }, [code, allFiles, updatePreview, isInitialized]);

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-red-50 border border-red-200">
        <div className="text-center p-6">
          <div className="text-4xl mb-4">
            <svg className="w-10 h-10 mx-auto text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">Preview Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              updatePreview();
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-surface">
        <div className="text-center text-muted">
          <div className="text-4xl mb-2">
            <svg className="w-10 h-10 mx-auto text-muted animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p>Initializing bundler...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {debugInfo && (
        <div className="bg-primary/10 border border-primary text-primary p-2 text-xs">
          Debug: {debugInfo}
        </div>
      )}
      <iframe
        ref={iframeRef}
        className="w-full h-full border-none"
        title="Custom Preview"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
    </div>
  );
}