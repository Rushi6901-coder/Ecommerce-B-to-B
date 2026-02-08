import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Badge, ListGroup, InputGroup, Nav, ButtonGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { API_ENDPOINTS } from '../../config/api';
import { toast } from 'react-toastify';
import { orderService } from '../../services/orderService';
import VendorProductManager from './VendorProductManager';
import VendorOrderManagement from './VendorOrderManagement';
import VendorProfile from './VendorProfile';
import VendorCustomers from './VendorCustomers'; // New component we will create

const VendorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Analytics State
  const [timeFilter, setTimeFilter] = useState('ALL'); // '1M', '2M', '6M', 'ALL'
  const [stats, setStats] = useState({
    totalSales: 0,
    totalEarnings: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    topProducts: []
  });

  useEffect(() => {
    fetchCategories();
    if (user?.id) {
      fetchProducts();
    }
  }, [user]);

  // Fetch orders separately for analytics
  useEffect(() => {
    if (user?.vendorId) {
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    calculateStats();
  }, [orders, timeFilter]);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getVendorOrders(user.vendorId);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching vendor orders:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.categories);
      if (response.ok) {
        const data = await response.json();
        // Simply set categories, skipping the seed logic for now to keep it clean
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.vendorProducts}/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const calculateStats = () => {
    const now = new Date();
    let filterDate = new Date(0); // Default to epoch (ALL)

    if (timeFilter === '1M') {
      filterDate = new Date();
      filterDate.setMonth(now.getMonth() - 1);
    } else if (timeFilter === '2M') {
      filterDate = new Date();
      filterDate.setMonth(now.getMonth() - 2);
    } else if (timeFilter === '6M') {
      filterDate = new Date();
      filterDate.setMonth(now.getMonth() - 6);
    }

    // Filter orders based on date
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= filterDate;
    });

    // Calculate stats
    const totalSales = filteredOrders.length;

    // For earnings, assumes 'totalAmount' is avail and we count all except cancelled
    const validOrders = filteredOrders.filter(o => o.status !== 'CANCELLED');
    const totalEarnings = validOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Unique customers (shopkeepers)
    const uniqueCustomers = new Set(validOrders.map(o => o.shopkeeper?.id).filter(id => id)).size;

    const pendingOrders = filteredOrders.filter(o => o.status === 'PENDING').length;
    const confirmedOrders = filteredOrders.filter(o => o.status === 'CONFIRMED').length;

    // Calculate Top Products
    const productMap = {};
    validOrders.forEach(order => {
      order.orderItems?.forEach(item => {
        if (!item.product) return;
        const pId = item.product.id;
        if (!productMap[pId]) {
          productMap[pId] = {
            id: pId,
            name: item.product.productName || item.product.name,
            image: item.product.photoLink || item.product.image,
            qty: 0,
            earnings: 0
          };
        }
        productMap[pId].qty += item.quantity;
        productMap[pId].earnings += (item.price * item.quantity);
      });
    });

    const topProducts = Object.values(productMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10);

    setStats({
      totalSales,
      totalEarnings,
      totalCustomers: uniqueCustomers,
      pendingOrders,
      confirmedOrders,
      topProducts
    });
  };

  return (
    <div className="page-container">
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h2>🏪 Vendor Dashboard</h2>
            <Nav variant="tabs" className="mt-3">
              <Nav.Item>
                <Nav.Link active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
                  📊 Dashboard
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link active={activeTab === 'products'} onClick={() => setActiveTab('products')}>
                  📦 Products
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
                  📋 Orders
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link active={activeTab === 'customers'} onClick={() => setActiveTab('customers')}>
                  👥 Customers
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
                  👤 Profile
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>

        {activeTab === 'dashboard' && (
          <>
            <Row className="mb-4 align-items-center">
              <Col>
                <h4>Analytics Overview</h4>
              </Col>
              <Col xs="auto">
                <ButtonGroup>
                  <Button variant={timeFilter === '1M' ? 'primary' : 'outline-primary'} onClick={() => setTimeFilter('1M')}>1 Month</Button>
                  <Button variant={timeFilter === '2M' ? 'primary' : 'outline-primary'} onClick={() => setTimeFilter('2M')}>2 Months</Button>
                  <Button variant={timeFilter === '6M' ? 'primary' : 'outline-primary'} onClick={() => setTimeFilter('6M')}>6 Months</Button>
                  <Button variant={timeFilter === 'ALL' ? 'primary' : 'outline-primary'} onClick={() => setTimeFilter('ALL')}>All Time</Button>
                </ButtonGroup>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col md={3}>
                <Card className="text-center shadow-sm h-100 border-primary">
                  <Card.Body>
                    <h3 className="text-primary">{stats.totalSales}</h3>
                    <p className="mb-0">📦 Total Orders</p>
                    <small className="text-muted">In selected period</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm h-100 border-success">
                  <Card.Body>
                    <h3 className="text-success">₹{stats.totalEarnings.toLocaleString()}</h3>
                    <p className="mb-0">💰 Total Earnings</p>
                    <small className="text-muted">In selected period</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm h-100 border-info">
                  <Card.Body>
                    <h3 className="text-info">{stats.totalCustomers}</h3>
                    <p className="mb-0">👥 Total Customers</p>
                    <small className="text-muted">Unique Shopkeepers</small>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-around">
                      <div>
                        <h4 className="text-warning">{stats.pendingOrders}</h4>
                        <small>Pending</small>
                      </div>
                      <div className="vr"></div>
                      <div>
                        <h4 className="text-success">{stats.confirmedOrders}</h4>
                        <small>Confirmed</small>
                      </div>
                    </div>
                    <p className="mt-2 mb-0">Order Status</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Card className="shadow-sm">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">🏆 Top 10 Most Selling Products</h5>
                  </Card.Header>
                  <Table responsive hover className="mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Product</th>
                        <th className="text-center">Quantity Sold</th>
                        <th className="text-end">Total Earnings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.topProducts.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-4">No sales data available for this period.</td>
                        </tr>
                      ) : (
                        stats.topProducts.map((product, index) => (
                          <tr key={product.id}>
                            <td>
                              <Badge bg={index < 3 ? "warning" : "secondary"} text={index < 3 ? "dark" : "light"} pill>
                                {index + 1}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                {product.image && (
                                  <img src={product.image} alt="" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4, marginRight: 10 }} />
                                )}
                                <span className="fw-medium">{product.name}</span>
                              </div>
                            </td>
                            <td className="text-center"><strong>{product.qty}</strong></td>
                            <td className="text-end text-success fw-bold">₹{product.earnings.toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {activeTab === 'products' && <VendorProductManager />}
        {activeTab === 'orders' && <VendorOrderManagement />}
        {activeTab === 'customers' && <VendorCustomers orders={orders} />}
        {activeTab === 'profile' && <VendorProfile />}

      </Container>
    </div>
  );
};

export default VendorDashboard;