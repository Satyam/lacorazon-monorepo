import { h, ComponentChildren, Fragment } from 'preact';
import { useErrorBoundary } from 'preact/hooks';
import { Alert } from 'react-bootstrap';

export const ErrorBoundary = ({
  children,
}: {
  children: ComponentChildren;
}) => {
  const [error, resetError] = useErrorBoundary((error) =>
    console.error(error.message)
  );

  // Display a nice error message
  if (error) {
    return (
      <Alert variant="danger" onClose={resetError} dismissible>
        <Alert.Heading>Unexpected error:</Alert.Heading>
        <p>{error.message}</p>
        <Alert.Link as="button" onClick={resetError}>
          Try again
        </Alert.Link>
      </Alert>
    );
  }
  return <>{children}</>;
};

export default ErrorBoundary;
