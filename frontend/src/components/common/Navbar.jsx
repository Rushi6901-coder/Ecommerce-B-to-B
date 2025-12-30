import React from 'react';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AppNavbar = () => {
  const { user, logout, cart } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar expand="lg" sticky="top" className="glass-navbar">
      <Container fluid>
        {/* Brand */}
        <Navbar.Brand
          className="brand-text"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          B2B Commerce
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          {/* LEFT MENU */}
          <Nav className="me-auto nav-links">
            <Nav.Link onClick={() => navigate('/')} className="force-black">Home</Nav.Link>
            <Nav.Link onClick={() => navigate('/contact')} className="force-black">Contact</Nav.Link>

            {(user?.role === 'shopkeeper' || user?.role === 'vendor') && (
              <Nav.Link onClick={() => navigate('/chat')} className="force-black position-relative">
                💬
                <Badge 
                  pill 
                  bg="danger" 
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: '0.6rem' }}
                >
                  3
                </Badge>
              </Nav.Link>
            )}

            {user && (
              <Nav.Link onClick={() => navigate('/order-history')} className="force-black">
                Orders
              </Nav.Link>
            )}

            {user?.role === 'shopkeeper' && (
              <Nav.Link onClick={() => navigate('/cart')} className="force-black">
                Cart{' '}
                {cart.length > 0 && (
                  <Badge pill bg="danger" className="ms-1">
                    {cart.length}
                  </Badge>
                )}
              </Nav.Link>
            )}

            {user?.role === 'vendor' && (
              <Nav.Link onClick={() => navigate('/dashboard')} className="force-black">
                Dashboard
              </Nav.Link>
            )}

            {user?.role === 'admin' && (
              <Nav.Link onClick={() => navigate('/admin')} className="force-black">
                Admin Panel
              </Nav.Link>
            )}
          </Nav>

          {/* RIGHT MENU */}
          <Nav className="align-items-center">
            {user ? (
              <>
                <span
                  className={`role-badge me-2 ${
                    user.role === 'admin'
                      ? 'role-admin'
                      : user.role === 'vendor'
                      ? 'role-vendor'
                      : 'role-shop'
                  }`}
                >
                  {user.role.toUpperCase()}
                </span>

                <span className="username-text me-3">
                  {user.name}
                </span>

                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;