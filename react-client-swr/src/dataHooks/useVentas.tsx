import useSWR from 'swr';
import {
  apiListVentas,
  apiRemoveVenta,
  apiGetVenta,
  apiCreateVenta,
  apiUpdateVenta,
  VENTAS_SERVICE,
} from '@lacorazon/post-client';

export const useListVentas = (options?: OptionsType) => {
  console.log('useListVentas');
  const swrRet = useSWR<VentaYVendedor[]>(
    [VENTAS_SERVICE, options],
    (_, options) => apiListVentas(options)
  );
  const deleteVenta = (id: ID) =>
    apiRemoveVenta(id).then(() => swrRet.mutate());
  return {
    ...swrRet,
    deleteVenta,
  };
};

export const useGetVenta = (id: ID, options?: OptionsType) => {
  console.log('useGetVenta');
  const swrRet = useSWR<VentaYVendedor>(
    id ? [VENTAS_SERVICE, id, options] : null,
    (_, id, options) => apiGetVenta(id, options)
  );
  const updateVenta = (data: Venta) =>
    swrRet.mutate(apiUpdateVenta({ ...data, id }));

  const deleteVenta = () => apiRemoveVenta(id);
  const createVenta = (data: Venta) => apiCreateVenta(data);
  return {
    ...swrRet,
    updateVenta,
    createVenta,
    deleteVenta,
  };
};
