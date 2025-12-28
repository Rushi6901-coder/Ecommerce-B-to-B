import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container>
        <Row>
          <Col md={6}>
            <h5>🚀 B2B Commerce</h5>
            <p className="mb-0">Your trusted business partner</p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="mb-0">© 2024 B2B Commerce. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;