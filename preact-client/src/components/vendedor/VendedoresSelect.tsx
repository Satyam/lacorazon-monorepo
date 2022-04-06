import { h } from 'preact';
import { Alert } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { apiListVendedores, VENDEDORES_SERVICE } from '@lacorazon/post-client';
import { Loading } from 'components/Modals';

const VendedoresSelect = ({ id }: { id: ID }) => {
  const {
    isError,
    error,
    data: vendedores,
  } = useQuery<Vendedor[], Error>(VENDEDORES_SERVICE, () =>
    apiListVendedores()
  );

  if (isError) return <Alert variant="warning">{error.toString()}</Alert>;
  if (!vendedores) return <Loading>Cargando vendedores</Loading>;

  return (
    <select>
      {vendedores.map((v) => (
        <option value={v.id} selected={v.id === id}>
          {v.nombre}
        </option>
      ))}
    </select>
  );
};

export default VendedoresSelect;
