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

import { useErrorsContext } from 'providers/ErrorsContext';

export const useListVendedores = (options?: OptionsType) => {
  const { pushError } = useErrorsContext();

  const { data, mutate } = useSWR<Vendedor[]>(
    [VENDEDORES_SERVICE, options],
    (_: any, options: OptionsType | undefined) => apiListVendedores(options),
    { onError: (err) => pushError(err, 'Error leyendo tabla de vendedores') }
  );

  return useMemo(
    () => ({
      vendedores: data,
      deleteVendedor: (id: ID) =>
        apiRemoveVendedor(id)
          .catch((err) =>
            pushError(
              err,
              `Error borrando vendedor ${data?.find((vendedor) =>
                vendedor.id === id ? vendedor.nombre : '???'
              )}`
            )
          )
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
  const { pushError } = useErrorsContext();

  const { data, mutate } = useSWR<Vendedor>(
    id ? [VENDEDORES_SERVICE, id, options] : null,
    (_: any, id: ID, options: OptionsType | undefined) =>
      apiGetVendedor(id, options),
    {
      fallbackData: initialData as Vendedor,
      onError: (err) => {
        if (err.error === 404)
          return pushError(
            'El registro no existe o ha sido borrado',
            `Error leyendo vendedor "${id}"`
          );

        return pushError(err, `Error leyendo vendedor "${id}"`);
      },
    }
  );

  return useMemo(
    () => ({
      vendedor: data,
      updateVendedor: (data: Vendedor) =>
        mutate(
          apiUpdateVendedor({ ...data, id }).catch((err) => {
            pushError(err, `Error actualizando vendedor ${data.nombre}`);
            throw err;
          })
        ),
      createVendedor: (data: Vendedor) =>
        apiCreateVendedor({ ...initialData, ...data }).catch((err) => {
          pushError(err, `Error creando vendedor ${data.nombre}`);
          throw err;
        }),
      deleteVendedor: () =>
        apiRemoveVendedor(id).catch((err) => {
          pushError(err, `Error borrando vendedor ${data?.nombre}`);
          throw err;
        }),
    }),
    [data, mutate]
  );
};
