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

import { useErrorsContext } from 'providers/ErrorsContext';
import { formatDate } from 'utils';

export const useListVentas = (options?: OptionsType) => {
  const { pushError } = useErrorsContext();

  const { data, mutate } = useSWR<VentaYVendedor[]>(
    [VENTAS_SERVICE, options],
    (_, options) => apiListVentas(options),
    { onError: (err) => pushError(err, `Leyendo tabla de ventas`) }
  );

  return useMemo(
    () => ({
      ventas: data,
      deleteVenta: (id: ID) =>
        apiRemoveVenta(id)
          .catch((err) =>
            pushError(
              err,
              `Error borando venta de fecha ${data?.find((venta) =>
                venta.id === id ? formatDate(venta.fecha) : '???'
              )}`
            )
          )
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
  const { pushError } = useErrorsContext();

  const { data, mutate } = useSWR<VentaYVendedor>(
    id ? [VENTAS_SERVICE, id, options] : null,
    (_, id, options) => apiGetVenta(id, options),
    {
      fallbackData: initialData as VentaYVendedor,
      onError: (err) => pushError(err, `Error leyendo venta con id ${id}`),
    }
  );

  return useMemo(
    () => ({
      venta: data,
      updateVenta: (data: Venta) =>
        mutate(
          apiUpdateVenta({ ...data, id }).catch((err) => {
            pushError(
              err,
              `Error actualizando venta de fecha ${formatDate(data.fecha)}`
            );
            throw err;
          })
        ),
      createVenta: (data: Venta) =>
        apiCreateVenta({ ...initialData, ...data }).catch((err) => {
          pushError(err, 'Error dando de alta nueva venta');
          throw err;
        }),
      deleteVenta: () =>
        apiRemoveVenta(id).catch((err) => {
          pushError(
            err,
            `Error borrando venta de fecha ${
              data ? formatDate(data.fecha) : '???'
            }`
          );
          throw err;
        }),
    }),
    [data, mutate]
  );
};
