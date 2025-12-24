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
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        <Navbar.Brand onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          B2B Commerce
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate('/')}>🏠 Home</Nav.Link>
            {user && <Nav.Link onClick={() => navigate('/chat')}>💬 Chat</Nav.Link>}
            {user && <Nav.Link onClick={() => navigate('/order-history')}>📦 Order History</Nav.Link>}
            {user?.role === 'shopkeeper' && (
              <Nav.Link onClick={() => navigate('/cart')}>
                🛒 Cart {cart.length > 0 && <Badge bg="danger">{cart.length}</Badge>}
              </Nav.Link>
            )}
            {user?.role === 'vendor' && <Nav.Link onClick={() => navigate('/dashboard')}>📊 Dashboard</Nav.Link>}
            {user?.role === 'admin' && <Nav.Link onClick={() => navigate('/admin')}>⚙️ Admin Panel</Nav.Link>}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-3">
                  <span className={`badge bg-${
                    user.role === 'admin' ? 'danger' : 
                    user.role === 'vendor' ? 'warning' : 'info'
                  } me-2`}>
                    {user.role}
                  </span>
                  {user.name}
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Button variant="outline-light" size="sm" onClick={() => navigate('/login')}>Login</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;