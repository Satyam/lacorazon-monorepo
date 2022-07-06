import { createContext, useState, useContext, useCallback } from 'react';

type ErrorTypes = Error | { data: string; error: number } | string;
export type ErrorInstance = {
  error: ErrorTypes;
  context: string;
};

type ErrorsContextType = {
  errors: ErrorInstance[];
  clearErrors: () => void;
  pushError: (error: ErrorTypes, context: string) => void;
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

  const pushError = (error: ErrorTypes, context: string = 'Unexpected') =>
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
