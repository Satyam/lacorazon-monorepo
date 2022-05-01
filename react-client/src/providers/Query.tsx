import { createContext, useState, useContext, useCallback } from 'react';
import { QueryClientProvider, QueryClient, QueryCache } from 'react-query';

export type QueryError = {
  where: string;
  message: string;
  queryKey: string | readonly unknown[];
};

type QueryErrorsContextType = {
  errors: QueryError[];
  clearErrors: () => void;
};

const notImplemented = () => {
  throw new Error('Internationalization Context not ready yet');
};

const initialValues: QueryErrorsContextType = {
  errors: [],
  clearErrors: notImplemented,
};

export const QueryContext =
  createContext<QueryErrorsContextType>(initialValues);

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [errors, setErrors] = useState<QueryError[]>([]);

  const clearErrors = useCallback(() => setErrors([]), [errors]);

  return (
    <QueryContext.Provider
      value={{
        errors,
        clearErrors,
      }}
    >
      <QueryClientProvider
        client={
          new QueryClient({
            queryCache: new QueryCache({
              onError: (error, query) => {
                setErrors(
                  errors.concat({
                    where: String(query.meta?.message),
                    message: String(error),
                    queryKey: query.queryKey,
                  })
                );
              },
            }),
          })
        }
      >
        {children}
      </QueryClientProvider>
    </QueryContext.Provider>
  );
};

export const useQueryError = () => useContext(QueryContext);
