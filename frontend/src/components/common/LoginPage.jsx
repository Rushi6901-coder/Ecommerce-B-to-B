import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Nav } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { users } from '../../data/demoData';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'shopkeeper',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const { login, register, findUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      // Admin login check
      if (formData.email === 'admin' && formData.password === 'admin@12') {
        const adminUser = { id: 0, name: 'Admin User', email: 'admin@system.com', role: 'admin' };
        login(adminUser);
        toast.success(`🎉 Welcome Admin!`);
        navigate('/admin');
        setLoading(false);
        return;
      }

      if (isLogin) {
        // Login logic - check both demo users and registered users
        const demoUser = users.find(u => u.email === formData.email);
        const registeredUser = findUser(formData.email);
        const user = demoUser || registeredUser;
        
        if (user) {
          login(user);
          toast.success(`🎉 Welcome ${user.name}!`);
          
          switch(user.role) {
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
          toast.error('❌ User not found.');
        }
      } else {
        // Sign up logic
        const newUser = {
          id: Date.now(),
          name: formData.name,
          email: formData.email,
          role: formData.role
        };
        register(newUser);
        toast.success(`🎉 Account created! Welcome ${newUser.name}!`);
        
        switch(newUser.role) {
          case 'vendor':
            navigate('/dashboard');
            break;
          case 'shopkeeper':
            navigate('/');
            break;
          default:
            navigate('/');
        }
      }
      setLoading(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={5}>
            <Card className="shadow-lg">
              <Card.Header className="bg-primary text-white text-center py-4">
                <h3 className="mb-0">🔐 B2B Commerce</h3>
              </Card.Header>
              <Card.Body className="p-4">
                {/* Toggle Tabs */}
                <Nav variant="pills" className="justify-content-center mb-4">
                  <Nav.Item>
                    <Nav.Link 
                      active={isLogin} 
                      onClick={() => setIsLogin(true)}
                    >
                      Login
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={!isLogin} 
                      onClick={() => setIsLogin(false)}
                    >
                      Sign Up
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Form onSubmit={handleSubmit}>
                  {!isLogin && (
                    <Form.Group className="mb-3">
                      <Form.Label>👤 Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </Form.Group>
                  )}
                  
                  <Form.Group className="mb-3">
                    <Form.Label>📧 Email</Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={isLogin ? "Enter email or 'admin'" : "Enter your email"}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>🔒 Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={isLogin ? "Enter password or 'admin@12'" : "Create password"}
                      required
                    />
                  </Form.Group>

                  {!isLogin && (
                    <Form.Group className="mb-4">
                      <Form.Label>👥 Role</Form.Label>
                      <Form.Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="shopkeeper">🛒 Shopkeeper</option>
                        <option value="vendor">🏪 Vendor</option>
                      </Form.Select>
                    </Form.Group>
                  )}
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 mb-3"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? '🔄 Processing...' : (isLogin ? '🚀 Login' : '✨ Sign Up')}
                  </Button>
                </Form>
                
                <Alert variant="info" className="mb-0">
                  <strong>🔑 Admin Access:</strong>
                  <div className="mt-2">
                    <small>Username: <code>admin</code></small><br/>
                    <small>Password: <code>admin@12</code></small>
                  </div>
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;