import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Modal, Badge } from 'react-bootstrap';
import api from '../../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VendorManager = () => {
  const [vendors, setVendors] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    businessName: '',
    businessCategory: '',
    gstNumber: ''
  });

  const fetchVendors = async () => {
    try {
      const response = await api.get('/users/vendors');
      setVendors(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error(`Error fetching vendors: ${error.message}`, { position: "top-center" });
    }
  };

  const deleteVendor = async (id) => {
    if (window.confirm('Are you sure you want to delete this vendor? This will remove all their products and orders.')) {
      try {
        await api.delete(`/users/vendors/${id}`);
        toast.success('Vendor deleted successfully', { position: "top-center" });
        fetchVendors();
      } catch (error) {
        toast.error('Error deleting vendor', { position: "top-center" });
      }
    }
  };

  const openUpdateModal = (vendor) => {
    setSelectedVendor(vendor);
    setUpdateForm({
      businessName: vendor.businessName || '',
      businessCategory: vendor.businessCategory || '',
      gstNumber: vendor.gstNumber || ''
    });
    setShowUpdateModal(true);
  };

  const handleUpdate = async () => {
    try {
      // Update user info
      await api.put(`/users/${selectedVendor.userId}`, {
        name: selectedVendor.userName,
        phone: selectedVendor.userPhone,
        address: selectedVendor.userAddress
      });

      // Update vendor specific info
      await api.put(`/vendor/${selectedVendor.id}`, {
        businessName: updateForm.businessName,
        businessCategory: updateForm.businessCategory,
        gstNumber: updateForm.gstNumber
      });

      toast.success('Vendor updated successfully', { position: "top-center" });
      setShowUpdateModal(false);
      fetchVendors();
    } catch (error) {
      toast.error('Error updating vendor', { position: "top-center" });
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="container mt-4">
      <ToastContainer position="top-center" />
      <h3>Vendor Management</h3>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Business Name</th>
            <th>Owner Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Category</th>
            <th>GST Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor.id}>
              <td>{vendor.id}</td>
              <td><strong>{vendor.businessName || 'N/A'}</strong></td>
              <td>{vendor.userName || 'N/A'}</td>
              <td>{vendor.userEmail || 'N/A'}</td>
              <td>{vendor.userPhone || 'N/A'}</td>
              <td>
                <Badge bg="info">{vendor.businessCategory || 'Uncategorized'}</Badge>
              </td>
              <td><code>{vendor.gstNumber || 'N/A'}</code></td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => openUpdateModal(vendor)}
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteVendor(vendor.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {vendors.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center">No vendors found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Update Vendor Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Vendor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Business Name</Form.Label>
              <Form.Control
                type="text"
                value={updateForm.businessName}
                onChange={(e) => setUpdateForm({ ...updateForm, businessName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Business Category</Form.Label>
              <Form.Control
                type="text"
                value={updateForm.businessCategory}
                onChange={(e) => setUpdateForm({ ...updateForm, businessCategory: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>GST Number</Form.Label>
              <Form.Control
                type="text"
                value={updateForm.gstNumber}
                onChange={(e) => setUpdateForm({ ...updateForm, gstNumber: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdate}>Update</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VendorManager;