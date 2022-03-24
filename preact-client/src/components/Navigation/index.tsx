import { h, FunctionComponent } from 'preact';
import { Link } from 'preact-router/match';
import { useState } from 'preact/hooks';
import { Navbar, Nav, Dropdown, NavDropdown } from 'react-bootstrap';

import { FaUser } from 'react-icons/fa';

import laCorazon from 'assets/La Corazon.png';

import { useIntl } from 'providers/Intl';

import styles from './styles.module.css';

export const Navigation: FunctionComponent = () => {
  const [isOpen, setOpen] = useState(false);
  // const { isAuthenticated, loginWithPopup, logout, user } = useAuth0();
  const { locale, setLocale, locales } = useIntl();
  function toggle() {
    setOpen(!isOpen);
  }

  return (
    <div>
      <Navbar expand="md" variant="light" className={styles.navbar}>
        <Navbar.Brand href="/" className={styles.navbrand}>
          <img src={laCorazon} alt="La Corazón" />
          La Corazón
        </Navbar.Brand>
        <Navbar.Toggle onClick={toggle} />
        <Navbar.Collapse>
          <Nav className="ml-auto">
            <Nav.Item>
              <Nav.Link as={Link} href="/users">
                Usuarios
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} href="/distribuidores">
                Distribuidores
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} href="/ventas">
                Ventas
              </Nav.Link>
            </Nav.Item>
            <NavDropdown title={locale}>
              {locales.map((l) => (
                <NavDropdown.Item
                  key={l}
                  active={l === locale}
                  onClick={() => setLocale(l)}
                >
                  {l}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            <Dropdown as={Nav.Item}>
              {/* {isAuthenticated && user ? (
                <>
                  <Dropdown.Toggle as={Nav.Link} className={styles.user}>
                    <img src={user.picture} alt="User" />
                    {user.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    <Dropdown.Item onClick={() => logout()}>
                      Logout
                    </Dropdown.Item>
                    <Dropdown.Item divider />
                    <Dropdown.Item as={Link} href="/profile">
                      Profile
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </>
              ) : (
                <> */}
              <Dropdown.Toggle as={Nav.Link} className={styles.user}>
                <FaUser />
                guest
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={() => undefined /*loginWithPopup()*/}>
                  Login
                </Dropdown.Item>
              </Dropdown.Menu>
              {/* </>
              )} */}
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};
