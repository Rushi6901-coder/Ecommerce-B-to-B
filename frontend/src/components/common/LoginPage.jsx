import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { users } from '../../data/demoData';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const user = users.find(u => u.email === email);
      if (user) {
        login(user);
        toast.success(`Welcome ${user.name}!`);
        
        // Redirect based on role
        switch(user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'vendor':
            navigate('/dashboard');
            break;
          case 'shopkeeper':
            navigate('/');
            break;
          default:
            navigate('/');
        }
      } else {
        toast.error('User not found. Please check your email.');
      }
      setLoading(false);
    }, 1000);
  };

  const demoUsers = [
    { email: 'john@shop.com', role: 'Shopkeeper', name: 'John Doe' },
    { email: 'jane@vendor.com', role: 'Vendor', name: 'Jane Smith' },
    { email: 'admin@system.com', role: 'Admin', name: 'Admin User' }
  ];

  return (
    <Container fluid className="py-5" style={{ minHeight: '80vh' }}>
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h4 className="mb-0">Login to B2B Commerce</h4>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </Form>
              
              <Alert variant="info" className="mb-0">
                <strong>Demo Accounts:</strong>
                <div className="mt-2">
                  {demoUsers.map((user, index) => (
                    <div key={index} className="mb-1">
                      <small>
                        <strong>{user.role}:</strong> {user.email}
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 ms-2"
                          onClick={() => setEmail(user.email)}
                        >
                          Use
                        </Button>
                      </small>
                    </div>
                  ))}
                </div>
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;