import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import Logo from '../assets/logo.png';

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
    <header className="tstbite-header bg-white has-header-inner">
      <Navbar expand="lg" className="py-3 py-md-4" variant="light">
        <Container>
          <Navbar.Brand as={Link} to="/" className="navbar-brand">
            <img
              src={Logo}
              alt="Tastebite Logo"
              style={{
                height: '48px',
                width: 'auto',
                maxWidth: '220px', // responsive cap
                objectFit: 'contain',
              }}
              className="d-inline-block align-top"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar-nav" />
          <Navbar.Collapse id="main-navbar-nav">
            <Nav className="mx-auto text-center align-items-center gap-3">
              <Nav.Link
                as={Link}
                to="/"
                className={`tstbite-nav-link ${activeTab === 'Home' ? 'active' : ''}`}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/find"
                className={`tstbite-nav-link ${activeTab === 'Find Recipe' ? 'active' : ''}`}
              >
                Find Recipe
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/saved"
                className={`tstbite-nav-link ${activeTab === 'Saved' ? 'active' : ''}`}
              >
                Saved
              </Nav.Link>
            </Nav>

            <Nav className="ms-auto align-items-center">
              {currentUser ? (
                <NavDropdown
                  title={currentUser.email || 'User'}
                  id="user-nav-dropdown"
                  align="end"
                  className="tstbite-nav-dropdown"
                >
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login" className="d-flex align-items-center gap-2">
                  Login <i className="fa-solid fa-right-to-bracket" />
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
