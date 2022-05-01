import { Link } from 'preact-router/match';
import { useState } from 'react';
import { Navbar, Nav, Dropdown, NavDropdown } from 'react-bootstrap';

import '@lacorazon/lit-icons';

import { useIntl } from 'providers/Intl';
import { useAuth } from 'providers/Auth';

import styles from './styles.module.css';

export const Navigation = () => {
  const [isOpen, setOpen] = useState(false);
  const { locale, setLocale, locales } = useIntl();
  const { currentUser, logout } = useAuth();

  function toggle() {
    setOpen(!isOpen);
  }

  return (
    <div>
      <Navbar expand="md" variant="light" className={styles.navbar}>
        <Navbar.Brand href="/" className={styles.navbrand}>
          <img src="/La Corazon.png" alt="La Corazón" /> La Corazón
        </Navbar.Brand>
        <Navbar.Toggle onClick={toggle} />
        <Navbar.Collapse>
          {currentUser && (
            <Nav className="me-auto">
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
              <Nav.Item>
                <Nav.Link as={Link} href="/vendedores">
                  Vendedores
                </Nav.Link>
              </Nav.Item>
            </Nav>
          )}
          <Nav className="ms-auto">
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
              {currentUser ? (
                <>
                  <Dropdown.Toggle as={Nav.Link} className={styles.user}>
                    <icon-logged-in></icon-logged-in>
                    {currentUser.nombre}
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
                <>
                  <Dropdown.Toggle as={Nav.Link} className={styles.user}>
                    <icon-logged-out></icon-logged-out>
                    guest
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    <Dropdown.Item as={Link} href="/login">
                      Login
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </>
              )}
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};
