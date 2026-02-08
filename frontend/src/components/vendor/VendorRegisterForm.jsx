import React from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import { API_ENDPOINTS } from '../../config/api';

const VendorRegisterForm = ({ userId, onSuccess }) => {
    const initialValues = {
        businessName: '',
        businessCategory: '',
        gstNumber: ''
    };

    const validationSchema = Yup.object({
        businessName: Yup.string().required('Business Name is required'),
        businessCategory: Yup.string().required('Business Category is required'),
        gstNumber: Yup.string()
            .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST Number')
            .required('GST Number is required')
    });

    const handleSubmit = async (values, { setSubmitting, setStatus }) => {
        try {
            const payload = {
                userId: userId, // Link to the user created in Step 1
                businessName: values.businessName,
                businessCategory: values.businessCategory,
                gstNumber: values.gstNumber
            };

            await api.post('/users/vendor-register', payload);
            onSuccess();
        } catch (error) {
            console.error("Vendor Registration Error:", error);
            const errorMsg = error.response?.data?.message || error.response?.data || 'Failed to save vendor details.';
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
                    <h4 className="mb-4 text-center">Step 2: Business Details</h4>
                    <Alert variant="info">Account created! Please complete your business profile.</Alert>

                    {status && <Alert variant="danger">{status}</Alert>}

                    <Form.Group className="mb-3">
                        <Form.Label>Business Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="businessName"
                            placeholder="Enter business name"
                            value={values.businessName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.businessName && !!errors.businessName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.businessName}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Business Category</Form.Label>
                        <Form.Select
                            name="businessCategory"
                            value={values.businessCategory}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.businessCategory && !!errors.businessCategory}
                        >
                            <option value="">Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Home & Kitchen">Home & Kitchen</option>
                            <option value="Automotive">Automotive</option>
                            <option value="Others">Others</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.businessCategory}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>GST Number</Form.Label>
                        <Form.Control
                            type="text"
                            name="gstNumber"
                            placeholder="e.g. 22AAAAA0000A1Z5"
                            value={values.gstNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.gstNumber && !!errors.gstNumber}
                        />
                        <Form.Control.Feedback type="invalid">{errors.gstNumber}</Form.Control.Feedback>
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

export default VendorRegisterForm;
