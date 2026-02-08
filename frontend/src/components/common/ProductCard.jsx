import './ProductCard.css';

import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { getValidImageUrl } from '../../utils/imageUtils';

const ProductCard = ({ product, onAddToCart, onDirectBuy }) => {
  // Support both API format (productName, imageUrl) and demo data format (name, image)
  const productName = product.productName || product.name;
  const photoLink = product.imageUrl || product.photoLink || product.image;
  const price = product.price;
  const discount = product.discount;
  const stock = product.stock;
  const description = product.description;

  // Calculate original price from discount if not provided
  const originalPrice = product.originalPrice || (discount ? price / (1 - discount / 100) : null);

  return (
    <Card className="product-card h-100">
      <div className="product-img-wrapper" style={{ height: '200px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {getValidImageUrl(photoLink) ? (
          <Card.Img
            variant="top"
            src={getValidImageUrl(photoLink)}
            alt={productName}
            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = '<span style="font-size: 3rem;">🛍️</span>';
            }}
          />
        ) : (
          <span style={{ fontSize: '3rem' }}>🛍️</span>
        )}
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-center">
          {productName}
        </Card.Title>

        {description && (
          <p className="text-muted text-center mb-2">
            {description}
          </p>
        )}

        <div className="text-center mb-2">
          {originalPrice && discount > 0 && (
            <small className="text-muted text-decoration-line-through me-2">
              ₹{Math.round(originalPrice).toLocaleString()}
            </small>
          )}
          <h5 className="text-success d-inline">
            ₹{price.toLocaleString()}
          </h5>
          {discount > 0 && (
            <Badge bg="danger" className="ms-2">
              {Math.round(discount)}% OFF
            </Badge>
          )}
        </div>

        {stock < 10 && stock > 0 && (
          <Badge bg="warning" className="mx-auto my-2">
            Low Stock
          </Badge>
        )}

        {stock === 0 && (
          <Badge bg="danger" className="mx-auto my-2">
            Out of Stock
          </Badge>
        )}

        <Button
          className="mt-auto add-cart-btn"
          onClick={onAddToCart}
          disabled={stock === 0}
        >
          🛒 Add to Cart
        </Button>
        {onDirectBuy && (
          <Button
            className="mt-2"
            variant="success"
            onClick={onDirectBuy}
            disabled={stock === 0}
          >
            ⚡ Buy Now
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;

