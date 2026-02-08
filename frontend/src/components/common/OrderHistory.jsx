import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Button, Table, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import LoadingSpinner from '../common/LoadingSpinner';
import OrderDetailsModal from './OrderDetailsModal';
import './OrderHistory.css';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        let data = [];
        if (user?.role === 'shopkeeper') {
          // Ensure shopkeeperId exists. In some auth context implementations it might be nested or named differently.
          // Based on ShopkeeperOrderHistory.jsx it seemed to be user.shopkeeperId
          if (user.shopkeeperId) {
            data = await orderService.getShopkeeperOrders(user.shopkeeperId);
          }
        } else if (user?.role === 'vendor') {
          // Similarly for vendor
          if (user.vendorId) {
            data = await orderService.getVendorOrders(user.vendorId);
          }
        }
        setOrders(data);
      } catch (err) {
        setError('Failed to fetch orders. ' + (err.response?.data?.message || err.message));
        console.error("Order fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED':
      case 'COMPLETED': return 'success';
      case 'SHIPPED': return 'primary';
      case 'CONFIRMED': return 'info';
      case 'PENDING':
      case 'PROCESSING': return 'warning';
      case 'CANCELLED': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <LoadingSpinner message="Loading orders..." />;
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="order-page-container">
      <Container className="py-4">
        {user?.role === 'shopkeeper' && (
          <>
            <div className="order-header mb-4">
              <h2>My Orders</h2>
            </div>
            {orders.length === 0 ? (
              <Alert variant="info">No orders found.</Alert>
            ) : (
              <Row>
                {orders.map(order => (
                  <Col md={6} key={order.id} className="mb-3">
                    <Card className="order-card h-100 shadow-sm">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="mb-0">Order #{order.id}</h5>
                          <Badge bg={getStatusColor(order.status)}>{order.status}</Badge>
                        </div>
                        <p className="text-muted mb-2">Date: {formatDate(order.orderDate)}</p>
                        <p className="mb-3">
                          <strong>Vendor:</strong> {order.vendor?.shopName || 'Unknown Vendor'}<br />
                          <strong>Items:</strong> {order.orderItems?.length || 0} | <strong>Total:</strong> ₹{order.totalAmount}
                        </p>
                        <Button variant="outline-primary" size="sm" onClick={() => handleShowDetails(order)}>View Details</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}

        {user?.role === 'vendor' && (
          <>
            <div className="order-header mb-4">
              <h2>Order Management</h2>
            </div>
            {orders.length === 0 ? (
              <Alert variant="info">No orders found.</Alert>
            ) : (
              <Card className="order-card shadow-sm">
                <Card.Body>
                  <Table responsive hover className="order-table" size="sm">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Shopkeeper</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.shopkeeper?.shopName || 'Unknown'}</td>
                          <td>{formatDate(order.orderDate)}</td>
                          <td>{order.orderItems?.length || 0}</td>
                          <td>₹{order.totalAmount}</td>
                          <td>
                            <Badge bg={getStatusColor(order.status)}>{order.status}</Badge>
                          </td>
                          <td>
                            <Button variant="outline-primary" size="sm" onClick={() => handleShowDetails(order)}>Manage</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}
          </>
        )}

        {!user?.role && (
          <div className="alert alert-info text-center">
            <h5>Order History</h5>
            <p>Order history is available for shopkeepers and vendors only.</p>
          </div>
        )}

        <OrderDetailsModal
          show={showModal}
          onHide={handleCloseModal}
          order={selectedOrder}
        />
      </Container>
    </div>
  );
};

export default OrderHistory;