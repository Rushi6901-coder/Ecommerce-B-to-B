import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';

const ShopkeeperRegisterForm = ({ userId, onSuccess }) => {
    const initialValues = {
        shopName: '',
        shopAddress: '',
        licenseNumber: ''
    };

    const validationSchema = Yup.object({
        shopName: Yup.string().required('Shop Name is required'),
        shopAddress: Yup.string().required('Shop Address is required'),
        licenseNumber: Yup.string().required('License Number/Registration ID is required')
    });

    const handleSubmit = async (values, { setSubmitting, setStatus }) => {
        try {
            const payload = {
                userId: userId, // Link to the user created in Step 1
                shopName: values.shopName,
                shopAddress: values.shopAddress,
                licenseNumber: values.licenseNumber
            };

            await api.post('/users/shopkeeper-register', payload);
            onSuccess();
        } catch (error) {
            console.error("Shopkeeper Registration Error:", error);
            const errorMsg = error.response?.data?.message || error.response?.data || 'Failed to save shop details.';
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
                    <h4 className="mb-4 text-center">Step 2: Shop Details</h4>
                    <Alert variant="info">Account created! Please complete your shop profile.</Alert>

                    {status && <Alert variant="danger">{status}</Alert>}

                    <Form.Group className="mb-3">
                        <Form.Label>Shop Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="shopName"
                            placeholder="Enter shop name"
                            value={values.shopName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.shopName && !!errors.shopName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.shopName}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Shop Address</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="shopAddress"
                            placeholder="Physical address of the shop"
                            value={values.shopAddress}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.shopAddress && !!errors.shopAddress}
                        />
                        <Form.Control.Feedback type="invalid">{errors.shopAddress}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>License / Registration Number</Form.Label>
                        <Form.Control
                            type="text"
                            name="licenseNumber"
                            placeholder="e.g. SHOP-123456"
                            value={values.licenseNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.licenseNumber && !!errors.licenseNumber}
                        />
                        <Form.Control.Feedback type="invalid">{errors.licenseNumber}</Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-grid">
                        <Button variant="success" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Finalizing...' : 'Complete Registration'}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default ShopkeeperRegisterForm;
