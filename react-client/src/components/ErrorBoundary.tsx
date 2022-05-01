import { Component, ErrorInfo, ReactNode } from 'react';
import { Alert } from 'react-bootstrap';

interface Props {
  children: ReactNode;
}

interface State {
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public override state: State = {};

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({});
  };

  override render() {
    if (this.state.error) {
      return (
        <Alert variant="danger" onClose={this.resetError} dismissible>
          <Alert.Heading>Unexpected error:</Alert.Heading>
          <p>{this.state.error.message}</p>
          <Alert.Link as="button" onClick={this.resetError}>
            Try again
          </Alert.Link>
        </Alert>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
