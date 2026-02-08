import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Validation Schema
  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Use Axios 'api' instance which is already configured with Base URL and Interceptors
        // The endpoint is just '/users/login' because baseURL is set in api.js
        const response = await api.post('/users/login', {
          email: values.email,
          password: values.password
        });

        // Axios throws on 4xx/5xx, so if we are here, it's 2xx
        const user = response.data;

        await login(user);
        toast.success(`🎉 Welcome ${user.name || 'User'}!`);

        if (user.role === 'vendor') {
          navigate('/dashboard');
        } else if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error("Login Error:", error);
        const errorMsg = error.response?.data || error.message || 'Login failed';
        // Handle object error response if any
        const displayMsg = typeof errorMsg === 'object' ? errorMsg.message : errorMsg;
        toast.error(`❌ ${displayMsg}`);
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <div className="login-container d-flex align-items-center" style={{ minHeight: '80vh' }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={5}>
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-primary text-white text-center py-4">
                <h3 className="mb-0">🔐 B2B Commerce</h3>
              </Card.Header>
              <Card.Body className="p-4">
                <h4 className="text-center mb-4">Login to your account</h4>

                <Form onSubmit={formik.handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>📧 Email</Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.email && formik.errors.email}
                      placeholder="Enter email"
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>🔒 Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.password && formik.errors.password}
                      placeholder="Enter password"
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? '🔄 Logging in...' : '🚀 Login'}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <p className="text-muted">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-decoration-none fw-bold">
                      Sign Up Here
                    </Link>
                  </p>
                </div>

                <hr className="my-4" />

                <Alert variant="info" className="mb-0 text-center">
                  <small>
                    Admin users should be created via backend/seed.
                  </small>
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