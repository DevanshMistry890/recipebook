import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function Header({ activeTab, currentUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <Navbar expand="lg" className="mb-4 glass-card custom-nav">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="../src/assets/logo.png"
            alt="Logo"
            height="50"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto text-center align-items-center">
            <Nav.Link as={Link} to="/" active={activeTab === 'Home'}>Home</Nav.Link>
            <Nav.Link as={Link} to="/find" active={activeTab === 'Find Recipe'}>Find Recipe</Nav.Link>
            <Nav.Link as={Link} to="/saved" active={activeTab === 'Saved'}>Saved</Nav.Link>
          </Nav>

          {/* Right-aligned login/logout */}
          <Nav className="ms-auto">
            {currentUser ? (
              <NavDropdown title={currentUser.email || "User"} id="basic-nav-dropdown" align="end">
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