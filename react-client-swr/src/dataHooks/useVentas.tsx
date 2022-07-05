import { useMemo } from 'react';
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

  const { data, mutate } = useSWR<VentaYVendedor[]>(
    [VENTAS_SERVICE, options],
    (_, options) => apiListVentas(options)
  );

  return useMemo(
    () => ({
      ventas: data,
      deleteVenta: (id: ID) =>
        apiRemoveVenta(id)
          .catch((err) => pushError(err, makeKey('delete', id, options)))
          .finally(() => mutate()),
    }),
    [data, mutate]
  );
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

  const { data, mutate } = useSWR<VentaYVendedor>(
    id ? [VENTAS_SERVICE, id, options] : null,
    (_, id, options) => apiGetVenta(id, options),
    {
      fallbackData: initialData as VentaYVendedor,
    }
  );

  return useMemo(
    () => ({
      venta: data,
      updateVenta: (data: Venta) =>
        mutate(
          apiUpdateVenta({ ...data, id }).catch((err) => {
            pushError(err, makeKey('delete', id, options));
            throw err;
          })
        ),
      createVenta: (data: Venta) =>
        apiCreateVenta({ ...initialData, ...data }).catch((err) => {
          pushError(err, makeKey('create', id, options));
          throw err;
        }),
      deleteVenta: () =>
        apiRemoveVenta(id).catch((err) => {
          pushError(err, makeKey('delete', id, options));
          throw err;
        }),
    }),
    [data, mutate]
  );
};
