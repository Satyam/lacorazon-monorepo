import useSWR from 'swr';
import {
  apiListVendedores,
  apiRemoveVendedor,
  apiGetVendedor,
  apiCreateVendedor,
  apiUpdateVendedor,
  VENDEDORES_SERVICE,
} from '@lacorazon/post-client';

export const useListVendedores = (options?: OptionsType) => {
  console.log('useListVendedores');
  const swrRet = useSWR<Vendedor[]>(
    [VENDEDORES_SERVICE, options],
    (_, options) => apiListVendedores(options)
  );
  const deleteVendedor = (id: ID) =>
    apiRemoveVendedor(id).then(() => swrRet.mutate());
  return {
    ...swrRet,
    deleteVendedor,
  };
};

export const useGetVendedor = (id: ID, options?: OptionsType) => {
  console.log('useGetVendedor');
  const swrRet = useSWR<Vendedor>(
    id ? [VENDEDORES_SERVICE, id, options] : null,
    (_, id, options) => apiGetVendedor(id, options)
  );
  const updateVendedor = (data: Vendedor) =>
    swrRet.mutate(apiUpdateVendedor({ ...data, id }));

  const deleteVendedor = () => apiRemoveVendedor(id);
  const createVendedor = (data: Vendedor) => apiCreateVendedor(data);
  return {
    ...swrRet,
    updateVendedor,
    createVendedor,
    deleteVendedor,
  };
};
