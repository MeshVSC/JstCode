'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full flex items-center justify-center bg-red-50 border border-red-200">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">
              <svg className="w-10 h-10 mx-auto text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Something went wrong
            </h2>
            <p className="text-red-600 mb-4">
              There was an error rendering your component.
            </p>
            <details className="text-left bg-red-100 p-3 rounded max-w-md overflow-auto">
              <summary className="cursor-pointer font-medium text-red-800">
                Error details
              </summary>
              <pre className="text-sm mt-2 text-red-700">
                {this.state.error?.message}
              </pre>
            </details>
            <button
              onClick={() => {
                const newRetryCount = this.state.retryCount + 1;
                if (newRetryCount < 3) {
                  // Add delay to prevent rapid cycling
                  setTimeout(() => {
                    this.setState({ hasError: false, error: undefined, retryCount: newRetryCount });
                  }, 2000);
                } else {
                  this.setState({ hasError: false, error: undefined, retryCount: 0 });
                }
              }}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
            >
              Try Again {this.state.retryCount > 0 && `(${this.state.retryCount}/3)`}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;