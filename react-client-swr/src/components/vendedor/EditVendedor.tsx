import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

import Page from 'components/Page';
import { DetailsButtonSet } from 'components/Buttons';
import { Loading } from 'components/Modals';
import { useModals } from 'providers/Modals';

import { useGetVendedor } from 'dataHooks/useVendedores';

import {
  FormWrapper,
  TextField,
  EmailField,
  FormSubmitEvent,
} from '@lacorazon/lit-react-integration';

export const EditVendedor = ({ id }: { id: ID }) => {
  const navigate = useNavigate();
  const { vendedor, createVendedor, updateVendedor, deleteVendedor } =
    useGetVendedor(id);

  const { confirmDelete } = useModals();

  // All hooks executed, now I can branch
  if (id && !vendedor) return <Loading>Cargando vendedor</Loading>;

  const onDeleteClick = () => {
    confirmDelete(`al usuario ${vendedor?.nombre}`, () =>
      deleteVendedor().then(() => navigate('/vendedores', { replace: true }))
    );
  };

  const onSubmit = (ev: FormSubmitEvent) => {
    const values = ev.wrapper.values as Vendedor;
    if (id) {
      updateVendedor({ ...values, id });
    } else {
      createVendedor({ ...values }).then(({ id }) =>
        navigate(`/vendedor/edit/${id}`, { replace: true })
      );
    }
  };

  return (
    <Page
      title={`Vendedor - ${vendedor ? vendedor.nombre : 'nuevo'}`}
      heading={`${id ? 'Edit' : 'Add'} Vendedor`}
    >
      {id && !vendedor ? (
        <Alert color="danger">El usuario no existe o fue borrado</Alert>
      ) : (
        <FormWrapper onFormSubmit={onSubmit}>
          <form>
            <TextField
              label="Nombre"
              name="nombre"
              value={vendedor?.nombre}
              placeholder="Nombre"
            />
            <EmailField
              label="Email"
              name="email"
              value={vendedor?.email || '-'}
              placeholder="Email"
            />
            <DetailsButtonSet isNew={!id} onDelete={onDeleteClick} />
          </form>
        </FormWrapper>
      )}
    </Page>
  );
};

export default EditVendedor;
