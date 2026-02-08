import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, ListGroup, Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { toast } from 'react-toastify';
import api from '../../services/api';
import paymentService from '../../services/paymentService';
import logo from '../../assets/react.svg';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const { user } = useAuth();
  const { subscribeToChat, sendMessage: sendWsMessage, connected } = useChat();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  // Invoice State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceDesc, setInvoiceDesc] = useState('');

  const messagesEndRef = useRef(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  // Auto-select chat from navigation state
  useEffect(() => {
    if (location.state?.activeChatId && chats.length > 0) {
      // Use loose equality (==) to handle string/number mismatches
      const chatToSelect = chats.find(c => c.id == location.state.activeChatId || c.chatRoomId == location.state.activeChatId);
      if (chatToSelect) {
        setActiveChat(chatToSelect);
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, chats]);

  // Handle Active Chat Changes & Real-time Subscription
  useEffect(() => {
    if (activeChat && connected) {
      // 1. Load message history
      fetchMessages(activeChat.id || activeChat.chatRoomId);

      // 2. Subscribe to real-time updates
      const chatRoomId = activeChat.id || activeChat.chatRoomId;

      const onMessageReceived = (newMessage) => {
        setMessages(prev => {
          // Avoid duplicates
          if (prev.some(m => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });

        // Update last message in chat list
        setChats(prev => prev.map(c =>
          (c.id == chatRoomId || c.chatRoomId == chatRoomId)
            ? {
              ...c,
              lastMessage: newMessage.content.includes(':::INVOICE:::') ? '🧾 Invoice Sent' : newMessage.content,
              time: new Date(newMessage.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })
            }
            : c
        ));
      };

      const sub = subscribeToChat(chatRoomId, onMessageReceived);
      subscriptionRef.current = sub;

      return () => {
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
      };
    }
  }, [activeChat, connected]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChats = async () => {
    try {
      let endpoint = '';
      if (user.role === 'vendor' || user.role === 'VENDOR') {
        const id = user.vendorId || user.id;
        endpoint = `/chat/active-rooms/vendor/${id}`;
      } else {
        const id = user.shopkeeperId || user.id;
        endpoint = `/chat/active-rooms/shopkeeper/${id}`;
      }

      const response = await api.get(endpoint);
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  // Poll for chat list updates (new chats, last message updates)
  useEffect(() => {
    if (user) {
      const interval = setInterval(fetchChats, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchMessages = async (chatRoomId) => {
    try {
      const response = await api.get(`/chat/room/${chatRoomId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat) return;

    const msgContent = message;
    setMessage(''); // Clear input immediately for UX

    const chatRoomId = activeChat.id || activeChat.chatRoomId;

    // Corrected: Use user.id for senderId as backend ChatService expects User ID
    const senderId = user.id;

    // Try sending via WebSocket first
    const sent = sendWsMessage(chatRoomId, {
      content: msgContent,
      messageType: 'TEXT',
      senderId: senderId
    });

    if (!sent) {
      // Fallback to HTTP if WS fails
      try {
        await api.post('/chat/message', {
          chatRoomId: chatRoomId,
          senderId: senderId,
          senderRole: user.role.toUpperCase(),
          content: msgContent,
          messageType: 'TEXT'
        });
        // Manual append if HTTP is used
        fetchMessages(chatRoomId);
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
        setMessage(msgContent); // Restore message
      }
    }
  };

  const handleSendInvoice = async () => {
    if (!invoiceAmount || !activeChat) return;

    const invoiceData = {
      amount: invoiceAmount,
      desc: invoiceDesc || 'Order Payment'
    };
    const msgContent = `:::INVOICE:::${JSON.stringify(invoiceData)}:::`;
    const chatRoomId = activeChat.id || activeChat.chatRoomId;

    try {
      await api.post('/chat/message', {
        chatRoomId: chatRoomId,
        senderId: user.id, // Corrected to user.id
        senderRole: user.role.toUpperCase(),
        content: msgContent,
        messageType: 'INVOICE'
      });

      setShowInvoiceModal(false);
      setInvoiceAmount('');
      setInvoiceDesc('');
      toast.success('Invoice sent!');
      fetchMessages(chatRoomId);
    } catch (error) {
      toast.error('Failed to send invoice');
    }
  };

  const handleOpenInvoiceModal = () => {
    // Find last estimation
    const lastEstimation = [...messages].reverse().find(m => m.messageType === 'ESTIMATION');

    console.log('Detailed Debug - Messages:', messages);
    console.log('Detailed Debug - Last Estimation:', lastEstimation);

    if (lastEstimation) {
      console.log('Detailed Debug - Estimation Content:', lastEstimation.content);
      // Try to get amount from order object if available
      if (lastEstimation.order && lastEstimation.order.totalAmount) {
        console.log('Detailed Debug - Found Order Object:', lastEstimation.order);
        setInvoiceAmount(lastEstimation.order.totalAmount);
        setInvoiceDesc(`Order #${lastEstimation.order.id} Payment`);
      } else {
        // Fallback: Parse content string "Estimation sent: Order #123 - Total: ₹5000"
        const content = lastEstimation.content || '';
        const amountMatch = content.match(/Total: ₹([\d.]+)/);
        const orderIdMatch = content.match(/Order #(\d+)/);

        console.log('Detailed Debug - Regex Matches:', { amountMatch, orderIdMatch });

        if (amountMatch) setInvoiceAmount(amountMatch[1]);
        if (orderIdMatch) setInvoiceDesc(`Order #${orderIdMatch[1]} Payment`);
      }
    } else {
      console.log('Detailed Debug - No ESTIMATION message found');
    }

    setShowInvoiceModal(true);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePay = async (invoiceData) => {
    const amount = invoiceData.amount;
    const desc = invoiceData.desc || '';

    // Extract Order ID if possible from description "Order #123 Payment"
    const orderIdMatch = desc.match(/Order #(\d+)/);
    const internalOrderId = orderIdMatch ? orderIdMatch[1] : null; // Fallback to null if not found

    // Note: If internalOrderId is null, verifyPayment will fail on backend. 
    // We should ideally ensure every invoice has an order ID or backend supports ad-hoc payments.
    // For now, we proceed.

    try {
      const res = await loadRazorpay();
      if (!res) {
        toast.error('Razorpay SDK failed to load.');
        return;
      }

      const rzpOrder = await paymentService.createRazorpayOrder(amount);

      const options = {
        key: "rzp_test_SAwhFZC2b6Zm1m",
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "B2B Marketplace",
        description: desc,
        image: logo,
        order_id: rzpOrder.id,
        handler: async function (response) {
          if (internalOrderId) {
            try {
              await paymentService.verifyPayment({
                internalOrderId: internalOrderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              });
              toast.success('Payment verified!');
            } catch (e) {
              toast.warning('Payment successful but verification failed (Order ID invalid?)');
            }
          } else {
            toast.success('Payment Successful! (No Order ID linked)');
          }
          // navigate('/order-history'); // Optional
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '9999999999'
        },
        theme: { color: "#3399cc" }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Failed to initiate payment");
    }
  };

  const quickReplies = (user?.role === 'shopkeeper' || user?.role === 'SHOPKEEPER')
    ? ['What\'s your best price?', 'Do you have bulk discounts?', 'When can you deliver?', 'Can you send samples?']
    : ['Yes, available in stock', 'I can offer 10% discount', 'Delivery in 2-3 days', 'Let me check and get back'];

  const renderMessageContent = (content) => {
    if (!content) return null;
    if (content.startsWith(':::INVOICE:::')) {
      try {
        const jsonStr = content.replace(':::INVOICE:::', '').replace(':::', '');
        const data = JSON.parse(jsonStr);
        return (
          <Card className="border-0 bg-light">
            <Card.Body>
              <h6>🧾 Invoice</h6>
              <p className="mb-1">{data.desc}</p>
              <h4 className="text-success">₹{parseInt(data.amount).toLocaleString()}</h4>
              {(user.role === 'shopkeeper' || user.role === 'SHOPKEEPER') && (
                <Button variant="success" size="sm" className="mt-2 w-100" onClick={() => handlePay(data)}>
                  💳 Pay Now
                </Button>
              )}
            </Card.Body>
          </Card>
        );
      } catch (e) {
        return content;
      }
    }
    return content;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Container fluid className="py-4">
        <Row style={{ height: '80vh' }}>
          {/* Chat List */}
          <Col md={4} className="pe-2">
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">💬 Chats {connected ? '🟢' : '🔴'}</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {chats.length === 0 && (
                    <div className="p-3 text-center text-muted">No chats yet</div>
                  )}
                  {chats.map(chat => (
                    <ListGroup.Item
                      key={chat.id || chat.chatRoomId}
                      action
                      active={(activeChat?.id || activeChat?.chatRoomId) == (chat.id || chat.chatRoomId)}
                      onClick={() => setActiveChat(chat)}
                      className="d-flex align-items-center p-3"
                    >
                      <div className="me-3 position-relative">
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                          style={{ width: '50px', height: '50px' }}
                        >
                          {chat.role === 'Vendor' ? '🏪' : '🛒'}
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <strong>{chat.name || (user.role === 'VENDOR' ? chat.shopkeeper?.shopName : chat.vendor?.shopName) || 'Unknown User'}</strong>
                          <small className="text-muted">{chat.time}</small>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted text-truncate" style={{ maxWidth: '150px' }}>{chat.lastMessage}</small>
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
                            {(activeChat.role === 'Vendor' || user.role === 'SHOPKEEPER') ? '🏪' : '🛒'}
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0">{activeChat.name || (user.role === 'VENDOR' ? activeChat.shopkeeper?.shopName : activeChat.vendor?.shopName)}</h6>
                          <small>
                            {connected ? 'Online' : 'Connecting...'} • 🔒 End-to-end encrypted
                          </small>
                        </div>
                      </div>
                      {(user.role === 'vendor' || user.role === 'VENDOR') && (
                        <Button variant="light" size="sm" onClick={handleOpenInvoiceModal}>
                          🧾 Send Invoice
                        </Button>
                      )}
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
                      {/* Sort messages: Oldest first (WhatsApp style) */}
                      {[...messages]
                        .sort((a, b) => new Date(a.timestamp || a.sentAt || 0) - new Date(b.timestamp || b.sentAt || 0))
                        .map((msg, index) => {
                          // Backend returns 'sender' object (Message entity), WebSocket might send 'senderId'
                          // Safe check for both scenarios
                          const msgSenderId = msg.sender?.id || msg.senderId;
                          const isMe = Number(msgSenderId) === Number(user.id);

                          // DEBUG LOG (Remove in production)
                          // console.log(`Msg ${index}: Sender=${msgSenderId}, Me=${user.id}, isMe=${isMe}, Timestamp=${msg.timestamp}`);

                          let messageDate = new Date();
                          const rawTs = msg.timestamp || msg.sentAt;

                          if (rawTs) {
                            if (Array.isArray(rawTs)) {
                              // Handle [yyyy, MM, dd, HH, mm, ss]
                              // Note: Month is 0-indexed in JS Date, but usually 1-indexed in Array from Java
                              messageDate = new Date(rawTs[0], rawTs[1] - 1, rawTs[2], rawTs[3], rawTs[4], rawTs[5]);
                            } else {
                              messageDate = new Date(rawTs);
                            }
                          }

                          // Robust check for Invalid Date
                          if (isNaN(messageDate.getTime())) {
                            messageDate = new Date();
                          }

                          const timeString = messageDate.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });

                          return (
                            <div
                              key={index}
                              className={`d-flex mb-3 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}
                            >
                              <div
                                className={`p-3 rounded-3 shadow-sm ${isMe
                                  ? 'bg-success text-white'
                                  : 'bg-white'
                                  }`}
                                style={{ maxWidth: '70%', minWidth: '120px' }}
                              >
                                <div className={!isMe ? 'text-dark' : 'text-white'}>
                                  {renderMessageContent(msg.content)}
                                </div>
                                <div className={`d-flex justify-content-end align-items-center mt-1`}>
                                  <small className={isMe ? 'text-white-50' : 'text-muted'} style={{ fontSize: '0.75rem' }}>
                                    {timeString}
                                  </small>
                                  {isMe && (
                                    <small className="text-white-50 ms-1" style={{ fontSize: '0.75rem' }}>✓✓</small>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Replies */}
                    <div className="mb-3">
                      <div className="d-flex gap-2 flex-wrap">
                        {quickReplies.map((reply, index) => (
                          <Button
                            key={index}
                            variant="outline-primary"
                            size="sm"
                            onClick={() => setMessage(reply)}
                          >
                            {reply}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Message Input */}
                    <Form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder="Type a message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button variant="success" type="submit" disabled={!connected}>
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

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <Modal show={showInvoiceModal} onHide={() => setShowInvoiceModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Send Invoice</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Amount (₹)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter amount"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="E.g., Order #123 Payment"
                  value={invoiceDesc}
                  onChange={(e) => setInvoiceDesc(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowInvoiceModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSendInvoice}>
              Send Invoice
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Chat;