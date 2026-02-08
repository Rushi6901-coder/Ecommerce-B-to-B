import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const LoginModal = ({ show, onHide }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  /* REGEX */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

  const handleLogin = async (e) => {
    e.preventDefault();

    // EMAIL VALIDATION
    if (!emailRegex.test(email)) {
      setError('Enter a valid email address');
      return;
    }

    // PASSWORD VALIDATION
    if (!passwordRegex.test(password)) {
      setError(
        'Password must be 6+ chars, 1 capital letter, 1 number & 1 special character'
      );
      return;
    }

    // CLEAR ERROR
    setError('');

    // CALL LOGIN (use AuthContext login which accepts credentials)
    try {
      await login({ email, password });
    } catch (err) {
      setError(err.message || 'Login failed');
      return;
    }
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleLogin}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* EMAIL */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          {/* PASSWORD */}
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Login
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default LoginModal;
