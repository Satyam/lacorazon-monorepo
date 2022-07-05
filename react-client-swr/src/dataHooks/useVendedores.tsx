import { useMemo } from 'react';
import useSWR from 'swr';
import {
  apiListVendedores,
  apiRemoveVendedor,
  apiGetVendedor,
  apiCreateVendedor,
  apiUpdateVendedor,
  VENDEDORES_SERVICE,
} from '@lacorazon/post-client';

import { useQueryError } from 'providers/Query';

const makeKey = (op: string, id: ID = '*', options?: OptionsType) =>
  `/${VENDEDORES_SERVICE}/${op}/${id}/${
    options ? JSON.stringify(options) : ''
  }`;

export const useListVendedores = (options?: OptionsType) => {
  const { pushError } = useQueryError();

  const { data, mutate } = useSWR<Vendedor[]>(
    [VENDEDORES_SERVICE, options],
    (_, options) => apiListVendedores(options)
  );

  return useMemo(
    () => ({
      vendedores: data,
      deleteVendedor: (id: ID) =>
        apiRemoveVendedor(id)
          .catch((err) => pushError(err, makeKey('delete', id, options)))
          .finally(() => mutate()),
    }),
    [data, mutate]
  );
};

const initialData: Omit<Vendedor, 'id'> = {
  nombre: '',
  email: '',
};
export const useGetVendedor = (id: ID, options?: OptionsType) => {
  const { pushError } = useQueryError();

  const { data, mutate } = useSWR<Vendedor>(
    id ? [VENDEDORES_SERVICE, id, options] : null,
    (_, id, options) => apiGetVendedor(id, options),
    {
      fallbackData: initialData as Vendedor,
    }
  );

  return useMemo(
    () => ({
      vendedor: data,
      updateVendedor: (data: Vendedor) =>
        mutate(
          apiUpdateVendedor({ ...data, id }).catch((err) => {
            pushError(err, makeKey('delete', id, options));
            throw err;
          })
        ),
      createVendedor: (data: Vendedor) =>
        apiCreateVendedor({ ...initialData, ...data }).catch((err) => {
          pushError(err, makeKey('create', id, options));
          throw err;
        }),
      deleteVendedor: () =>
        apiRemoveVendedor(id).catch((err) => {
          pushError(err, makeKey('delete', id, options));
          throw err;
        }),
    }),
    [data, mutate]
  );
};
