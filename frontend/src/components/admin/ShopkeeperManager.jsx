import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Alert } from 'react-bootstrap';
import { API_ENDPOINTS } from '../../config/api';

const ShopkeeperManager = () => {
  const [shopkeepers, setShopkeepers] = useState([]);
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const fetchShopkeepers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.shopkeepers);
      if (response.ok) {
        const data = await response.json();
        setShopkeepers(Array.isArray(data) ? data : []);
      } else {
        setMessage(`Shopkeeper endpoint not available (${response.status})`);
      }
    } catch (error) {
      setMessage('Shopkeeper endpoint not available');
    }
  };

  const addShopkeeper = async (e) => {
    e.preventDefault();
    const payload = { name, shopName, email, phone, password };
    try {
      const response = await fetch(API_ENDPOINTS.shopkeepers, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setName('');
        setShopName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setMessage('Shopkeeper added successfully');
        fetchShopkeepers();
      } else {
        const errorText = await response.text();
        setMessage(`Error: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      setMessage('Error adding shopkeeper');
    }
  };

  const deleteShopkeeper = async (id) => {
    if (window.confirm('Are you sure you want to delete this shopkeeper?')) {
      try {
        const response = await fetch(`${API_ENDPOINTS.shopkeepers}/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setMessage('Shopkeeper deleted successfully');
          fetchShopkeepers();
        } else {
          setMessage('Error deleting shopkeeper');
        }
      } catch (error) {
        setMessage('Error deleting shopkeeper');
      }
    }
  };

  const toggleActivation = async (id) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.shopkeepers}/Activate/${id}`, {
        method: 'PUT'
      });
      if (response.ok) {
        setMessage('Shopkeeper status updated');
        fetchShopkeepers();
      } else {
        setMessage('Error updating status');
      }
    } catch (error) {
      setMessage('Error updating status');
    }
  };

  useEffect(() => {
    fetchShopkeepers();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Shopkeeper Management</h3>
      {message && <Alert variant="info" onClose={() => setMessage('')} dismissible>{message}</Alert>}

      <Form onSubmit={addShopkeeper} className="mb-4 p-3 border rounded bg-light">
        <h5>Add New Shopkeeper</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <Form.Control
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <Form.Control
              type="text"
              placeholder="Shop Name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <Form.Control
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <Button type="submit" variant="primary">Add Shopkeeper</Button>
      </Form>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Shop Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shopkeepers.map((shopkeeper) => (
            <tr key={shopkeeper.shopkeeperId}>
              <td>{shopkeeper.name}</td>
              <td>{shopkeeper.shopName}</td>
              <td>{shopkeeper.email}</td>
              <td>{shopkeeper.phone}</td>
              <td>
                <Button
                  variant={shopkeeper.isActive ? "success" : "secondary"}
                  size="sm"
                  onClick={() => toggleActivation(shopkeeper.shopkeeperId || shopkeeper.id)}
                >
                  {shopkeeper.isActive ? 'Active' : 'Inactive'}
                </Button>
              </td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteShopkeeper(shopkeeper.shopkeeperId || shopkeeper.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {shopkeepers.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">No shopkeepers found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ShopkeeperManager;