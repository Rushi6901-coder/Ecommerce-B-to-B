import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';

const ShopkeeperProfile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        shopName: '',
        shopAddress: '',
        licenseNumber: '',
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        const fetchShopkeeperDetails = async () => {
            if (user && user.shopkeeperId) {
                try {
                    // Fetch shopkeeper details
                    const shopkeeperResponse = await api.get(`/shopkeeper/${user.shopkeeperId}`);
                    const shopkeeperData = shopkeeperResponse.data;

                    setProfile({
                        shopName: shopkeeperData.shopName || '',
                        shopAddress: shopkeeperData.shopAddress || '',
                        licenseNumber: shopkeeperData.licenseNumber || '',
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        address: user.address || ''
                    });
                } catch (error) {
                    console.error('Error fetching shopkeeper details:', error);
                    // Fallback to user data only
                    setProfile({
                        shopName: '',
                        shopAddress: '',
                        licenseNumber: '',
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        address: user.address || ''
                    });
                }
            }
        };

        fetchShopkeeperDetails();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            // Update user details
            await api.put(`/users/${user.id}`, {
                name: profile.name,
                phone: profile.phone,
                address: profile.address
            });

            // Update shopkeeper details
            await api.put(`/shopkeeper/${user.shopkeeperId}`, {
                shopName: profile.shopName,
                shopAddress: profile.shopAddress,
                licenseNumber: profile.licenseNumber
            });

            // Update the user in AuthContext and localStorage
            updateUser({
                name: profile.name,
                phone: profile.phone,
                address: profile.address
            });

            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error('Failed to update profile: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="py-4">
            <Row>
                <Col md={8} className="mx-auto">
                    <Card className="shadow-sm">
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">👤 Shopkeeper Profile</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <h6 className="mb-3">Shop Information</h6>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Shop Name *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={profile.shopName}
                                                onChange={(e) => setProfile({ ...profile, shopName: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>License Number *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={profile.licenseNumber}
                                                onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Shop Address *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={profile.shopAddress}
                                        onChange={(e) => setProfile({ ...profile, shopAddress: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <hr />
                                <h6 className="mb-3">Personal Information</h6>

                                <Form.Group className="mb-3">
                                    <Form.Label>Full Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={profile.email}
                                        disabled
                                    />
                                    <Form.Text className="text-muted">Email cannot be changed</Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Phone *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Personal Address *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={profile.address}
                                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <div className="d-flex gap-2">
                                    <Button type="submit" variant="success" disabled={loading}>
                                        {loading ? 'Updating...' : 'Update Profile'}
                                    </Button>
                                    <Button type="button" variant="outline-secondary" onClick={() => window.history.back()}>
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ShopkeeperProfile;
