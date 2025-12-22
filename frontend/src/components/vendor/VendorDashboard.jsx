import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Badge, ListGroup, InputGroup } from 'react-bootstrap';
import { categories } from '../../data/demoData';
import { toast } from 'react-toastify';

const VendorDashboard = () => {
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

  const sendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        type: 'message',
        content: newMessage,
        sender: 'vendor',
        timestamp: new Date().toLocaleString(),
        status: 'sent'
      }]);
      setNewMessage('');
      toast.success('Message sent!');
      
      // Simulate shopkeeper response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responses = [
          '👍 Sounds good! When can you deliver?',
          '💰 Can you provide any additional discount?',
          '✅ Perfect! Let\'s proceed with this order.',
          '📦 Do you have these items in stock?'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'message',
          content: randomResponse,
          sender: 'shopkeeper',
          timestamp: new Date().toLocaleString(),
          status: 'delivered'
        }]);
      }, 1500);
    }
  };

  const startEditingEstimation = (estimation) => {
    setEditingEstimation({
      ...estimation.content,
      items: estimation.content.items.map(item => ({
        ...item,
        revisedPrice: item.price,
        revisedTotal: item.total
      }))
    });
  };

  const updateItemPrice = (cartId, newPrice) => {
    setEditingEstimation(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.cartId === cartId 
          ? { 
              ...item, 
              revisedPrice: parseFloat(newPrice) || 0,
              revisedTotal: (parseFloat(newPrice) || 0) * item.quantity
            }
          : item
      )
    }));
  };

  const sendRevisedEstimation = () => {
    const originalTotal = editingEstimation.grandTotal;
    const revisedTotal = editingEstimation.items.reduce((sum, item) => sum + item.revisedTotal, 0);
    const savings = originalTotal - revisedTotal;
    const discountPercent = ((savings / originalTotal) * 100).toFixed(1);

    const revisedEstimation = {
      ...editingEstimation,
      items: editingEstimation.items.map(item => ({
        ...item,
        originalPrice: item.price,
        price: item.revisedPrice,
        total: item.revisedTotal
      })),
      originalTotal: originalTotal,
      grandTotal: revisedTotal,
      discount: `${discountPercent}%`,
      savings: savings
    };

    setChatMessages(prev => [...prev, {
      id: Date.now(),
      type: 'revised_estimation',
      content: revisedEstimation,
      sender: 'vendor',
      timestamp: new Date().toLocaleString(),
      status: 'sent'
    }]);

    setEditingEstimation(null);
    toast.success('Revised estimation sent!');
  };

  const generateInvoice = (estimation) => {
    toast.success('Generating final invoice...');
    setTimeout(() => {
      toast.success('Invoice generated and sent to shopkeeper!');
    }, 1500);
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
          </Col>
        </Row>
        
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

        {/* WhatsApp-like Chat Modal */}
        <Modal show={showChat} onHide={() => setShowChat(false)} size="lg" fullscreen="lg-down">
          <Modal.Header className="bg-success text-white">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <div className="rounded-circle bg-white text-success d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  🛒
                </div>
              </div>
              <div>
                <Modal.Title className="mb-0">Shopkeeper Chat</Modal.Title>
                <small>🔒 End-to-end encrypted • Online</small>
              </div>
            </div>
            <Button variant="outline-light" onClick={() => setShowChat(false)}>✕</Button>
          </Modal.Header>
          <Modal.Body className="p-0" style={{ backgroundColor: '#e5ddd5' }}>
            <div 
              style={{ 
                height: '500px', 
                overflowY: 'auto',
                padding: '15px',
                backgroundColor: '#e5ddd5'
              }}
            >
              {chatMessages.map((msg) => (
                <div key={msg.id} className="mb-3">
                  {msg.type === 'estimation' ? (
                    <div className="d-flex justify-content-start">
                      <Card className="border-0 shadow-sm" style={{ maxWidth: '80%', backgroundColor: 'white' }}>
                        <Card.Header className="bg-info text-white py-2">
                          <strong>📋 Estimation from {msg.content.shopkeeper}</strong>
                          <small className="float-end">{msg.timestamp}</small>
                        </Card.Header>
                        <Card.Body className="p-3">
                          {msg.content.items.map(item => (
                            <div key={item.cartId} className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                              <div>
                                <strong>{item.name}</strong>
                                <br />
                                <small className="text-muted">Qty: {item.quantity}</small>
                              </div>
                              <div className="text-end">
                                <div className="text-success fw-bold">₹{item.total.toLocaleString()}</div>
                              </div>
                            </div>
                          ))}
                          <div className="mt-3 pt-2 border-top">
                            <div className="d-flex justify-content-between">
                              <strong>Grand Total:</strong>
                              <strong className="text-success">₹{msg.content.grandTotal.toLocaleString()}</strong>
                            </div>
                          </div>
                          <div className="mt-3">
                            <Button 
                              variant="warning" 
                              className="w-100"
                              onClick={() => startEditingEstimation(msg)}
                            >
                              ✏️ Edit & Send Revised Quote
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  ) : msg.type === 'revised_estimation' ? (
                    <div className="d-flex justify-content-end">
                      <Card className="border-0 shadow-sm" style={{ maxWidth: '80%', backgroundColor: '#dcf8c6' }}>
                        <Card.Header className="bg-warning text-dark py-2">
                          <strong>💰 Revised Quote</strong>
                          <small className="float-end">{msg.timestamp}</small>
                        </Card.Header>
                        <Card.Body className="p-3">
                          <div className="alert alert-success mb-3">
                            <strong>🎉 Special Discount: {msg.content.discount}</strong>
                            <br />
                            <small>Savings: ₹{msg.content.savings.toLocaleString()}</small>
                          </div>
                          {msg.content.items.map(item => (
                            <div key={item.cartId} className="mb-2 pb-2 border-bottom">
                              <div className="d-flex justify-content-between">
                                <strong>{item.name}</strong>
                                <div className="text-end">
                                  <div className="text-decoration-line-through text-muted">₹{item.originalPrice.toLocaleString()}</div>
                                  <div className="text-success fw-bold">₹{item.price.toLocaleString()}</div>
                                </div>
                              </div>
                              <small className="text-muted">Qty: {item.quantity} • Total: ₹{item.total.toLocaleString()}</small>
                            </div>
                          ))}
                          <div className="mt-3 pt-2 border-top">
                            <div className="d-flex justify-content-between mb-2">
                              <span>Original Total:</span>
                              <span className="text-decoration-line-through text-muted">₹{msg.content.originalTotal.toLocaleString()}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <strong>Revised Total:</strong>
                              <strong className="text-success">₹{msg.content.grandTotal.toLocaleString()}</strong>
                            </div>
                          </div>
                          <div className="mt-3">
                            <Button 
                              variant="success" 
                              className="w-100"
                              onClick={() => generateInvoice(msg.content)}
                            >
                              📄 Generate Final Invoice
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  ) : (
                    <div className={`d-flex ${msg.sender === 'vendor' ? 'justify-content-end' : 'justify-content-start'}`}>
                      <div 
                        className={`p-3 rounded-3 shadow-sm ${
                          msg.sender === 'vendor' 
                            ? 'bg-success text-white' 
                            : 'bg-white border'
                        }`}
                        style={{ maxWidth: '75%' }}
                      >
                        <div>{msg.content}</div>
                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <small className={msg.sender === 'vendor' ? 'text-light' : 'text-muted'}>
                            {msg.timestamp}
                          </small>
                          {msg.sender === 'vendor' && (
                            <small className="text-light">
                              {msg.status === 'sent' ? '✓' : '✓✓'}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="d-flex justify-content-start mb-3">
                  <div className="bg-white p-3 rounded-3 shadow-sm">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <small className="text-muted">Shopkeeper is typing...</small>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-white border-top">
              <Form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ borderRadius: '25px 0 0 25px' }}
                  />
                  <Button 
                    variant="success" 
                    type="submit"
                    style={{ borderRadius: '0 25px 25px 0' }}
                  >
                    📤
                  </Button>
                </InputGroup>
              </Form>
            </div>
          </Modal.Body>
        </Modal>

        {/* Edit Estimation Modal */}
        <Modal show={!!editingEstimation} onHide={() => setEditingEstimation(null)} size="lg">
          <Modal.Header closeButton className="bg-warning">
            <Modal.Title>✏️ Edit Estimation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editingEstimation && (
              <>
                <h6 className="mb-3">Adjust prices for {editingEstimation.shopkeeper}</h6>
                <Table striped bordered>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Original Price</th>
                      <th>New Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editingEstimation.items.map(item => (
                      <tr key={item.cartId}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td className="text-muted">₹{item.price.toLocaleString()}</td>
                        <td>
                          <Form.Control
                            type="number"
                            value={item.revisedPrice}
                            onChange={(e) => updateItemPrice(item.cartId, e.target.value)}
                            size="sm"
                          />
                        </td>
                        <td className="text-success fw-bold">₹{item.revisedTotal.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="d-flex justify-content-between align-items-center mt-3 p-3 bg-light rounded">
                  <div>
                    <div>Original Total: <span className="text-decoration-line-through">₹{editingEstimation.grandTotal.toLocaleString()}</span></div>
                    <div className="fw-bold text-success">
                      Revised Total: ₹{editingEstimation.items.reduce((sum, item) => sum + item.revisedTotal, 0).toLocaleString()}
                    </div>
                    <div className="text-info">
                      Discount: ₹{(editingEstimation.grandTotal - editingEstimation.items.reduce((sum, item) => sum + item.revisedTotal, 0)).toLocaleString()}
                    </div>
                  </div>
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditingEstimation(null)}>Cancel</Button>
            <Button variant="success" onClick={sendRevisedEstimation}>
              📤 Send Revised Estimation
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
      
      <style>
        {`
          .typing-indicator {
            display: flex;
            align-items: center;
            gap: 3px;
            margin-bottom: 5px;
          }
          .typing-indicator span {
            height: 8px;
            width: 8px;
            background-color: #999;
            border-radius: 50%;
            animation: typing 1.4s infinite ease-in-out;
          }
          .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
          .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
          @keyframes typing {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default VendorDashboard;