import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Badge, ListGroup, InputGroup, Nav } from 'react-bootstrap';
import { categories } from '../../data/demoData';
import { toast } from 'react-toastify';
import VendorProductManager from './VendorProductManager';

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([
    { id: 1, shopkeeper: 'John Doe', items: 2, total: 154998, status: 'Pending', date: '2024-01-15' },
    { id: 2, shopkeeper: 'Mike Johnson', items: 1, total: 79999, status: 'Confirmed', date: '2024-01-14' }
  ]);
  
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'estimation',
      content: {
        shopkeeper: 'John Doe',
        items: [
          { cartId: 1, name: 'iPhone 15', price: 79999, quantity: 1, total: 79999 }
        ],
        grandTotal: 79999,
        id: 1
      },
      sender: 'shopkeeper',
      timestamp: '2024-01-15 10:30 AM',
      status: 'delivered'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [editingEstimation, setEditingEstimation] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    subcategory: ''
  });

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.category) {
      const categoryName = categories.find(c => c.id === parseInt(newProduct.category))?.name || '';
      const subcategoryName = categories
        .find(c => c.id === parseInt(newProduct.category))
        ?.subcategories.find(s => s.id === parseInt(newProduct.subcategory))?.name || '';
      
      setProducts(prev => [...prev, {
        ...newProduct,
        id: Date.now(),
        price: parseFloat(newProduct.price),
        categoryName,
        subcategoryName
      }]);
      
      setNewProduct({ name: '', price: '', description: '', category: '', subcategory: '' });
      setShowAddProduct(false);
      toast.success('Product added successfully!');
    } else {
      toast.error('Please fill all required fields');
    }
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
    toast.success(`Order ${status.toLowerCase()}!`);
  };

  const selectedCategory = categories.find(c => c.id === parseInt(newProduct.category));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h2>🏪 Vendor Dashboard</h2>
            <Nav variant="tabs" className="mt-3">
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'dashboard'} 
                  onClick={() => setActiveTab('dashboard')}
                >
                  📊 Dashboard
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'products'} 
                  onClick={() => setActiveTab('products')}
                >
                  📦 Product Manager
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        
        {activeTab === 'products' ? (
          <VendorProductManager />
        ) : (
          <>
            <Row className="mb-4">
              <Col md={3}>
                <Card className="text-center shadow-sm">
                  <Card.Body>
                    <h3 className="text-primary">{products.length}</h3>
                    <p className="mb-0">📦 Total Products</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm">
                  <Card.Body>
                    <h3 className="text-success">{orders.filter(o => o.status === 'Confirmed').length}</h3>
                    <p className="mb-0">✅ Confirmed Orders</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm">
                  <Card.Body>
                    <h3 className="text-warning">{orders.filter(o => o.status === 'Pending').length}</h3>
                    <p className="mb-0">⏳ Pending Orders</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="text-center shadow-sm">
                  <Card.Body>
                    <h3 className="text-info">{chatMessages.length}</h3>
                    <p className="mb-0">💬 Chat Messages</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col lg={6}>
                <Card className="shadow-sm">
                  <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">📦 Product Management</h6>
                    <Button variant="light" size="sm" onClick={() => setShowAddProduct(true)}>
                      + Add Product
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    {products.length === 0 ? (
                      <p className="text-muted text-center py-3">No products added yet.</p>
                    ) : (
                      <div className="table-responsive">
                        <Table striped hover size="sm">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Price</th>
                              <th>Category</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.slice(0, 5).map(product => (
                              <tr key={product.id}>
                                <td>{product.name}</td>
                                <td className="text-success">₹{product.price.toLocaleString()}</td>
                                <td><small>{product.categoryName}</small></td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        {products.length > 5 && (
                          <small className="text-muted">Showing 5 of {products.length} products</small>
                        )}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={6}>
                <Card className="shadow-sm">
                  <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">📋 Recent Orders</h6>
                    <Button variant="light" size="sm" onClick={() => setShowChat(true)}>
                      💬 Open Chat {chatMessages.length > 0 && <Badge bg="danger">{chatMessages.length}</Badge>}
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <div className="table-responsive">
                      <Table striped hover size="sm">
                        <thead>
                          <tr>
                            <th>Shopkeeper</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map(order => (
                            <tr key={order.id}>
                              <td>{order.shopkeeper}</td>
                              <td className="text-success">₹{order.total.toLocaleString()}</td>
                              <td>
                                <Badge bg={order.status === 'Confirmed' ? 'success' : 'warning'}>
                                  {order.status}
                                </Badge>
                              </td>
                              <td>
                                {order.status === 'Pending' && (
                                  <Button 
                                    variant="outline-success" 
                                    size="sm"
                                    onClick={() => updateOrderStatus(order.id, 'Confirmed')}
                                  >
                                    ✓
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {/* Add Product Modal */}
        <Modal show={showAddProduct} onHide={() => setShowAddProduct(false)} size="lg">
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Add New Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Product Name *</Form.Label>
                    <Form.Control
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Enter product name"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price *</Form.Label>
                    <Form.Control
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="Enter price"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category *</Form.Label>
                    <Form.Select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value, subcategory: ''})}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  {selectedCategory && (
                    <Form.Group className="mb-3">
                      <Form.Label>Subcategory</Form.Label>
                      <Form.Select
                        value={newProduct.subcategory}
                        onChange={(e) => setNewProduct({...newProduct, subcategory: e.target.value})}
                      >
                        <option value="">Select Subcategory</option>
                        {selectedCategory.subcategories.map(sub => (
                          <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  )}
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Enter product description"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddProduct(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddProduct}>Add Product</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default VendorDashboard;