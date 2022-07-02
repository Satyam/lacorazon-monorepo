import { Alert } from 'react-bootstrap';
import { useListVendedores } from 'dataHooks/useVendedores';
import { Loading } from 'components/Modals';

const VendedoresSelect = ({ id }: { id: ID }) => {
  const { data: vendedores, error } = useListVendedores();

  if (error) return <Alert variant="warning">{error.toString()}</Alert>;
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
