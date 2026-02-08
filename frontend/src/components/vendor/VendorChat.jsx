import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, ListGroup, Form, Button, Card, Alert } from 'react-bootstrap';
import { chatService } from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';
import ChatMessage from '../common/ChatMessage';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';

const VendorChat = () => {
    const { user } = useAuth();
    const [chatRooms, setChatRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (user?.vendorId) {
            fetchChatRooms();
        }
    }, [user]);

    useEffect(() => {
        if (selectedRoom) {
            fetchMessages(selectedRoom.id);
            // Poll for new messages every 5 seconds
            const interval = setInterval(() => {
                fetchMessages(selectedRoom.id);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [selectedRoom]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchChatRooms = async () => {
        try {
            setLoading(true);
            const data = await chatService.getVendorRooms(user.vendorId);
            setChatRooms(data);
        } catch (err) {
            console.error('Failed to load chat rooms:', err);
            toast.error('Failed to load chat rooms');
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (roomId) => {
        try {
            const data = await chatService.getMessages(roomId);
            setMessages(data);
        } catch (err) {
            console.error('Failed to load messages:', err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedRoom) return;

        try {
            const messageData = {
                chatRoomId: selectedRoom.id,
                senderId: user.id,
                content: newMessage,
                messageType: 'TEXT'
            };

            await chatService.sendMessage(messageData);
            setNewMessage('');
            fetchMessages(selectedRoom.id);
        } catch (err) {
            toast.error('Failed to send message');
        }
    };

    const handleSendEstimation = () => {
        // This would open a modal or form to create estimation
        toast.info('Estimation feature - Create order items and send');
        // Navigate to a form or open modal
    };

    const handleSendInvoice = () => {
        // This would open a modal to select an existing order and send invoice
        toast.info('Invoice feature - Select order and send invoice');
    };

    if (loading) {
        return <LoadingSpinner message="Loading chats..." />;
    }

    return (
        <Container fluid className="py-4">
            <Row>
                <Col md={4} className="border-end">
                    <h5 className="mb-3">💬 Active Chats</h5>
                    {chatRooms.length === 0 ? (
                        <Alert variant="info">No active chats yet. Shopkeepers will initiate chats.</Alert>
                    ) : (
                        <ListGroup>
                            {chatRooms.map((room) => (
                                <ListGroup.Item
                                    key={room.id}
                                    action
                                    active={selectedRoom?.id === room.id}
                                    onClick={() => setSelectedRoom(room)}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    <div>
                                        <strong>{room.shopkeeper?.shopName || room.shopkeeper?.user?.name}</strong>
                                        <br />
                                        <small className="text-muted">
                                            Started: {new Date(room.createdAt).toLocaleDateString()}
                                        </small>
                                    </div>
                                    <i className="bi bi-chevron-right"></i>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>

                <Col md={8}>
                    {selectedRoom ? (
                        <div className="d-flex flex-column" style={{ height: '70vh' }}>
                            <Card className="mb-2">
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{selectedRoom.shopkeeper?.shopName || selectedRoom.shopkeeper?.user?.name}</strong>
                                    </div>
                                    <div>
                                        <Button size="sm" variant="warning" className="me-2" onClick={handleSendEstimation}>
                                            📝 Send Estimation
                                        </Button>
                                        <Button size="sm" variant="success" onClick={handleSendInvoice}>
                                            📄 Send Invoice
                                        </Button>
                                    </div>
                                </Card.Header>
                            </Card>

                            <div
                                className="flex-grow-1 overflow-auto p-3 bg-light"
                                style={{ maxHeight: '50vh' }}
                            >
                                {messages.map((msg) => (
                                    <ChatMessage key={msg.id} message={msg} currentUserId={user.id} />
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <Form onSubmit={handleSendMessage} className="mt-2">
                                <div className="d-flex gap-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <Button type="submit" disabled={!newMessage.trim()}>
                                        Send
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    ) : (
                        <div className="text-center text-muted mt-5">
                            <h5>Select a chat to start messaging</h5>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default VendorChat;
