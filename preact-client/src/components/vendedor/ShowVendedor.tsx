import { h, Fragment } from 'preact';

import Page from 'components/Page';
import { Loading } from 'components/Modals';
import { Accordion, AccordionPanel } from 'components/Accordion';
import ListVentas from 'components/ventas/ListVentas';
import {
  FormWrapper,
  TextField,
  EmailField,
} from '@lacorazon/lit-react-integration';
import { useQuery } from 'react-query';
import { apiGetVendedor, VENDEDORES_SERVICE } from '@lacorazon/post-client';

const ShowVendedor = ({ id }: { id: ID }) => {
  const { isLoading, data: vendedor } = useQuery<Vendedor, Error>(
    [VENDEDORES_SERVICE, id],
    () => apiGetVendedor(id),
    { meta: { message: `Mostrar Vendedor: [${id}]` } }
  );

  if (isLoading) return <Loading>Cargando vendedor</Loading>;

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
