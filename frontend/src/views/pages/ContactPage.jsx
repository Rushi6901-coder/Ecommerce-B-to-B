import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Input from '../components/Input';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';

const ContactPage = () => {
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    subject: Yup.string().required('Subject is required'),
    message: Yup.string().required('Message is required')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        await api.post('/ContactQuery', values);
        toast.success('Message sent successfully!');
        resetForm();
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message.');
      }
      setLoading(false);
    }
  });

  return (
    <div className="page-container">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow">
              <Card.Body className="p-5">
                <h2 className="text-center mb-4">📞 Contact Us</h2>
                <Form onSubmit={formik.handleSubmit}>
                  <Input
                    label="Name"
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.name && formik.errors.name}
                    error={formik.touched.name && formik.errors.name}
                  />
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.email && formik.errors.email}
                    error={formik.touched.email && formik.errors.email}
                  />
                  <Input
                    label="Subject"
                    type="text"
                    name="subject"
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.subject && formik.errors.subject}
                    error={formik.touched.subject && formik.errors.subject}
                  />
                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="message"
                      value={formik.values.message}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.message && formik.errors.message}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.message}</Form.Control.Feedback>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactPage;