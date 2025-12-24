import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, ListGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Chat = () => {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
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
    },
    {
      id: 3,
      name: 'Customer Support',
      role: 'support',
      lastMessage: 'How can we help you?',
      time: '1 hour ago',
      unread: 0,
      online: true
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
    }
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        sender: 'me',
        content: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simulate typing and response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const responses = [
          'That sounds good! Let me check with my team.',
          'I can arrange that for you. When do you need delivery?',
          'Perfect! I\'ll prepare the quotation.',
          'Great! Let me know if you need any other products.'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'other',
          content: randomResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text'
        }]);
      }, 2000);
    }
  };

  const sendQuickReply = (reply) => {
    setMessage(reply);
    setTimeout(() => sendMessage(), 100);
  };

  const quickReplies = user?.role === 'shopkeeper' 
    ? ['What\'s your best price?', 'Do you have bulk discounts?', 'When can you deliver?', 'Can you send samples?']
    : ['Yes, available in stock', 'I can offer 10% discount', 'Delivery in 2-3 days', 'Let me check and get back'];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Container fluid className="py-4">
        <Row style={{ height: '80vh' }}>
          {/* Chat List */}
          <Col md={4} className="pe-2">
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">💬 Chats</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {chats.map(chat => (
                    <ListGroup.Item 
                      key={chat.id}
                      action
                      active={activeChat?.id === chat.id}
                      onClick={() => setActiveChat(chat)}
                      className="d-flex align-items-center p-3"
                    >
                      <div className="me-3 position-relative">
                        <div 
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                          style={{ width: '50px', height: '50px' }}
                        >
                          {chat.role === 'vendor' ? '🏪' : 
                           chat.role === 'shopkeeper' ? '🛒' : '🎧'}
                        </div>
                        {chat.online && (
                          <div 
                            className="position-absolute bg-success rounded-circle"
                            style={{ 
                              width: '12px', 
                              height: '12px', 
                              bottom: '2px', 
                              right: '2px',
                              border: '2px solid white'
                            }}
                          />
                        )}
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <strong>{chat.name}</strong>
                          <small className="text-muted">{chat.time}</small>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">{chat.lastMessage}</small>
                          {chat.unread > 0 && (
                            <Badge bg="danger" pill>{chat.unread}</Badge>
                          )}
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Chat Window */}
          <Col md={8} className="ps-2">
            <Card className="h-100 shadow-sm">
              {activeChat ? (
                <>
                  <Card.Header className="bg-primary text-white">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <div 
                            className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center"
                            style={{ width: '40px', height: '40px' }}
                          >
                            {activeChat.role === 'vendor' ? '🏪' : 
                             activeChat.role === 'shopkeeper' ? '🛒' : '🎧'}
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0">{activeChat.name}</h6>
                          <small>
                            {activeChat.online ? '🟢 Online' : '⚫ Offline'} • 
                            🔒 End-to-end encrypted
                          </small>
                        </div>
                      </div>
                      <div>
                        <Button variant="outline-light" size="sm" className="me-2">
                          📞
                        </Button>
                        <Button variant="outline-light" size="sm">
                          📹
                        </Button>
                      </div>
                    </div>
                  </Card.Header>
                  
                  <Card.Body 
                    className="d-flex flex-column"
                    style={{ 
                      height: '400px',
                      backgroundColor: '#e5ddd5',
                      backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                      backgroundSize: '20px 20px'
                    }}
                  >
                    <div className="flex-grow-1 overflow-auto mb-3">
                      {messages.map(msg => (
                        <div 
                          key={msg.id} 
                          className={`d-flex mb-3 ${msg.sender === 'me' ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                          <div 
                            className={`p-3 rounded-3 shadow-sm ${
                              msg.sender === 'me' 
                                ? 'bg-success text-white' 
                                : 'bg-white'
                            }`}
                            style={{ maxWidth: '70%' }}
                          >
                            <div>{msg.content}</div>
                            <div className={`d-flex justify-content-between align-items-center mt-1`}>
                              <small className={msg.sender === 'me' ? 'text-light' : 'text-muted'}>
                                {msg.time}
                              </small>
                              {msg.sender === 'me' && (
                                <small className="text-light">✓✓</small>
                              )}
                            </div>
                          </div>
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
                            <small className="text-muted">Typing...</small>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Quick Replies */}
                    <div className="mb-3">
                      <div className="d-flex gap-2 flex-wrap">
                        {quickReplies.map((reply, index) => (
                          <Button 
                            key={index}
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => sendQuickReply(reply)}
                          >
                            {reply}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Message Input */}
                    <Form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                      <InputGroup>
                        <Button variant="outline-secondary">
                          📎
                        </Button>
                        <Form.Control
                          type="text"
                          placeholder="Type a message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button variant="outline-secondary">
                          😊
                        </Button>
                        <Button variant="success" type="submit">
                          📤
                        </Button>
                      </InputGroup>
                    </Form>
                  </Card.Body>
                </>
              ) : (
                <Card.Body className="d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <div style={{ fontSize: '4rem' }}>💬</div>
                    <h5 className="text-muted mt-3">Select a chat to start messaging</h5>
                    <p>Choose from your existing conversations or start a new one</p>
                  </div>
                </Card.Body>
              )}
            </Card>
          </Col>
        </Row>
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

export default Chat;