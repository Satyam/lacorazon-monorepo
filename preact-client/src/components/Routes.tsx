import { FunctionComponent, h } from 'preact';
import { Route, Router } from 'preact-router';
import { Alert } from 'react-bootstrap';

// import Users from 'routes/user/ListUsers';
// import EditUser from 'routes/user/EditUser';
// import ShowUser from 'routes/user/ShowUser';
// import Distribuidores from 'routes/distribuidor/ListDistribuidores';
// import EditDistribuidor from 'routes/distribuidor/EditDistribuidor';
// import ShowDistribuidor from 'routes/distribuidor/ShowDistribuidor';
// import ListVentas from 'routes/ventas/ListVentas';
// import EditVenta from 'routes/ventas/EditVenta';
// import ShowVenta from 'routes/ventas/ShowVenta';
import ListVendedores from 'components/vendedor/ListVendedores';
import ShowVendedor from 'components/vendedor/ShowVendedor';
import EditVendedor from 'components/vendedor/EditVendedor';
// import Profile from 'routes/Profile';

const NotFoundPage: FunctionComponent<{ path?: string }> = ({ path }) => (
  <Alert variant="warning">
    <Alert.Heading>Not Found</Alert.Heading>
    <p>{path}</p>
  </Alert>
);

const Routes: FunctionComponent = () => (
  <Router>
    {/* <Route path="/users" component={Users} />
    <Route path="/user/new" component={EditUser} />
    <Route path="/user/edit/:id" component={EditUser} />
    <Route path="/user/:id" component={ShowUser} />
    <Route path="/distribuidores" component={Distribuidores} />
    <Route path="/distribuidor/new" component={EditDistribuidor} />
    <Route path="/distribuidor/edit/:id" component={EditDistribuidor} />
    <Route path="/distribuidor/:id" component={ShowDistribuidor} />
    <Route path="/ventas" component={ListVentas} />
    <Route path="/venta/new" component={EditVenta} />
    <Route path="/venta/edit/:id" component={EditVenta} />
    <Route path="/venta/:id" component={ShowVenta} /> */}
    {/* <Route path="/profile" component={Profile} /> */}
    <Route component={ListVendedores} path="/vendedores" />
    <Route component={ShowVendedor} path="/vendedor/:id" />
    <Route component={EditVendedor} path="/vendedor/new" />
    <Route component={EditVendedor} path="/vendedor/edit/:id" />
    <Route default component={NotFoundPage} />
  </Router>
);

export default Routes;
