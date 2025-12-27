import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { categories } from '../../data/demoData';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import LoginModal from '../common/LoginModal';
import ProductCard from '../common/ProductCard';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const { user, addToCart } = useAuth();

  const handleAddToCart = (product) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (user.role !== 'shopkeeper') {
      toast.error('Only shopkeepers can add items to cart!');
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const renderCategories = () => (
    <>
      <div className="text-center mb-4">
        <h2 className="display-4">Welcome to B2B Commerce</h2>
        <p className="lead">Choose from our wide range of product categories</p>
      </div>
      <Row className="g-4">
        {categories.map(category => (
          <Col xs={12} sm={6} md={4} lg={3} key={category.id}>
            <Card className="h-100 shadow-sm hover-card">
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-center mb-3">{category.name}</Card.Title>
                <div className="mt-auto">
                  <Button 
                    variant="primary" 
                    className="w-100"
                    onClick={() => setSelectedCategory(category)}
                  >
                    View Subcategories
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );

  const renderSubcategories = () => (
    <>
      <div className="d-flex align-items-center mb-4">
        <Button variant="outline-secondary" onClick={() => setSelectedCategory(null)} className="me-3">
          ← Back
        </Button>
        <h3 className="mb-0">{selectedCategory.name} - Subcategories</h3>
      </div>
      <Row className="g-4">
        {selectedCategory.subcategories.map(sub => (
          <Col xs={12} sm={6} md={4} lg={3} key={sub.id}>
            <Card className="h-100 shadow-sm hover-card">
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-center mb-3">{sub.name}</Card.Title>
                <div className="mt-auto">
                  <Button 
                    variant="primary" 
                    className="w-100"
                    onClick={() => setSelectedSubcategory(sub)}
                  >
                    View Products ({sub.products.length})
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );

  const renderProducts = () => (
    <>
      <div className="d-flex align-items-center mb-4">
        <Button variant="outline-secondary" onClick={() => setSelectedSubcategory(null)} className="me-3">
          ← Back
        </Button>
        <h3 className="mb-0">{selectedSubcategory.name} - Products</h3>
      </div>
      <Row className="g-4">
        {selectedSubcategory.products.map(product => (
          <Col xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </>
  );

  return (
    <Container fluid className="py-4">
      <style>
        {`
          .hover-card {
            transition: transform 0.2s ease-in-out;
          }
          .hover-card:hover {
            transform: translateY(-5px);
          }
        `}
      </style>
      {!selectedCategory && renderCategories()}
      {selectedCategory && !selectedSubcategory && renderSubcategories()}
      {selectedSubcategory && renderProducts()}
      
      <LoginModal show={showLogin} onHide={() => setShowLogin(false)} />
    </Container>
  );
};

export default Home;