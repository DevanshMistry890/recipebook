import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { auth } from '../firebase'; // Import Firebase auth
import { signOut } from 'firebase/auth'; // Import signOut

function Header({ activeTab, currentUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error.message);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <Navbar variant="light" expand="lg" className="mb-4 rounded-bottom glass-card">
      <Container>
        <Navbar.Brand as={Link} to="/">Recipe Website</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"> {/* Changed ms-auto to me-auto to push login/logout right */}
            <Nav.Link as={Link} to="/" active={activeTab === 'Home'}>Home</Nav.Link>
            <Nav.Link as={Link} to="/find" active={activeTab === 'Find Recipe'}>Find Recipe</Nav.Link>
            <Nav.Link as={Link} to="/saved" active={activeTab === 'Saved'}>Saved</Nav.Link>
          </Nav>
          <Nav>
            {currentUser ? (
              <NavDropdown title={currentUser.email || "User"} id="basic-nav-dropdown">
                {/* <NavDropdown.Item href="#profile">Profile</NavDropdown.Item> */}
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login">Login <i className="fa-solid fa-right-to-bracket"></i></Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;