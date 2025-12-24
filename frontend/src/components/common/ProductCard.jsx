import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart, user } = useAuth();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <Card className="h-100 shadow-sm position-relative">
      {/* Discount Badge */}
      {product.discount > 0 && (
        <Badge 
          bg="danger" 
          className="position-absolute top-0 end-0 m-2"
          style={{ zIndex: 1, fontSize: '0.8rem' }}
        >
          {product.discount}% OFF
        </Badge>
      )}
      
      {/* Product Image */}
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <Card.Img 
          variant="top" 
          src={product.image} 
          alt={product.name}
          style={{ 
            height: '100%', 
            width: '100%', 
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        />
      </div>
      
      <Card.Body className="d-flex flex-column">
        <Card.Title className="h6">{product.name}</Card.Title>
        <Card.Text className="text-muted small flex-grow-1">
          {product.description}
        </Card.Text>
        
        {/* Price Section */}
        <div className="mb-2">
          <div className="d-flex align-items-center gap-2">
            <span className="h5 text-success mb-0">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-muted text-decoration-line-through small">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <small className="text-muted">by {product.vendor}</small>
        </div>
        
        {/* Action Button */}
        {user?.role === 'shopkeeper' && (
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleAddToCart}
            className="mt-auto"
          >
            🛒 Add to Cart
          </Button>
        )}
        
        {user?.role === 'vendor' && (
          <Button 
            variant="outline-primary" 
            size="sm"
            className="mt-auto"
          >
            ✏️ Edit Product
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;