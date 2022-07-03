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
  console.log('useListVendedores');

  const { pushError } = useQueryError();

  const swrRet = useSWR<Vendedor[]>(
    [VENDEDORES_SERVICE, options],
    (_, options) => apiListVendedores(options)
  );

  const deleteVendedor = (id: ID) =>
    apiRemoveVendedor(id)
      .catch((err) => pushError(err, makeKey('delete', id, options)))
      .finally(() => swrRet.mutate());

  return {
    ...swrRet,
    deleteVendedor,
  };
};

export const useGetVendedor = (id: ID, options?: OptionsType) => {
  console.log('useGetVendedor');

  const { pushError } = useQueryError();

  const swrRet = useSWR<Vendedor>(
    id ? [VENDEDORES_SERVICE, id, options] : null,
    (_, id, options) => apiGetVendedor(id, options)
  );

  const updateVendedor = (data: Vendedor) =>
    swrRet.mutate(
      apiUpdateVendedor({ ...data, id }).catch((err) => {
        pushError(err, makeKey('delete', id, options));
        throw err;
      })
    );

  const deleteVendedor = () =>
    apiRemoveVendedor(id).catch((err) => {
      pushError(err, makeKey('delete', id, options));
      throw err;
    });

  const createVendedor = (data: Vendedor) =>
    apiCreateVendedor(data).catch((err) => {
      pushError(err, makeKey('create', id, options));
      throw err;
    });

  return {
    ...swrRet,
    updateVendedor,
    createVendedor,
    deleteVendedor,
  };
};
