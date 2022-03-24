/* eslint-disable no-spaced-func */
import { FunctionComponent, h, createContext } from 'preact';

import { useState, useContext, useCallback, useMemo } from 'preact/hooks';

import { Loading, ConfirmDelete } from 'components/Modals';

type ModalsType = {
  openLoading: (message: string) => void;
  closeLoading: () => void;
  confirmDelete: (descr: string, fn: () => void) => void;
};

const notImplemented = () => {
  throw new Error('Popup Context not ready yet');
};

const initialValue = {
  openLoading: notImplemented,
  closeLoading: notImplemented,
  confirmDelete: notImplemented,
};

export const ModalsContext = createContext<ModalsType>(initialValue);

export const ModalsProvider: FunctionComponent = ({ children }) => {
  const [t, setLoading] = useState<string | undefined>(undefined);

  const [delParams, setDelParams] = useState<{
    descr?: string;
    fn?: () => void;
  }>({});

  const onCloseConfirmDelete = useCallback(
    (result: boolean) => {
      setDelParams({});
      if (result && delParams.fn) delParams.fn();
    },
    [setDelParams, delParams]
  );

  const openLoading = useCallback(
    (message: string) => setLoading(message),
    [setLoading]
  );

  const confirmDelete = useCallback(
    (descr: string, fn: () => void): void => setDelParams({ descr, fn }),
    [setDelParams]
  );

  const closeLoading = useCallback(() => setLoading(undefined), [setLoading]);

  const ctx = useMemo(
    () => ({ openLoading, closeLoading, confirmDelete }),
    [openLoading, closeLoading, confirmDelete]
  );

  return (
    <ModalsContext.Provider value={ctx}>
      <Loading isOpen={!!t}>{t}</Loading>
      <ConfirmDelete descr={delParams.descr} onClose={onCloseConfirmDelete} />
      {children}
    </ModalsContext.Provider>
  );
};

export function useModals() {
  return useContext(ModalsContext);
}
