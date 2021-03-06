import { h } from 'preact';
import { Route, Router } from 'preact-router';
import { Alert } from 'react-bootstrap';

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

const Routes = () => (
  <Router>
    {/* <Route path="/users" component={Users} />
    <Route path="/user/new" component={EditUser} />
    <Route path="/user/edit/:id" component={EditUser} />
    <Route path="/user/:id" component={ShowUser} />
    <Route path="/distribuidores" component={Distribuidores} />
    <Route path="/distribuidor/new" component={EditDistribuidor} />
    <Route path="/distribuidor/edit/:id" component={EditDistribuidor} />
  <Route path="/distribuidor/:id" component={ShowDistribuidor} /> */}
    <Route path="/ventas" component={ListVentas} />
    <Route path="/venta/new" component={EditVenta} />
    <Route path="/venta/edit/:id" component={EditVenta} />
    <Route path="/venta/:id" component={ShowVenta} />
    {/* <Route path="/profile" component={Profile} /> */}
    <Route component={Login} path="/login" />
    <Route component={ListVendedores} path="/vendedores" />
    <Route component={ShowVendedor} path="/vendedor/:id" />
    <Route component={EditVendedor} path="/vendedor/new" />
    <Route component={EditVendedor} path="/vendedor/edit/:id" />
    <Route component={Home} path="/" />
    <Route default component={NotFoundPage} />
  </Router>
);

export default Routes;
