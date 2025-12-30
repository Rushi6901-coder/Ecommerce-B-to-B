import './ProductCard.css';

import React from 'react';
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Card className="product-card h-100 shadow-sm border-0">
      {product.image && (
        <div className="position-relative">
          <Card.Img 
            variant="top" 
            src={product.image} 
            alt={product.name}
            style={{ height: '220px', objectFit: 'cover' }}
          />
          {product.discount && (
            <Badge 
              bg="danger" 
              className="position-absolute top-0 end-0 m-2"
              style={{ fontSize: '0.8rem' }}
            >
              {product.discount}% OFF
            </Badge>
          )}
        </div>
      )}
      <Card.Body className="d-flex flex-column p-3">
        <Card.Title className="h6 mb-2 text-truncate">
          {product.name}
        </Card.Title>

        <p className="text-muted small mb-3" style={{ fontSize: '0.85rem', lineHeight: '1.3' }}>
          {product.description?.length > 60 
            ? product.description.substring(0, 60) + '...' 
            : product.description}
        </p>

        <div className="mb-3">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              {product.originalPrice && (
                <small className="text-muted text-decoration-line-through d-block">
                  ₹{product.originalPrice.toLocaleString()}
                </small>
              )}
              <h5 className="text-success mb-0">
                ₹{product.price.toLocaleString()}
              </h5>
            </div>
            {product.stock < 10 && (
              <Badge bg="warning" text="dark" className="small">
                Low Stock
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-auto">
          <Row className="g-2">
            {user?.role === 'shopkeeper' && (
              <Col xs={12}>
                <Button
                  variant="success"
                  size="sm"
                  className="w-100"
                  onClick={onAddToCart}
                >
                  Add to Cart
                </Button>
              </Col>
            )}
            {user?.role === 'vendor' && (
              <Col xs={12}>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="w-100"
                  disabled
                >
                  Your Product
                </Button>
              </Col>
            )}
            {!user && (
              <Col xs={12}>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-100"
                  onClick={() => navigate('/login')}
                >
                  Login to Buy
                </Button>
              </Col>
            )}
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
