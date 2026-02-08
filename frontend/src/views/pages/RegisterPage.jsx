import React, { useState } from 'react';
import { Container, Card, Row, Col, Button, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserRegisterForm from '../../components/common/UserRegisterForm';
import VendorRegisterForm from '../../components/vendor/VendorRegisterForm';
import ShopkeeperRegisterForm from '../../components/shopkeeper/ShopkeeperRegisterForm';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [step, setStep] = useState(1);
    const [userData, setUserData] = useState(null);
    const [role, setRole] = useState('');

    // Step 1 Success Handler
    const handleUserRegistered = (user, selectedRole) => {
        setUserData(user);
        setRole(selectedRole);
        setStep(2); // Move to role-specific details
    };

    // Step 2 Success Handler
    const handleFinalSuccess = async () => {
        try {
            // Construct user object for auto-login
            // We trust the registration was successful and just use the data we have.
            // Ideally backend would return the full user object on step 2, but for now we construct it.
            const userForLogin = {
                ...userData,
                role: role
            };

            // Call login with the object to set session directly
            await login(userForLogin);

            toast.success("🎉 Registration successful! Welcome aboard.");

            // Redirect based on role
            if (role === 'VENDOR') {
                navigate('/dashboard');
            } else {
                navigate('/'); // Shopkeepers go to home to shop
            }
        } catch (error) {
            console.error("Auto-login failed:", error);
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        }
    };

    return (
        <Container className="py-5" style={{ minHeight: '80vh' }}>
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-lg border-0">
                        <Card.Body className="p-4">
                            <h2 className="text-center mb-4">Create Account</h2>

                            <ProgressBar
                                now={step === 1 ? 50 : 100}
                                label={`Step ${step} of 2`}
                                className="mb-4"
                                variant="success"
                            />

                            {step === 1 && (
                                <UserRegisterForm onSuccess={handleUserRegistered} />
                            )}

                            {step === 2 && role === 'VENDOR' && (
                                <VendorRegisterForm userId={userData.id} onSuccess={handleFinalSuccess} />
                            )}

                            {step === 2 && role === 'SHOPKEEPER' && (
                                <ShopkeeperRegisterForm userId={userData.id} onSuccess={handleFinalSuccess} />
                            )}

                            <div className="text-center mt-3">
                                <small className="text-muted">
                                    Already have an account? <Button variant="link" className="p-0" onClick={() => navigate('/login')}>Login</Button>
                                </small>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterPage;
