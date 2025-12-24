import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Badge } from 'react-bootstrap';
import { categories } from '../../data/demoData';
import { toast } from 'react-toastify';

const VendorProductManager = () => {
  const [products, setProducts] = useState(
    categories.flatMap(cat => 
      cat.subcategories.flatMap(sub => sub.products)
    )
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      discount: product.discount || 0,
      description: product.description,
      image: product.image
    });
    setShowEditModal(true);
  };

  const handleSaveProduct = () => {
    const updatedProducts = products.map(p => 
      p.id === editingProduct.id 
        ? { 
            ...p, 
            ...formData,
            discount: Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)
          }
        : p
    );
    setProducts(updatedProducts);
    setShowEditModal(false);
    toast.success('Product updated successfully!');
  };

  const calculateDiscount = (original, current) => {
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <Container className="mt-4">
      <h2>📦 Product Management</h2>
      <p className="text-muted">Manage your products and set discounts</p>
      
      <Row className="g-4">
        {products.map(product => (
          <Col xs={12} sm={6} md={4} lg={3} key={product.id}>
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
              <div style={{ height: '150px', overflow: 'hidden' }}>
                <Card.Img 
                  variant="top" 
                  src={product.image} 
                  alt={product.name}
                  style={{ 
                    height: '100%', 
                    width: '100%', 
                    objectFit: 'cover'
                  }}
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
                    <span className="h6 text-success mb-0">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-muted text-decoration-line-through small">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => handleEditProduct(product)}
                  className="mt-auto"
                >
                  ✏️ Edit Product
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="url"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Form.Group>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Original Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.originalPrice || ''}
                    onChange={(e) => {
                      const originalPrice = parseFloat(e.target.value);
                      setFormData({
                        ...formData, 
                        originalPrice,
                        discount: calculateDiscount(originalPrice, formData.price)
                      });
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Selling Price (₹)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => {
                      const price = parseFloat(e.target.value);
                      setFormData({
                        ...formData, 
                        price,
                        discount: calculateDiscount(formData.originalPrice, price)
                      });
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount (%)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.discount || 0}
                    readOnly
                    className="bg-light"
                  />
                  <Form.Text className="text-muted">
                    Auto-calculated based on prices
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            {/* Preview */}
            {formData.image && (
              <div className="mb-3">
                <Form.Label>Image Preview</Form.Label>
                <div style={{ height: '150px', width: '150px' }}>
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    style={{ 
                      height: '100%', 
                      width: '100%', 
                      objectFit: 'cover',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveProduct}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default VendorProductManager;