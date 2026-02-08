import React from 'react';
import { Modal, Button, Table, Badge, Image } from 'react-bootstrap';
import { generateInvoicePDF } from '../../utils/invoiceGenerator';

const OrderDetailsModal = ({ show, onHide, order }) => {
    if (!order) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'DELIVERED':
            case 'COMPLETED': return 'success';
            case 'SHIPPED': return 'primary';
            case 'CONFIRMED': return 'info';
            case 'PENDING':
            case 'PROCESSING': return 'warning';
            case 'CANCELLED': return 'danger';
            default: return 'secondary';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Order #{order.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                        <p className="mb-1"><strong>Date:</strong> {formatDate(order.orderDate)}</p>
                        <p className="mb-1">
                            <strong>Status:</strong> <Badge bg={getStatusColor(order.status)}>{order.status}</Badge>
                        </p>
                        {order.shopkeeper && (
                            <p className="mb-1"><strong>Shopkeeper:</strong> {order.shopkeeper.shopName || 'N/A'}</p>
                        )}
                        {order.vendor && (
                            <p className="mb-1"><strong>Vendor:</strong> {order.vendor.shopName || 'N/A'}</p>
                        )}
                    </div>
                    <div className="text-end">
                        <h4>Total: ₹{order.totalAmount}</h4>
                    </div>
                </div>

                <h5>Items</h5>
                <Table responsive hover className="align-middle">
                    <thead>
                        <tr>
                            <th style={{ width: '80px' }}>Image</th>
                            <th>Product</th>
                            <th className="text-center">Price</th>
                            <th className="text-center">Qty</th>
                            <th className="text-end">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.orderItems && order.orderItems.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <Image
                                        src={item.product?.photoLink || item.product?.image || 'https://via.placeholder.com/60'}
                                        alt={item.product?.name}
                                        thumbnail
                                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                    />
                                </td>
                                <td>
                                    <h6 className="mb-0">{item.product?.name}</h6>
                                    {item.product?.description && (
                                        <small className="text-muted text-truncate d-block" style={{ maxWidth: '200px' }}>
                                            {item.product.description}
                                        </small>
                                    )}
                                </td>
                                <td className="text-center">₹{item.price}</td>
                                <td className="text-center">{item.quantity}</td>
                                <td className="text-end">₹{item.price * item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={() => generateInvoicePDF(order)}>
                    📄 Download Invoice
                </Button>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderDetailsModal;
