import Page from 'components/Page';
import { Loading } from 'components/Modals';
import { Accordion, AccordionPanel } from 'components/Accordion';
import ListVentas from 'components/ventas/ListVentas';

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
          <form-wrapper>
            <text-field
              label="Nombre"
              name="nombre"
              value={vendedor.nombre}
              placeholder="Nombre"
              readonly
            />
            <email-field
              label="Email"
              name="email"
              value={vendedor.email || '-'}
              placeholder="Email"
              readonly
            />
          </form-wrapper>
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
