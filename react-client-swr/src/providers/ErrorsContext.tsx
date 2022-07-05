import { createContext, useState, useContext, useCallback } from 'react';

export type ErrorInstance = {
  error: Error;
  context: string;
};

type ErrorsContextType = {
  errors: ErrorInstance[];
  clearErrors: () => void;
  pushError: (error: Error, context: string) => void;
};

const notImplemented = () => {
  throw new Error('Error popup context not ready yet');
};

const initialValues: ErrorsContextType = {
  errors: [],
  clearErrors: notImplemented,
  pushError: notImplemented,
};

export const ErrorsContext = createContext<ErrorsContextType>(initialValues);

export const ErrorsProvider = ({ children }: { children: React.ReactNode }) => {
  const [errors, setErrors] = useState<ErrorInstance[]>([]);

  const clearErrors = useCallback(() => setErrors([]), [errors]);

  const pushError = (error: Error, context: string = 'Unexpected') =>
    setErrors(
      errors.concat({
        error,
        context,
      })
    );

  return (
    <ErrorsContext.Provider
      value={{
        errors,
        clearErrors,
        pushError,
      }}
    >
      {children}
    </ErrorsContext.Provider>
  );
};

export const useErrorsContext = () => useContext(ErrorsContext);
