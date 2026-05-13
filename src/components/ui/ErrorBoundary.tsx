'use client';

import React, { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';
import Card from './Card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="p-6 border-2 border-danger/30 bg-danger/5">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-danger flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-danger mb-2">Something went wrong</h3>
              <p className="text-sm text-text-muted mb-4">
                {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
              </p>
              <Button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                variant="outline"
                className="text-danger"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}
