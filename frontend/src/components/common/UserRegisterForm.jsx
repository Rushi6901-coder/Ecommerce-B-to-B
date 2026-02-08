import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import { API_ENDPOINTS } from '../../config/api';

const UserRegisterForm = ({ onSuccess }) => {
    const initialValues = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        role: 'SHOPKEEPER' // Default role
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
        phone: Yup.string().matches(/^\d{10}$/, 'Phone must be 10 digits').required('Phone is required'),
        address: Yup.string().required('Address is required'),
        role: Yup.string().required('Role is required')
    });

    const handleSubmit = async (values, { setSubmitting, setStatus }) => {
        try {
            // Prepare payload (exclude confirmPassword)
            const payload = {
                name: values.name,
                email: values.email,
                password: values.password,
                phone: values.phone,
                address: values.address,
                role: values.role
            };

            // Call User Registration Endpoint
            // Note: Backend endpoint for general user registration. 
            // Assuming UserController has @PostMapping("/register") mapped to /api/users/register
            const response = await api.post('/users/register', payload);

            console.log("User Registered:", response.data);

            // Pass the created user object (with ID) and selected role to parent
            onSuccess(response.data, values.role);
        } catch (error) {
            console.error("Registration Error:", error);
            const errorMsg = error.response?.data?.message || error.response?.data || 'Registration failed. Please try again.';
            setStatus(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                status
            }) => (
                <Form onSubmit={handleSubmit}>
                    <h4 className="mb-4 text-center">Step 1: Account Details</h4>

                    {status && <Alert variant="danger">{status}</Alert>}

                    <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.name && !!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.email && !!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            placeholder="10-digit number"
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.phone && !!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="address"
                            placeholder="Your address"
                            value={values.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.address && !!errors.address}
                        />
                        <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.password && !!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>I am a:</Form.Label>
                        <div className="d-flex gap-3">
                            <Form.Check
                                type="radio"
                                id="role-shopkeeper"
                                name="role"
                                value="SHOPKEEPER"
                                label="Shopkeeper (Buyer)"
                                checked={values.role === 'SHOPKEEPER'}
                                onChange={handleChange}
                            />
                            <Form.Check
                                type="radio"
                                id="role-vendor"
                                name="role"
                                value="VENDOR"
                                label="Vendor (Supplier)"
                                checked={values.role === 'VENDOR'}
                                onChange={handleChange}
                            />
                        </div>
                    </Form.Group>

                    <div className="d-grid">
                        <Button variant="primary" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating Account...' : 'Next Step →'}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default UserRegisterForm;
