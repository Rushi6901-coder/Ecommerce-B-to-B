import React from 'react';
import { Card, Badge, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const OrderCard = ({ order, role, onUpdateStatus, onViewDetails, ...props }) => {
    const navigate = useNavigate();

    const getStatusVariant = (status) => {
        switch (status) {
            case 'PENDING':
                return 'warning';
            case 'CONFIRMED':
                return 'info';
            case 'SHIPPED':
                return 'primary';
            case 'DELIVERED':
                return 'success';
            case 'CANCELLED':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    const getOrderTypeBadge = (orderType) => {
        return orderType === 'DIRECT' ? (
            <Badge bg="primary">Direct Order</Badge>
        ) : (
            <Badge bg="info">Chat-Based Order</Badge>
        );
    };

    const handleStatusUpdate = (newStatus) => {
        if (onUpdateStatus) {
            onUpdateStatus(order.id, newStatus);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Card className="mb-3 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                    <strong>Order #{order.id}</strong>
                    <span className="ms-2">{getOrderTypeBadge(order.orderType)}</span>
                </div>
                <Badge bg={getStatusVariant(order.status)}>{order.status}</Badge>
            </Card.Header>
            <Card.Body>
                <div className="mb-3">
                    <p className="mb-1">
                        <strong>Order Date:</strong> {formatDate(order.orderDate)}
                    </p>
                    {role === 'vendor' && order.shopkeeper && (
                        <p className="mb-1">
                            <strong>Shopkeeper:</strong> {order.shopkeeper.shopName || order.shopkeeper.user?.name}
                        </p>
                    )}
                    {role === 'shopkeeper' && order.vendor && (
                        <p className="mb-1">
                            <strong>Vendor:</strong> {order.vendor.shopName || order.vendor.user?.name}
                        </p>
                    )}
                    {role === 'admin' && (
                        <>
                            <p className="mb-1">
                                <strong>Vendor:</strong> {order.vendor?.shopName || 'N/A'}
                            </p>
                            <p className="mb-1">
                                <strong>Shopkeeper:</strong> {order.shopkeeper?.shopName || 'N/A'}
                            </p>
                        </>
                    )}
                    <p className="mb-1">
                        <strong>Total Amount:</strong> <span className="text-primary fs-5">₹{order.totalAmount}</span>
                    </p>
                </div>

                {order.orderItems && order.orderItems.length > 0 && (
                    <div className="mb-3">
                        <strong>Items:</strong>
                        <ListGroup variant="flush" className="mt-2">
                            {order.orderItems.slice(0, 3).map((item) => (
                                <ListGroup.Item key={item.id} className="px-0 py-1">
                                    <small>
                                        {item.product?.name} - Qty: {item.quantity} × ₹{item.price} = ₹{item.quantity * item.price}
                                    </small>
                                </ListGroup.Item>
                            ))}
                            {order.orderItems.length > 3 && (
                                <ListGroup.Item className="px-0 py-1">
                                    <small className="text-muted">
                                        + {order.orderItems.length - 3} more items
                                    </small>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </div>
                )}

                {role === 'vendor' && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                    <div className="d-flex gap-2 flex-wrap">
                        {order.status === 'PENDING' && (
                            <Button size="sm" variant="success" onClick={() => handleStatusUpdate('CONFIRMED')}>
                                Confirm Order
                            </Button>
                        )}
                        {order.status === 'CONFIRMED' && (
                            <Button size="sm" variant="primary" onClick={() => handleStatusUpdate('SHIPPED')}>
                                Mark as Shipped
                            </Button>
                        )}
                        {order.status === 'SHIPPED' && (
                            <Button size="sm" variant="success" onClick={() => handleStatusUpdate('DELIVERED')}>
                                Mark as Delivered
                            </Button>
                        )}
                        {order.status !== 'CANCELLED' && (
                            <Button size="sm" variant="danger" onClick={() => handleStatusUpdate('CANCELLED')}>
                                Cancel Order
                            </Button>
                        )}
                    </div>
                )}

                <div className="mt-2">
                    <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => {
                            if (onViewDetails) {
                                onViewDetails(order);
                            } else {
                                navigate(`/order/${order.id}`);
                            }
                        }}
                    >
                        View Details
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default OrderCard;
