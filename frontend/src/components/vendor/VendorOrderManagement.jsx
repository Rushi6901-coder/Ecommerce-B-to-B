import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Alert, Button } from 'react-bootstrap';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import OrderCard from '../common/OrderCard';
import OrderDetailsModal from '../common/OrderDetailsModal';
import { toast } from 'react-toastify';

const VendorOrderManagement = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (user?.vendorId) {
            fetchOrders();
        }
    }, [user]);

    useEffect(() => {
        applyFilter();
    }, [orders, filterStatus]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getVendorOrders(user.vendorId);
            setOrders(data);
            setError('');
        } catch (err) {
            setError('Failed to load orders: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = () => {
        if (filterStatus === 'ALL') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status === filterStatus));
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            toast.success(`Order #${orderId} status updated to ${newStatus}`);
            // Refresh orders
            fetchOrders();
        } catch (err) {
            toast.error('Failed to update order status: ' + (err.response?.data || err.message));
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const getStatusCount = (status) => {
        return orders.filter(order => order.status === status).length;
    };

    if (loading) {
        return <LoadingSpinner message="Loading your orders..." />;
    }

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <h3>📦 Order Management</h3>
                    <p className="text-muted">Manage incoming orders from shopkeepers</p>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {/* Statistics Cards */}
            <Row className="mb-4">
                <Col md={3}>
                    <div className="card text-center border-warning">
                        <div className="card-body">
                            <h2>{getStatusCount('PENDING')}</h2>
                            <p className="mb-0 text-warning">Pending</p>
                        </div>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="card text-center border-info">
                        <div className="card-body">
                            <h2>{getStatusCount('CONFIRMED')}</h2>
                            <p className="mb-0 text-info">Confirmed</p>
                        </div>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="card text-center border-primary">
                        <div className="card-body">
                            <h2>{getStatusCount('SHIPPED')}</h2>
                            <p className="mb-0 text-primary">Shipped</p>
                        </div>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="card text-center border-success">
                        <div className="card-body">
                            <h2>{getStatusCount('DELIVERED')}</h2>
                            <p className="mb-0 text-success">Delivered</p>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Filter */}
            <Row className="mb-4">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Filter by Status</Form.Label>
                        <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="ALL">All Orders</option>
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6} className="d-flex align-items-end">
                    <Button variant="outline-primary" onClick={fetchOrders}>
                        🔄 Refresh Orders
                    </Button>
                </Col>
            </Row>

            {/* Orders List */}
            <Row>
                <Col>
                    {filteredOrders.length === 0 ? (
                        <Alert variant="info">
                            {filterStatus === 'ALL'
                                ? 'No orders yet. Orders from shopkeepers will appear here.'
                                : `No ${filterStatus.toLowerCase()} orders found.`
                            }
                        </Alert>
                    ) : (
                        <div>
                            <p className="text-muted mb-3">
                                Showing {filteredOrders.length} of {orders.length} orders
                            </p>
                            {filteredOrders.map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    role="vendor"
                                    onUpdateStatus={handleUpdateStatus}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                        </div>
                    )}
                </Col>
            </Row>

            <OrderDetailsModal
                show={showModal}
                onHide={handleCloseModal}
                order={selectedOrder}
            />
        </Container>
    );
};

export default VendorOrderManagement;
