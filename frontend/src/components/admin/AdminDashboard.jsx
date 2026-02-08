import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalVendors: 0,
        totalShopkeepers: 0,
        totalOrders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await adminService.getDashboardStats();
            setStats(data);
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
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2>📊 Admin Dashboard</h2>
                    <p className="text-muted">Platform overview and statistics</p>
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <Card className="text-center shadow-sm mb-3">
                        <Card.Body>
                            <div className="display-4 text-primary">
                                {stats.totalVendors}
                            </div>
                            <h5 className="mt-2">Total Vendors</h5>
                            <p className="text-muted">Registered wholesalers</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="text-center shadow-sm mb-3">
                        <Card.Body>
                            <div className="display-4 text-success">
                                {stats.totalShopkeepers}
                            </div>
                            <h5 className="mt-2">Total Shopkeepers</h5>
                            <p className="text-muted">Registered retailers</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="text-center shadow-sm mb-3">
                        <Card.Body>
                            <div className="display-4 text-warning">
                                {stats.totalOrders}
                            </div>
                            <h5 className="mt-2">Total Orders</h5>
                            <p className="text-muted">All platform orders</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h5>Platform Information</h5>
                            <p>Welcome to the B2B E-Commerce Admin Panel. Use the navigation to manage categories, vendors, shopkeepers, and view all orders.</p>
                            <ul>
                                <li>Manage product categories and subcategories</li>
                                <li>View and manage vendor accounts</li>
                                <li>View and manage shopkeeper accounts</li>
                                <li>Monitor all orders (read-only access)</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;
