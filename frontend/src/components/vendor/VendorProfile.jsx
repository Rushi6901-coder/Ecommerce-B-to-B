import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';

const VendorProfile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        shopName: '',
        businessCategory: '',
        gstNumber: '',
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        const fetchVendorDetails = async () => {
            if (user && user.vendorId) {
                try {
                    // Fetch vendor details
                    const vendorResponse = await api.get(`/vendor/${user.vendorId}`);
                    const vendorData = vendorResponse.data;

                    setProfile({
                        shopName: vendorData.shopName || '',
                        businessCategory: vendorData.businessCategory || '',
                        gstNumber: vendorData.gstNumber || '',
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        address: user.address || ''
                    });
                } catch (error) {
                    console.error('Error fetching vendor details:', error);
                    toast.error('Failed to load vendor details');
                    // Fallback to user data only
                    setProfile({
                        shopName: '',
                        businessCategory: '',
                        gstNumber: '',
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        address: user.address || ''
                    });
                }
            }
        };

        fetchVendorDetails();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            // Update user details
            const userResponse = await api.put(`/users/${user.id}`, {
                name: profile.name,
                phone: profile.phone,
                address: profile.address
            });

            // Update vendor details
            await api.put(`/vendor/${user.vendorId}`, {
                businessName: profile.shopName,
                businessCategory: profile.businessCategory,
                gstNumber: profile.gstNumber
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
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">👤 Vendor Profile</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <h6 className="mb-3">Business Information</h6>
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
                                            <Form.Label>Business Category *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={profile.businessCategory}
                                                onChange={(e) => setProfile({ ...profile, businessCategory: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>GST Number *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={profile.gstNumber}
                                        onChange={(e) => setProfile({ ...profile, gstNumber: e.target.value })}
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
                                    <Form.Label>Address *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={profile.address}
                                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <div className="d-flex gap-2">
                                    <Button type="submit" variant="primary" disabled={loading}>
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

export default VendorProfile;
