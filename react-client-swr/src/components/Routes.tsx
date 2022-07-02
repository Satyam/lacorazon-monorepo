import { ComponentType } from 'react';

import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

import App from 'components/App';
// import Users from 'routes/user/ListUsers';
// import EditUser from 'routes/user/EditUser';
// import ShowUser from 'routes/user/ShowUser';
// import Distribuidores from 'routes/distribuidor/ListDistribuidores';
// import EditDistribuidor from 'routes/distribuidor/EditDistribuidor';
// import ShowDistribuidor from 'routes/distribuidor/ShowDistribuidor';
import ListVentas from 'components/ventas/ListVentas';
import EditVenta from 'components/ventas/EditVenta';
import ShowVenta from 'components/ventas/ShowVenta';
import ListVendedores from 'components/vendedor/ListVendedores';
import ShowVendedor from 'components/vendedor/ShowVendedor';
import EditVendedor from 'components/vendedor/EditVendedor';
import Login from 'components/Login';
// import Profile from 'routes/Profile';

const NotFoundPage = ({ path }: { path?: string }) => (
  <Alert variant="warning">
    <Alert.Heading>Not Found</Alert.Heading>
    <p>{path}</p>
  </Alert>
);

const Home = () => <h1>Bienvenido</h1>;

const ExtractId = ({ Component }: { Component: ComponentType<{ id: ID }> }) => {
  const { id } = useParams();
  return <Component id={id as ID} />;
};

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        {/* <Route path="users" element={<Users/>} />
    <Route path="user/new" element={<EditUser/>} />
    <Route path="user/edit/:id" element={<EditUser/>} />
    <Route path="user/:id" element={<ShowUser/>} />
    <Route path="distribuidores" element={<Distribuidores/>} />
    <Route path="distribuidor/new" element={<EditDistribuidor/>} />
    <Route path="distribuidor/edit/:id" element={<EditDistribuidor/>} />
  <Route path="distribuidor/:id" element={<ShowDistribuidor/>} /> */}
        <Route path="ventas" element={<ListVentas />} />
        <Route path="venta/new" element={<ExtractId Component={EditVenta} />} />
        <Route
          path="venta/edit/:id"
          element={<ExtractId Component={EditVenta} />}
        />
        <Route path="venta/:id" element={<ExtractId Component={ShowVenta} />} />
        {/* <Route path="profile" element={<Profile/>} /> */}
        <Route path="login" element={<Login />} />
        <Route path="vendedores" element={<ListVendedores />} />
        <Route
          path="vendedor/:id"
          element={<ExtractId Component={ShowVendedor} />}
        />
        <Route
          path="vendedor/new"
          element={<ExtractId Component={EditVendedor} />}
        />
        <Route
          path="vendedor/edit/:id"
          element={<ExtractId Component={EditVendedor} />}
        />
        <Route path="" element={<Home />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default Router;
