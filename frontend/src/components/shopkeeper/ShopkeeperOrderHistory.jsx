import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Alert } from 'react-bootstrap';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import OrderCard from '../common/OrderCard';
import OrderDetailsModal from '../common/OrderDetailsModal';

const ShopkeeperOrderHistory = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterType, setFilterType] = useState('ALL');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    useEffect(() => {
        if (user?.shopkeeperId) {
            fetchOrders();
        }
    }, [user]);

    useEffect(() => {
        applyFilters();
    }, [orders, filterStatus, filterType]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getShopkeeperOrders(user.shopkeeperId);
            setOrders(data);
            setError('');
        } catch (err) {
            setError('Failed to load orders: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...orders];

        if (filterStatus !== 'ALL') {
            filtered = filtered.filter(order => order.status === filterStatus);
        }

        if (filterType !== 'ALL') {
            filtered = filtered.filter(order => order.orderType === filterType);
        }

        setFilteredOrders(filtered);
    };

    const getStatusCount = (status) => {
        return orders.filter(order => order.status === status).length;
    };

    if (loading) {
        return <LoadingSpinner message="Loading your orders..." />;
    }

    return (
        <Container fluid>
            <Row className="mb-4">
                <Col>
                    <h3>📦 Order History</h3>
                    <p className="text-muted">View all your orders and track their status</p>
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

            {/* Filters */}
            <Row className="mb-4">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Filter by Status</Form.Label>
                        <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Filter by Order Type</Form.Label>
                        <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                            <option value="ALL">All Types</option>
                            <option value="DIRECT">Direct Orders</option>
                            <option value="CHAT_BASED">Chat-Based Orders</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            {/* Orders List */}
            <Row>
                <Col>
                    {filteredOrders.length === 0 ? (
                        <Alert variant="info">
                            {filterStatus === 'ALL' && filterType === 'ALL'
                                ? 'No orders yet. Start shopping to place your first order!'
                                : 'No orders found matching the selected filters.'}
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
                                    role="shopkeeper"
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

export default ShopkeeperOrderHistory;
