import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Alert, Modal, Badge } from 'react-bootstrap';
import { API_ENDPOINTS } from '../../config/api';

const VendorManager = () => {
  const [vendors, setVendors] = useState([]);
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Insights State
  const [showInsights, setShowInsights] = useState(false);
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const fetchVendors = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.vendors);
      if (response.ok) {
        const data = await response.json();
        setVendors(Array.isArray(data) ? data : []);
      } else {
        setMessage(`Vendor endpoint not available (${response.status})`);
      }
    } catch (error) {
      setMessage('Vendor endpoint not available');
    }
  };

  const addVendor = async (e) => {
    e.preventDefault();
    const payload = { name, shopName, email, phone, password };
    try {
      const response = await fetch(API_ENDPOINTS.vendors, {
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
        setMessage('Vendor added successfully');
        fetchVendors();
      } else {
        const errorText = await response.text();
        setMessage(`Error: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      setMessage('Error adding vendor');
    }
  };

  const deleteVendor = async (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        const response = await fetch(`${API_ENDPOINTS.vendors}/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setMessage('Vendor deleted successfully');
          fetchVendors();
        } else {
          setMessage('Error deleting vendor');
        }
      } catch (error) {
        setMessage('Error deleting vendor');
      }
    }
  };

  const toggleActivation = async (id) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.vendors}/Activate/${id}`, {
        method: 'PUT'
      });
      if (response.ok) {
        setMessage('Vendor status updated');
        fetchVendors();
      } else {
        setMessage('Error updating status');
      }
    } catch (error) {
      setMessage('Error updating status');
    }
  };

  const fetchInsights = async (id) => {
    setLoadingInsights(true);
    setInsights(null);
    setShowInsights(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.vendors}/Insights/${id}`);
      if (response.ok) {
        const data = await response.json();
        setInsights(data);
      } else {
        setMessage('Error fetching vendor insights');
      }
    } catch (error) {
      setMessage('Error fetching vendor insights');
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Vendor Management</h3>
      {message && <Alert variant="info" onClose={() => setMessage('')} dismissible>{message}</Alert>}

      <Form onSubmit={addVendor} className="mb-4 p-3 border rounded bg-light">
        <h5>Add New Vendor</h5>
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
        <Button type="submit" variant="primary">Add Vendor</Button>
      </Form>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Shop Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Activity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor.originalId}>
              <td>{vendor.name}</td>
              <td>{vendor.shopName}</td>
              <td>{vendor.email}</td>
              <td>{vendor.phone}</td>
              <td>
                <Button
                  variant={vendor.isActive ? "success" : "secondary"}
                  size="sm"
                  onClick={() => toggleActivation(vendor.originalId)}
                >
                  {vendor.isActive ? 'Active' : 'Inactive'}
                </Button>
              </td>
              <td>
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={() => fetchInsights(vendor.originalId)}
                >
                  View Insights
                </Button>
              </td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteVendor(vendor.originalId)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {vendors.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">No vendors found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Vendor Insights Modal */}
      <Modal show={showInsights} onHide={() => setShowInsights(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Vendor Industry Insights: {insights?.vendorName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingInsights ? (
            <div className="text-center p-4">Loading insights...</div>
          ) : insights ? (
            <div className="row">
              <div className="col-md-6">
                <h6>Active Categories</h6>
                <div className="d-flex flex-wrap gap-2">
                  {insights.categories.length > 0 ? (
                    insights.categories.map((cat, i) => (
                      <Badge key={i} bg="primary" pill>{cat}</Badge>
                    ))
                  ) : (
                    <span className="text-muted small italic text-sm">No categories found</span>
                  )}
                </div>
              </div>
              <div className="col-md-6 border-start">
                <h6>Active Sub-Categories</h6>
                <div className="d-flex flex-wrap gap-2">
                  {insights.subCategories.length > 0 ? (
                    insights.subCategories.map((sub, i) => (
                      <Badge key={i} bg="info" pill>{sub}</Badge>
                    ))
                  ) : (
                    <span className="text-muted small italic text-sm">No sub-categories found</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Alert variant="warning">No data available for this vendor.</Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInsights(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VendorManager;