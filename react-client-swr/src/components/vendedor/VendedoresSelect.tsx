import { useListVendedores } from 'dataHooks/useVendedores';
import { Loading } from 'components/Modals';

const VendedoresSelect = ({ id }: { id: ID }) => {
  const { vendedores } = useListVendedores();

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
