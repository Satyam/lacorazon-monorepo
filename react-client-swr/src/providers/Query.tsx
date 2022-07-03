import { createContext, useState, useContext, useCallback } from 'react';
import { SWRConfig, Key } from 'swr';

export type QueryError = {
  message: string;
  queryKey: Key;
};

type QueryErrorsContextType = {
  errors: QueryError[];
  clearErrors: () => void;
  pushError: (message: string, queryKey: Key) => void;
};

const notImplemented = () => {
  throw new Error('Internationalization Context not ready yet');
};

const initialValues: QueryErrorsContextType = {
  errors: [],
  clearErrors: notImplemented,
  pushError: notImplemented,
};

export const QueryContext =
  createContext<QueryErrorsContextType>(initialValues);

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [errors, setErrors] = useState<QueryError[]>([]);

  const clearErrors = useCallback(() => setErrors([]), [errors]);

  const pushError = (error: string | Error, queryKey: Key = '') =>
    setErrors(
      errors.concat({
        message: String(error),
        queryKey,
      })
    );

  return (
    <QueryContext.Provider
      value={{
        errors,
        clearErrors,
        pushError,
      }}
    >
      <SWRConfig
        value={{
          onError: pushError,
        }}
      >
        {children}
      </SWRConfig>
    </QueryContext.Provider>
  );
};

export const useQueryError = () => useContext(QueryContext);
