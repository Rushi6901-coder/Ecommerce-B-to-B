import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, ListGroup, Form, Button, Card, Alert, Modal, Badge } from 'react-bootstrap';
import { chatService } from '../../services/chatService';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import ChatMessage from '../common/ChatMessage';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';

const ShopkeeperChat = () => {
    const { user } = useAuth();
    const [chatRooms, setChatRooms] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (user?.shopkeeperId) {
            fetchChatRooms();
            fetchVendors();
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
            const data = await chatService.getShopkeeperRooms(user.shopkeeperId);
            setChatRooms(data);
        } catch (err) {
            console.error('Failed to load chat rooms:', err);
            toast.error('Failed to load chat rooms');
        } finally {
            setLoading(false);
        }
    };

    const fetchVendors = async () => {
        try {
            const data = await userService.getAllVendors();
            setVendors(data);
        } catch (err) {
            console.error('Failed to load vendors:', err);
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

    const handleStartNewChat = async () => {
        if (!selectedVendor) {
            toast.error('Please select a vendor');
            return;
        }

        try {
            const room = await chatService.createChatRoom(selectedVendor, user.shopkeeperId);
            setChatRooms([...chatRooms, room]);
            setSelectedRoom(room);
            setShowNewChatModal(false);
            setSelectedVendor('');
            toast.success('Chat started successfully');
        } catch (err) {
            toast.error('Failed to start chat');
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading chats..." />;
    }

    return (
        <Container fluid className="py-4">
            <Row>
                <Col md={4} className="border-end">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>💬 Your Chats</h5>
                        <Button size="sm" variant="primary" onClick={() => setShowNewChatModal(true)}>
                            + New Chat
                        </Button>
                    </div>

                    {chatRooms.length === 0 ? (
                        <Alert variant="info">
                            No active chats. Click "New Chat" to start chatting with a vendor.
                        </Alert>
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
                                        <strong>{room.vendor?.shopName || room.vendor?.user?.name}</strong>
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
                                        <strong>{selectedRoom.vendor?.shopName || selectedRoom.vendor?.user?.name}</strong>
                                        <br />
                                        <small className="text-muted">
                                            {selectedRoom.vendor?.businessCategory}
                                        </small>
                                    </div>
                                </Card.Header>
                            </Card>

                            <div
                                className="flex-grow-1 overflow-auto p-3 bg-light"
                                style={{ maxHeight: '50vh' }}
                            >
                                {messages.length === 0 ? (
                                    <div className="text-center text-muted mt-5">
                                        <p>No messages yet. Start the conversation!</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <ChatMessage key={msg.id} message={msg} currentUserId={user.id} />
                                    ))
                                )}
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
                            <p>Or click "New Chat" to start a conversation with a vendor</p>
                        </div>
                    )}
                </Col>
            </Row>

            {/* New Chat Modal */}
            <Modal show={showNewChatModal} onHide={() => setShowNewChatModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Start New Chat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Select Vendor</Form.Label>
                        <Form.Select
                            value={selectedVendor}
                            onChange={(e) => setSelectedVendor(e.target.value)}
                        >
                            <option value="">Choose a vendor...</option>
                            {vendors.map(vendor => (
                                <option key={vendor.id} value={vendor.id}>
                                    {vendor.shopName || vendor.user?.name} - {vendor.businessCategory}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowNewChatModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleStartNewChat}>
                        Start Chat
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ShopkeeperChat;
