import React from 'react'
import { Link, Outlet } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { UserType } from '../../redux/reducers/userReducer';
import { Button, InputGroup } from 'react-bootstrap';
import apis from '../../apis';
import EmailVerifyingPage from '../../pages/EmailVerifyingPage';

const AppLayout = () => {
  const currentUser = useSelector<RootState, UserType | null>(state => state.user.currentUser);

  if (!currentUser?.emailVerified) {
    return (
      <EmailVerifyingPage />
    );
  }

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>My English</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as="div">
                <Link to="insert">Insert</Link>
              </Nav.Link>
              <Nav.Link as="div">
                <Link to="review">Review</Link>
              </Nav.Link>
            </Nav>

            <Navbar.Text>
              {
                currentUser
                  ?
                  <InputGroup>
                    <Button disabled variant="outline-secondary">
                      {currentUser.displayName}
                    </Button>
                    <Button type="button" onClick={() => apis.auth.userSignedOut()}>Sign out</Button>
                  </InputGroup>
                  :
                  <Nav className="me-auto">
                    <Nav.Link as="div">
                      <Link to="sign-in">Sign in</Link>
                    </Nav.Link>
                  </Nav>
              }
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Outlet />
      </Container>
    </div>
  )
}

export default AppLayout