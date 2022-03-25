import { h, FunctionComponent } from 'preact';
import { Alert } from 'react-bootstrap';

// import { TextField, EmailField } from '@lacorazon/lit-form';
import Page from 'components/Page';
import { Loading } from 'components/Modals';
import { Accordion, AccordionPanel } from 'components/Accordion';
// import ListVentas from 'Components/ventas/ListVentas';

import { useQuery } from 'react-query';
import { apiGetVendedor } from '@lacorazon/post-client';

import 'preactDeclarations';

export const ShowUser: FunctionComponent<{ id: ID }> = ({ id }) => {
  const {
    isLoading,
    isError,
    error,
    data: vendedor,
  } = useQuery<Vendedor, Error>(['vendedor', id], () => apiGetVendedor(id));

  if (isError) return <Alert variant="warning">{error.message}</Alert>;
  if (isLoading) return <Loading>Cargando vendedor</Loading>;

  return (
    <Page
      title={`Vendedor - ${vendedor ? vendedor.nombre : '??'}`}
      heading={`Vendedor`}
    >
      <form-wrapper>
        <text-field
          label="Nombre"
          name="nombre"
          value={vendedor?.nombre}
          placeholder="Nombre"
          readonly
        />
        <email-field
          label="Email"
          name="email"
          value={vendedor?.email || '-'}
          placeholder="Email"
          readonly
        />
      </form-wrapper>
      <Accordion>
        <AccordionPanel label="Ventas" name="ventas">
          {/* <ListVentas idVendedor={id} nombreVendedor={vendedor.nombre} wide /> */}
        </AccordionPanel>
        <AccordionPanel label="Consigna" name="consigna">
          Aquí irían los libros que este vendedor tiene en consigna en las
          librerías
        </AccordionPanel>
      </Accordion>
    </Page>
  );
};

export default ShowUser;
