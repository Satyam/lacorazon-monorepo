import Page from 'components/Page';
import { Loading } from 'components/Modals';
import { Alert } from 'react-bootstrap';
import { Accordion, AccordionPanel } from 'components/Accordion';
import ListVentas from 'components/ventas/ListVentas';
import { FormWrapper, TextField, EmailField } from '@lacorazon/lit-form-react';

import { useGetVendedor } from 'dataHooks/useVendedores';

const ShowVendedor = ({ id }: { id: ID }) => {
  const { data: vendedor, error } = useGetVendedor(id);

  if (error) return <Alert color="danger">{error}</Alert>;
  if (!vendedor) return <Loading>Cargando vendedor</Loading>;

  return (
    <Page
      title={`Vendedor - ${vendedor ? vendedor.nombre : '??'}`}
      heading={`Vendedor`}
    >
      {vendedor && (
        <>
          <FormWrapper>
            <TextField
              label="Nombre"
              name="nombre"
              value={vendedor.nombre}
              placeholder="Nombre"
              readonly
            />
            <EmailField
              label="Email"
              name="email"
              value={vendedor.email || '-'}
              placeholder="Email"
              readonly
            />
          </FormWrapper>
          <Accordion>
            <AccordionPanel label="Ventas" name="ventas">
              <ListVentas idVendedor={id} />
            </AccordionPanel>
            <AccordionPanel label="Consigna" name="consigna">
              Aquí irían los libros que este vendedor tiene en consigna en las
              librerías
            </AccordionPanel>
          </Accordion>
        </>
      )}
    </Page>
  );
};

export default ShowVendedor;
