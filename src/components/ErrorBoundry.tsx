import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  error: boolean;
  ErrorComponent: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ hasError: true });
    console.error(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError || this.props.error)
      return this.props.ErrorComponent;
    return this.props.children;
  }
}
export default ErrorBoundary;
