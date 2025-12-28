import './ProductCard.css';

import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <Card className="product-card h-100">
      {product.image && (
        <Card.Img 
          variant="top" 
          src={product.image} 
          alt={product.name}
          style={{ height: '200px', objectFit: 'cover' }}
        />
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-center">
          {product.name}
        </Card.Title>

        <p className="text-muted text-center mb-2">
          {product.description}
        </p>

        <div className="text-center mb-2">
          {product.originalPrice && (
            <small className="text-muted text-decoration-line-through me-2">
              ₹{product.originalPrice.toLocaleString()}
            </small>
          )}
          <h5 className="text-success d-inline">
            ₹{product.price.toLocaleString()}
          </h5>
          {product.discount && (
            <Badge bg="danger" className="ms-2">
              {product.discount}% OFF
            </Badge>
          )}
        </div>

        {product.stock < 10 && (
          <Badge bg="warning" className="mx-auto my-2">
            Low Stock
          </Badge>
        )}

        <Button
          className="mt-auto add-cart-btn"
          onClick={onAddToCart}
        >
          🛒 Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
