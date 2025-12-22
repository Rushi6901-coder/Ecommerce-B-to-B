import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, ListGroup, Badge, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, user } = useAuth();
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [estimationSent, setEstimationSent] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const sendEstimation = () => {
    const estimation = {
      items: cart.map(item => ({
        ...item,
        total: item.price * item.quantity
      })),
      grandTotal: total,
      timestamp: new Date().toLocaleString(),
      shopkeeper: user.name,
      id: Date.now()
    };
    
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      type: 'estimation',
      content: estimation,
      sender: 'shopkeeper',
      timestamp: new Date().toLocaleString(),
      status: 'sent'
    }]);
    
    setEstimationSent(true);
    toast.success('Estimation sent to vendor!');
    
    // Simulate vendor response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'message',
        content: '✅ Estimation received! Let me review the prices and get back to you.',
        sender: 'vendor',
        timestamp: new Date().toLocaleString(),
        status: 'delivered'
      }]);
    }, 2000);

    setTimeout(() => {
      const revisedEstimation = {
        ...estimation,
        items: estimation.items.map(item => ({
          ...item,
          originalPrice: item.price,
          revisedPrice: Math.floor(item.price * 0.95), // 5% discount
          total: Math.floor(item.price * 0.95) * item.quantity
        })),
        grandTotal: Math.floor(total * 0.95),
        discount: '5%',
        savings: total - Math.floor(total * 0.95)
      };

      setChatMessages(prev => [...prev, {
        id: Date.now() + 2,
        type: 'revised_estimation',
        content: revisedEstimation,
        sender: 'vendor',
        timestamp: new Date().toLocaleString(),
        status: 'delivered'
      }]);
    }, 5000);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        type: 'message',
        content: newMessage,
        sender: 'shopkeeper',
        timestamp: new Date().toLocaleString(),
        status: 'sent'
      }]);
      setNewMessage('');
      
      // Show typing indicator
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responses = [
          '👍 I can offer better pricing for bulk orders.',
          '📦 Let me check the current stock availability.',
          '💰 Would you like to proceed with this revised quote?',
          '🤝 I can provide additional discount for regular customers.',
          '⚡ Fast delivery available for confirmed orders.'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setChatMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'message',
          content: randomResponse,
          sender: 'vendor',
          timestamp: new Date().toLocaleString(),
          status: 'delivered'
        }]);
      }, 1500);
    }
  };

  const acceptEstimation = (estimation) => {
    toast.success('Estimation accepted! Generating invoice...');
    setTimeout(() => {
      toast.success('Invoice generated! Redirecting to payment...');
    }, 2000);
  };

  const generateInvoice = () => {
    toast.success('Invoice generated! Payment gateway will open.');
    setTimeout(() => {
      toast.success('Payment successful! Order confirmed.');
    }, 2000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Container fluid className="py-4">
        <Row>
          <Col lg={8}>
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">🛒 Shopping Cart</h4>
              </Card.Header>
              <Card.Body>
                {cart.length === 0 ? (
                  <div className="text-center py-5">
                    <div style={{ fontSize: '4rem' }}>🛒</div>
                    <h5 className="text-muted mt-3">Your cart is empty</h5>
                    <p>Browse our categories to add products</p>
                  </div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <Table hover className="align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.map(item => (
                            <tr key={item.cartId}>
                              <td>
                                <div>
                                  <strong>{item.name}</strong>
                                  <br />
                                  <small className="text-muted">{item.description}</small>
                                  <br />
                                  <small className="text-info">Vendor: {item.vendor}</small>
                                </div>
                              </td>
                              <td>
                                <InputGroup size="sm" style={{ width: '120px' }}>
                                  <Button 
                                    variant="outline-secondary" 
                                    onClick={() => updateCartQuantity(item.cartId, Math.max(1, item.quantity - 1))}
                                  >
                                    -
                                  </Button>
                                  <Form.Control 
                                    type="number" 
                                    value={item.quantity} 
                                    min="1"
                                    className="text-center"
                                    onChange={(e) => updateCartQuantity(item.cartId, parseInt(e.target.value) || 1)}
                                  />
                                  <Button 
                                    variant="outline-secondary" 
                                    onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)}
                                  >
                                    +
                                  </Button>
                                </InputGroup>
                              </td>
                              <td className="text-success fw-bold">₹{item.price.toLocaleString()}</td>
                              <td className="text-success fw-bold">₹{(item.price * item.quantity).toLocaleString()}</td>
                              <td>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  onClick={() => {
                                    removeFromCart(item.cartId);
                                    toast.info(`${item.name} removed from cart`);
                                  }}
                                >
                                  🗑️
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                    
                    <div className="border-top pt-3">
                      <Row className="align-items-center">
                        <Col md={6}>
                          <h4 className="text-success mb-0">Grand Total: ₹{total.toLocaleString()}</h4>
                        </Col>
                        <Col md={6} className="text-end">
                          <Button 
                            variant="primary" 
                            className="me-2"
                            onClick={sendEstimation}
                            disabled={estimationSent}
                          >
                            {estimationSent ? '✅ Estimation Sent' : '📋 Send Estimation'}
                          </Button>
                          <Button 
                            variant="success" 
                            onClick={() => setShowChat(true)}
                          >
                            💬 Chat with Vendor {chatMessages.length > 0 && <Badge bg="light" text="dark">{chatMessages.length}</Badge>}
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="shadow-sm">
              <Card.Header className="bg-info text-white">
                <h6 className="mb-0">📊 Order Summary</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (GST 18%)</span>
                  <span>₹{Math.floor(total * 0.18).toLocaleString()}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Final Total</span>
                  <span className="text-success">₹{Math.floor(total * 1.18).toLocaleString()}</span>
                </div>
                {cart.length > 0 && (
                  <Button 
                    variant="warning" 
                    className="w-100 mt-3"
                    onClick={generateInvoice}
                  >
                    💳 Generate Invoice & Pay
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* WhatsApp-like Chat Modal */}
        <Modal show={showChat} onHide={() => setShowChat(false)} size="lg" fullscreen="lg-down">
          <Modal.Header className="bg-success text-white">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <div className="rounded-circle bg-white text-success d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  🏪
                </div>
              </div>
              <div>
                <Modal.Title className="mb-0">Vendor Chat</Modal.Title>
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
              {chatMessages.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <div style={{ fontSize: '3rem' }}>💬</div>
                  <p className="mt-3">No messages yet. Send an estimation to start the conversation.</p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className="mb-3">
                    {msg.type === 'estimation' ? (
                      <div className={`d-flex ${msg.sender === 'shopkeeper' ? 'justify-content-end' : 'justify-content-start'}`}>
                        <Card className="border-0 shadow-sm" style={{ maxWidth: '80%', backgroundColor: msg.sender === 'shopkeeper' ? '#dcf8c6' : 'white' }}>
                          <Card.Header className="bg-primary text-white py-2">
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
                          </Card.Body>
                        </Card>
                      </div>
                    ) : msg.type === 'revised_estimation' ? (
                      <div className="d-flex justify-content-start">
                        <Card className="border-0 shadow-sm" style={{ maxWidth: '80%', backgroundColor: 'white' }}>
                          <Card.Header className="bg-warning text-dark py-2">
                            <strong>💰 Revised Quote from Vendor</strong>
                            <small className="float-end">{msg.timestamp}</small>
                          </Card.Header>
                          <Card.Body className="p-3">
                            <div className="alert alert-success mb-3">
                              <strong>🎉 Special Discount: {msg.content.discount}</strong>
                              <br />
                              <small>You save: ₹{msg.content.savings.toLocaleString()}</small>
                            </div>
                            {msg.content.items.map(item => (
                              <div key={item.cartId} className="mb-2 pb-2 border-bottom">
                                <div className="d-flex justify-content-between">
                                  <strong>{item.name}</strong>
                                  <div className="text-end">
                                    <div className="text-decoration-line-through text-muted">₹{item.originalPrice.toLocaleString()}</div>
                                    <div className="text-success fw-bold">₹{item.revisedPrice.toLocaleString()}</div>
                                  </div>
                                </div>
                                <small className="text-muted">Qty: {item.quantity} • Total: ₹{item.total.toLocaleString()}</small>
                              </div>
                            ))}
                            <div className="mt-3 pt-2 border-top">
                              <div className="d-flex justify-content-between mb-2">
                                <span>Original Total:</span>
                                <span className="text-decoration-line-through text-muted">₹{(msg.content.grandTotal + msg.content.savings).toLocaleString()}</span>
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
                                onClick={() => acceptEstimation(msg.content)}
                              >
                                ✅ Accept Quote & Proceed
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    ) : (
                      <div className={`d-flex ${msg.sender === 'shopkeeper' ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div 
                          className={`p-3 rounded-3 shadow-sm ${
                            msg.sender === 'shopkeeper' 
                              ? 'bg-success text-white' 
                              : 'bg-white border'
                          }`}
                          style={{ maxWidth: '75%' }}
                        >
                          <div>{msg.content}</div>
                          <div className={`d-flex justify-content-between align-items-center mt-1`}>
                            <small className={msg.sender === 'shopkeeper' ? 'text-light' : 'text-muted'}>
                              {msg.timestamp}
                            </small>
                            {msg.sender === 'shopkeeper' && (
                              <small className="text-light">
                                {msg.status === 'sent' ? '✓' : '✓✓'}
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              
              {isTyping && (
                <div className="d-flex justify-content-start mb-3">
                  <div className="bg-white p-3 rounded-3 shadow-sm">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <small className="text-muted">Vendor is typing...</small>
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

export default Cart;