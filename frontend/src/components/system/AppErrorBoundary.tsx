import React, { Component, ReactNode } from 'react';
import AppErrorScreen from './AppErrorScreen';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AppErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <AppErrorScreen
          message="Application Error"
          details={this.state.error?.message || 'An unexpected error occurred'}
        />
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
