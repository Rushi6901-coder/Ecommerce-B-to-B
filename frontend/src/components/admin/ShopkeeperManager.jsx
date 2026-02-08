import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Modal } from 'react-bootstrap';
import api from '../../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShopkeeperManager = () => {
  const [shopkeepers, setShopkeepers] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedShopkeeper, setSelectedShopkeeper] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    shopName: '',
    shopAddress: '',
    licenseNumber: ''
  });

  const fetchShopkeepers = async () => {
    try {
      const response = await api.get('/users/shopkeepers');
      setShopkeepers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error(`Error fetching shopkeepers: ${error.message}`, { position: "top-center" });
    }
  };

  const deleteShopkeeper = async (id) => {
    if (window.confirm('Are you sure you want to delete this shopkeeper? This will remove all their orders and cart items.')) {
      try {
        await api.delete(`/users/shopkeepers/${id}`);
        toast.success('Shopkeeper deleted successfully', { position: "top-center" });
        fetchShopkeepers();
      } catch (error) {
        toast.error('Error deleting shopkeeper', { position: "top-center" });
      }
    }
  };

  const openUpdateModal = (shopkeeper) => {
    setSelectedShopkeeper(shopkeeper);
    setUpdateForm({
      shopName: shopkeeper.shopName || '',
      shopAddress: shopkeeper.shopAddress || '',
      licenseNumber: shopkeeper.licenseNumber || ''
    });
    setShowUpdateModal(true);
  };

  const handleUpdate = async () => {
    try {
      // Update user info
      await api.put(`/users/${selectedShopkeeper.userId}`, {
        name: selectedShopkeeper.userName,
        phone: selectedShopkeeper.userPhone,
        address: selectedShopkeeper.userAddress
      });

      // Update shopkeeper specific info
      await api.put(`/shopkeeper/${selectedShopkeeper.id}`, {
        shopName: updateForm.shopName,
        shopAddress: updateForm.shopAddress,
        licenseNumber: updateForm.licenseNumber
      });

      toast.success('Shopkeeper updated successfully', { position: "top-center" });
      setShowUpdateModal(false);
      fetchShopkeepers();
    } catch (error) {
      toast.error('Error updating shopkeeper', { position: "top-center" });
    }
  };

  useEffect(() => {
    fetchShopkeepers();
  }, []);

  return (
    <div className="container mt-4">
      <ToastContainer position="top-center" />
      <h3>Shopkeeper Management</h3>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Shop Name</th>
            <th>Owner Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Shop Address</th>
            <th>License Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shopkeepers.map((shopkeeper) => (
            <tr key={shopkeeper.id}>
              <td>{shopkeeper.id}</td>
              <td><strong>{shopkeeper.shopName || 'N/A'}</strong></td>
              <td>{shopkeeper.userName || 'N/A'}</td>
              <td>{shopkeeper.userEmail || 'N/A'}</td>
              <td>{shopkeeper.userPhone || 'N/A'}</td>
              <td>{shopkeeper.shopAddress || shopkeeper.userAddress || 'N/A'}</td>
              <td><code>{shopkeeper.licenseNumber || 'N/A'}</code></td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => openUpdateModal(shopkeeper)}
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteShopkeeper(shopkeeper.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {shopkeepers.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center">No shopkeepers found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Update Shopkeeper Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Shopkeeper</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Shop Name</Form.Label>
              <Form.Control
                type="text"
                value={updateForm.shopName}
                onChange={(e) => setUpdateForm({ ...updateForm, shopName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Shop Address</Form.Label>
              <Form.Control
                type="text"
                value={updateForm.shopAddress}
                onChange={(e) => setUpdateForm({ ...updateForm, shopAddress: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>License Number</Form.Label>
              <Form.Control
                type="text"
                value={updateForm.licenseNumber}
                onChange={(e) => setUpdateForm({ ...updateForm, licenseNumber: e.target.value })}
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

export default ShopkeeperManager;