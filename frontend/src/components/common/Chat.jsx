import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, ListGroup, Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { chatService } from '../../services/chatService';

const Chat = () => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceData, setInvoiceData] = useState({ amount: '', content: '', type: 'Invoice' });
  
  const [chats] = useState([
    {
      id: 1,
      name: user?.role === 'shopkeeper' ? 'Apple Store' : 'John Doe',
      role: user?.role === 'shopkeeper' ? 'vendor' : 'shopkeeper',
      lastMessage: 'Thanks for your inquiry!',
      time: '2 min ago',
      unread: 3,
      online: true
    },
    {
      id: 2,
      name: user?.role === 'shopkeeper' ? 'Samsung Store' : 'Jane Smith',
      role: user?.role === 'shopkeeper' ? 'vendor' : 'shopkeeper',
      lastMessage: 'Product is available',
      time: '5 min ago',
      unread: 1,
      online: false
    }
  ]);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'other',
      content: 'Hello! I saw your inquiry about the iPhone 15. We have it in stock.',
      time: '10:30 AM',
      type: 'text'
    },
    {
      id: 2,
      sender: 'me',
      content: 'Great! What\'s the best price you can offer?',
      time: '10:32 AM',
      type: 'text'
    },
    {
      id: 3,
      sender: 'other',
      content: 'For bulk orders, I can offer ₹75,999 per unit. Minimum 10 units.',
      time: '10:35 AM',
      type: 'text'
    },
    {
      id: 4,
      sender: 'other',
      content: 'Invoice for 10 iPhone 15 units',
      time: '10:40 AM',
      type: 'Invoice',
      amount: 759990,
      orderId: 123
    }
  ]);

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        const messageData = {
          chatRoomId: activeChat.id,
          senderId: user?.id || 1,
          senderRole: user?.role || 'shopkeeper',
          content: message
        };
        
        await chatService.sendTextMessage(messageData);
        
        const newMessage = {
          id: Date.now(),
          sender: 'me',
          content: message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text'
        };
        
        setMessages(prev => [...prev, newMessage]);
        setMessage('');
      } catch (error) {
        console.error('Send message error:', error);
        toast.error('Failed to send message');
      }
    }
  };

  const sendInvoice = async () => {
    if (!invoiceData.amount || !invoiceData.content) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const invoicePayload = {
        chatRoomId: activeChat.id,
        vendorId: user?.id || 1,
        shopkeeperId: 2,
        totalAmount: parseFloat(invoiceData.amount),
        messageType: invoiceData.type,
        content: invoiceData.content
      };

      await chatService.sendInvoice(invoicePayload);

      const newMessage = {
        id: Date.now(),
        sender: 'me',
        content: invoiceData.content,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: invoiceData.type,
        amount: parseFloat(invoiceData.amount)
      };

      setMessages(prev => [...prev, newMessage]);
      setShowInvoiceModal(false);
      setInvoiceData({ amount: '', content: '', type: 'Invoice' });
      toast.success(`${invoiceData.type} sent successfully!`);
    } catch (error) {
      console.error('Send invoice error:', error);
      if (error.message?.includes('No estimation found')) {
        toast.error('Send estimation first before invoice');
      } else {
        toast.error('Failed to send invoice');
      }
    }
  };

  return (
    <div style={{ height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Container fluid className="h-100 p-0">
        <Row className="h-100 g-0">
          {/* Chat List */}
          <Col xs={12} md={4} className="border-end">
            <div className="bg-white h-100 d-flex flex-column">
              {/* Header */}
              <div className="p-3 border-bottom bg-light">
                <h5 className="mb-0 text-dark">Chats</h5>
              </div>
              
              {/* Chat List */}
              <div className="flex-grow-1 overflow-auto">
                {chats.map(chat => (
                  <div 
                    key={chat.id}
                    className={`p-3 border-bottom cursor-pointer hover-bg-light ${
                      activeChat?.id === chat.id ? 'bg-light' : ''
                    }`}
                    onClick={() => setActiveChat(chat)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <div 
                          className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white fw-bold"
                          style={{ width: '50px', height: '50px', fontSize: '18px' }}
                        >
                          {chat.name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0 text-dark">{chat.name}</h6>
                          <small className="text-muted">{chat.time}</small>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <small className="text-muted">{chat.lastMessage}</small>
                          {chat.unread > 0 && (
                            <Badge bg="success" pill className="ms-2">{chat.unread}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
          
          {/* Chat Window */}
          <Col xs={12} md={8}>
            {activeChat ? (
              <div className="bg-white h-100 d-flex flex-column">
                {/* Chat Header */}
                <div className="p-3 border-bottom bg-light">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <div 
                        className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{ width: '40px', height: '40px' }}
                      >
                        {activeChat.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h6 className="mb-0 text-dark">{activeChat.name}</h6>
                      <small className="text-muted">
                        {activeChat.online ? 'Online' : 'Last seen recently'}
                      </small>
                    </div>
                  </div>
                </div>
                
                {/* Messages */}
                <div 
                  className="flex-grow-1 overflow-auto p-3"
                  style={{ 
                    backgroundColor: '#e5ddd5',
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="a" patternUnits="userSpaceOnUse" width="100" height="100"%3E%3Cpath d="M0 0h100v100H0z" fill="%23f0f0f0"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23a)"/%3E%3C/svg%3E")'
                  }}
                >
                  {messages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`d-flex mb-3 ${msg.sender === 'me' ? 'justify-content-end' : 'justify-content-start'}`}
                    >
                      <div 
                        className={`p-3 rounded-3 shadow-sm position-relative ${
                          msg.sender === 'me' 
                            ? 'bg-success text-white' 
                            : 'bg-white text-dark'
                        } ${msg.type === 'Invoice' || msg.type === 'Estimation' ? 'border border-warning' : ''}`}
                        style={{ 
                          maxWidth: '70%',
                          borderRadius: msg.sender === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px'
                        }}
                      >
                        {(msg.type === 'Invoice' || msg.type === 'Estimation') && (
                          <div className="mb-2">
                            <Badge bg={msg.type === 'Invoice' ? 'danger' : 'warning'} className="mb-2">
                              {msg.type}
                            </Badge>
                            <div className="fw-bold">₹{msg.amount?.toLocaleString()}</div>
                          </div>
                        )}
                        <div className="mb-1">{msg.content}</div>
                        <div className="d-flex justify-content-end">
                          <small className={`${msg.sender === 'me' ? 'text-light' : 'text-muted'}`} style={{ fontSize: '11px' }}>
                            {msg.time}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Message Input */}
                <div className="p-3 border-top bg-light">
                  <Form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                    <InputGroup>
                      {user?.role === 'vendor' && (
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => setShowInvoiceModal(true)}
                          title="Send Invoice"
                        >
                          ₹
                        </Button>
                      )}
                      <Form.Control
                        type="text"
                        placeholder="Type a message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="border-0"
                        style={{ borderRadius: '25px' }}
                      />
                      <Button 
                        variant="success" 
                        type="submit"
                        className="rounded-circle"
                        style={{ width: '45px', height: '45px' }}
                      >
                        ➤
                      </Button>
                    </InputGroup>
                  </Form>
                </div>
              </div>
            ) : (
              <div className="bg-white h-100 d-flex align-items-center justify-content-center">
                <div className="text-center text-muted">
                  <div style={{ fontSize: '4rem', opacity: 0.3 }}>💬</div>
                  <h5 className="mt-3">Select a chat to start messaging</h5>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      {/* Invoice Modal */}
      <Modal show={showInvoiceModal} onHide={() => setShowInvoiceModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Send {invoiceData.type}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select 
                value={invoiceData.type} 
                onChange={(e) => setInvoiceData({...invoiceData, type: e.target.value})}
              >
                <option value="Invoice">Invoice</option>
                <option value="Estimation">Estimation</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount (₹)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={invoiceData.amount}
                onChange={(e) => setInvoiceData({...invoiceData, amount: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description..."
                value={invoiceData.content}
                onChange={(e) => setInvoiceData({...invoiceData, content: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInvoiceModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={sendInvoice}>
            Send {invoiceData.type}
          </Button>
        </Modal.Footer>
      </Modal>

      <style>
        {`
          .hover-bg-light:hover {
            background-color: #f8f9fa !important;
          }
          @media (max-width: 768px) {
            .container-fluid {
              padding: 0 !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Chat;