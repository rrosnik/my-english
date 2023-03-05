import React from 'react'
import { Link, Outlet } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { UserType } from '../../redux/reducers/userReducer';

const AppLayout = () => {
  const currentUser = useSelector<RootState, UserType | null>(state => state.user.currentUser);
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>My English</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link>
                <Link to="insert">Insert</Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="review">Review</Link>
              </Nav.Link>
            </Nav>

            <Navbar.Text>
              Signed in as: {currentUser && currentUser.email}
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