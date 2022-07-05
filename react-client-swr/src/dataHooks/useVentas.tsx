import useSWR from 'swr';
import {
  apiListVentas,
  apiRemoveVenta,
  apiGetVenta,
  apiCreateVenta,
  apiUpdateVenta,
  VENTAS_SERVICE,
} from '@lacorazon/post-client';

import { useQueryError } from 'providers/Query';

const makeKey = (op: string, id: ID = '*', options?: OptionsType) =>
  `/${VENTAS_SERVICE}/${op}/${id}/${options ? JSON.stringify(options) : ''}`;

export const useListVentas = (options?: OptionsType) => {
  const { pushError } = useQueryError();

  const swrRet = useSWR<VentaYVendedor[]>(
    [VENTAS_SERVICE, options],
    (_, options) => apiListVentas(options)
  );
  const deleteVenta = (id: ID) =>
    apiRemoveVenta(id)
      .catch((err) => pushError(err, makeKey('delete', id, options)))
      .finally(() => swrRet.mutate());
  return {
    ...swrRet,
    deleteVenta,
  };
};

const initialData: Omit<VentaYVendedor, 'id'> = {
  fecha: new Date(),
  concepto: '',
  cantidad: 1,
  precioUnitario: 10,
  iva: false,
};
export const useGetVenta = (id: ID, options?: OptionsType) => {
  const { pushError } = useQueryError();

  const swrRet = useSWR<VentaYVendedor>(
    id ? [VENTAS_SERVICE, id, options] : null,
    (_, id, options) => apiGetVenta(id, options),
    {
      fallbackData: initialData as VentaYVendedor,
    }
  );

  const updateVenta = (data: Venta) =>
    swrRet.mutate(
      apiUpdateVenta({ ...data, id }).catch((err) => {
        pushError(err, makeKey('delete', id, options));
        throw err;
      })
    );

  const deleteVenta = () =>
    apiRemoveVenta(id).catch((err) => {
      pushError(err, makeKey('delete', id, options));
      throw err;
    });

  const createVenta = (data: Venta) =>
    apiCreateVenta({ ...initialData, ...data }).catch((err) => {
      pushError(err, makeKey('create', id, options));
      throw err;
    });

  return {
    ...swrRet,
    updateVenta,
    createVenta,
    deleteVenta,
  };
};
