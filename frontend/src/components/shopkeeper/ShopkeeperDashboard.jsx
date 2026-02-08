import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { chatService } from '../../services/chatService';
import api from '../../services/api';
import ProductCatalog from './ProductCatalog';
import ShopkeeperOrderHistory from './ShopkeeperOrderHistory';
import ShopkeeperChat from './ShopkeeperChat';
import ShopkeeperProfile from './ShopkeeperProfile';
import Cart from './Cart';
import LoadingSpinner from '../common/LoadingSpinner';

const ShopkeeperDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalExpense: 0,
        totalOrders: 0,
        pendingOrders: 0,
        activeChats: 0,
        cartItems: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.shopkeeperId) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            setLoading(true);

            // Fetch Total Expense
            const expenseResponse = await api.get('/shopkeeper/total-expense');
            const totalExpense = expenseResponse.data || 0;

            // Fetch orders
            const orders = await orderService.getShopkeeperOrders(user.shopkeeperId);
            const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

            // Fetch chat rooms
            const chatRooms = await chatService.getShopkeeperRooms(user.shopkeeperId);

            // Get cart items from localStorage
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');

            setStats({
                totalExpense: totalExpense,
                totalOrders: orders.length,
                pendingOrders: pendingOrders,
                activeChats: chatRooms.length,
                cartItems: cart.length
            });
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading dashboard..." />;
    }

    return (
        <div className="page-container">
            <Container fluid className="py-4">
                <Row className="mb-4">
                    <Col>
                        <h2>🛒 Shopkeeper Dashboard</h2>
                        <p className="text-muted">Welcome, {user?.name}</p>
                    </Col>
                </Row>

                {/* Statistics Cards */}
                {activeTab === 'dashboard' && (
                    <>
                        <Row className="mb-4 align-items-center">
                            <Col>
                                <h4>Analytics Overview</h4>
                            </Col>
                            <Col xs="auto">
                                <button className="btn btn-outline-primary" onClick={() => setActiveTab('profile')}>
                                    ✏️ Edit Profile
                                </button>
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <Col md={3}>
                                <Card className="text-center shadow-sm h-100 border-primary">
                                    <Card.Body>
                                        <h3 className="text-primary">₹{Number(stats.totalExpense).toLocaleString('en-IN')}</h3>
                                        <p className="mb-0">💰 Total Expense</p>
                                        <small className="text-muted">Total spent</small>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="text-center shadow-sm h-100 border-warning">
                                    <Card.Body>
                                        <h3 className="text-warning">{stats.totalOrders}</h3>
                                        <p className="mb-0">📦 Total Orders</p>
                                        <small className="text-muted">All time</small>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="text-center shadow-sm h-100 border-info">
                                    <Card.Body>
                                        <h3 className="text-info">{stats.activeChats}</h3>
                                        <p className="mb-0">💬 Active Chats</p>
                                        <small className="text-muted">With vendors</small>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="text-center shadow-sm h-100 border-success">
                                    <Card.Body>
                                        <h3 className="text-success">{stats.cartItems}</h3>
                                        <p className="mb-0">🛒 Cart Items</p>
                                        <small className="text-muted">Ready to order</small>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}

                {/* Navigation Tabs Removed as per user request */}

                {/* Back Button for non-dashboard views */}
                {activeTab !== 'dashboard' && (
                    <div className="mb-3">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => setActiveTab('dashboard')}
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                )}

                {/* Tab Content */}
                <div className="mt-3">
                    {activeTab === 'profile' && <ShopkeeperProfile />}
                </div>
            </Container>
        </div>
    );
};

export default ShopkeeperDashboard;
