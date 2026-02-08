import React from 'react';
import { Card, Badge } from 'react-bootstrap';

const ChatMessage = ({ message, currentUserId }) => {
    const isSender = message.sender?.id === currentUserId;
    const messageTypeColors = {
        TEXT: 'secondary',
        ESTIMATION: 'warning',
        INVOICE: 'success'
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`d-flex mb-3 ${isSender ? 'justify-content-end' : 'justify-content-start'}`}>
            <Card
                className={`shadow-sm ${isSender ? 'bg-primary text-white' : 'bg-light'}`}
                style={{ maxWidth: '70%' }}
            >
                <Card.Body className="p-2">
                    {message.messageType !== 'TEXT' && (
                        <Badge
                            bg={messageTypeColors[message.messageType]}
                            className="mb-2"
                        >
                            {message.messageType}
                        </Badge>
                    )}

                    <p className="mb-1">{message.content}</p>

                    {message.order && (
                        <div className="mt-2 p-2 border rounded bg-white text-dark">
                            <small>
                                <strong>Order #{message.order.id}</strong><br />
                                Amount: ₹{message.order.totalAmount}<br />
                                Status: {message.order.status}
                            </small>
                        </div>
                    )}

                    <div className="text-end">
                        <small className={isSender ? 'text-white-50' : 'text-muted'}>
                            {message.sender?.name} • {formatTime(message.timestamp)}
                        </small>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ChatMessage;
