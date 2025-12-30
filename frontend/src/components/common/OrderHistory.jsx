import React from 'react';
import { Container, Card, Row, Col, Badge, Button, Table } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import './OrderHistory.css';

const OrderHistory = () => {
  const { user } = useAuth();

  const shopkeeperOrders = [
    { id: 'ORD001', date: '2024-01-15', status: 'Delivered', total: 2500, items: 3 },
    { id: 'ORD002', date: '2024-01-10', status: 'Processing', total: 1800, items: 2 }
  ];

  const vendorOrders = [
    { id: 'ORD001', customer: 'ABC Store', date: '2024-01-15', status: 'Completed', amount: 15000, items: 5 },
    { id: 'ORD002', customer: 'XYZ Mart', date: '2024-01-12', status: 'Processing', amount: 8500, items: 3 }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered':
      case 'Completed': return 'success';
      case 'Processing': return 'warning';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  if (user?.role === 'shopkeeper') {
    return (
      <div className="order-page-container">
        <Container className="py-4">
          <div className="order-header">
            <h2>My Orders</h2>
          </div>
          <Row>
            {shopkeeperOrders.map(order => (
              <Col md={6} key={order.id} className="mb-3">
                <Card className="order-card">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5>Order #{order.id}</h5>
                      <Badge bg={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>
                    <p className="text-muted">Date: {order.date}</p>
                    <p>Items: {order.items} | Total: ₹{order.total}</p>
                    <Button variant="outline-primary" size="sm">View Details</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    );
  }

  if (user?.role === 'vendor') {
    return (
      <div className="order-page-container">
        <Container className="py-4">
          <div className="order-header">
            <h2>Order Management</h2>
          </div>
          <Card className="order-card">
            <Card.Body>
              <Table responsive hover className="order-table" size="sm">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorOrders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td>{order.items}</td>
                      <td>₹{order.amount}</td>
                      <td>
                        <Badge bg={getStatusColor(order.status)}>{order.status}</Badge>
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm">Manage</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="order-page-container">
      <Container className="py-4">
        <div className="alert alert-info text-center">
          <h5>Order History</h5>
          <p>Order history is available for shopkeepers and vendors only.</p>
        </div>
      </Container>
    </div>
  );
};

export default OrderHistory;