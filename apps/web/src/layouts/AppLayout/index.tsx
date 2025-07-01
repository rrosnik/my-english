import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { UserType } from '../../redux/reducers/userReducer';
import { Button, InputGroup, Offcanvas } from 'react-bootstrap';
import apis from '../../apis';
import EmailVerifyingPage from '../../pages/EmailVerifyingPage';

import './index.scss';

const AppLayout = () => {
  const currentUser = useSelector<RootState, UserType | null>((state) => state.user.currentUser);
  const [show, setShow] = useState<boolean>(false);
  if (!currentUser?.emailVerified) {
    return <EmailVerifyingPage />;
  }

  return (
    <div className="layout">
      {/* <!-- Navbar --> */}
      <Navbar bg="light" expand="sm" collapseOnSelect>
        {/* <!-- Container wrapper --> */}
        <Container fluid>
          {/* <!-- Navbar brand --> */}
          <Navbar.Brand>My English</Navbar.Brand>

          {/* <!-- Toggle button --> */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setShow(true)} />
          <Navbar.Offcanvas id="basic-navbar-nav" placement="end" show={show}>
            <Offcanvas.Header>
              <Offcanvas.Title className="w-100">
                <div className="name">
                  My English
                  <Button variant="danger" onClick={() => setShow(false)}>
                    X
                  </Button>
                </div>

                {currentUser ? (
                  <InputGroup className="w-100 mt-4">
                    <Button disabled variant="outline-secondary flex-grow-1 text-start">
                      {currentUser.displayName}
                    </Button>
                    <Button type="button" onClick={() => apis.auth.userSignedOut()}>
                      Sign out
                    </Button>
                  </InputGroup>
                ) : (
                  <Nav className="me-auto mt-4">
                    <Nav.Link as="div">
                      <Link to="sign-in">Sign in</Link>
                    </Nav.Link>
                  </Nav>
                )}
              </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
              <Nav className="me-auto">
                <Nav.Link as="div">
                  <Link to="collection">Collection</Link>
                </Nav.Link>
              </Nav>

              <Navbar.Text className="d-none d-sm-inline">
                {currentUser ? (
                  <InputGroup className="w-100" size="sm">
                    <Button disabled variant="outline-secondary flex-grow-1 text-start">
                      {currentUser.displayName}
                    </Button>
                    <Button type="button" onClick={() => apis.auth.userSignedOut()}>
                      Sign out
                    </Button>
                  </InputGroup>
                ) : (
                  <Nav className="me-auto">
                    <Nav.Link as="div">
                      <Link to="sign-in">Sign in</Link>
                    </Nav.Link>
                  </Nav>
                )}
              </Navbar.Text>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      <Container fluid>
        <Outlet />
      </Container>
    </div>
  );
};

export default AppLayout;
