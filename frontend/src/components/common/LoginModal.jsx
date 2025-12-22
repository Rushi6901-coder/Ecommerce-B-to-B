import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { users } from '../../data/demoData';
import { toast } from 'react-toastify';

const LoginModal = ({ show, onHide }) => {
  const [email, setEmail] = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    const user = users.find(u => u.email === email);
    if (user) {
      login(user);
      toast.success(`Welcome ${user.name}!`);
      onHide();
    } else {
      toast.error('User not found');
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
            <Form.Text className="text-muted">
              Demo emails: john@shop.com (shopkeeper), jane@vendor.com (vendor), admin@system.com (admin)
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="primary" onClick={handleLogin}>Login</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;