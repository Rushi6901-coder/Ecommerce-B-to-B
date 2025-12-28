import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { categories } from '../../data/demoData';
import './Home.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleViewAllProducts = () => {
    navigate('/products');
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <div className="home-container">
      <Container fluid className="py-4">
        {/* Hero Section */}
        <Row className="mb-5">
          <Col>
            <Card className="hero-card text-center">
              <Card.Body className="py-5">
                <h1 className="display-4 mb-3">🚀 B2B Commerce Platform</h1>
                <p className="lead mb-4">Discover premium products for your business needs</p>
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleViewAllProducts}
                  className="me-3"
                >
                  🛍️ View All Products
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Categories Section */}
        <Row className="mb-4">
          <Col>
            <h2 className="text-center mb-4 text-white">📂 Shop by Category</h2>
          </Col>
        </Row>

        <Row className="justify-content-center">
          {categories.map(category => {
            const totalProducts = category.subcategories.reduce(
              (total, sub) => total + sub.products.length, 0
            );
            
            return (
              <Col key={category.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card 
                  className="category-card h-100 text-center" 
                  onClick={() => handleCategoryClick(category.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className="d-flex flex-column">
                    <div className="category-icon mb-3">
                      {category.name === 'Electronics' ? '📱' : 
                       category.name === 'Fashion' ? '👕' :
                       category.name === 'Home & Kitchen' ? '🏠' :
                       category.name === 'Sports & Fitness' ? '🏋️' :
                       category.name === 'Books & Stationery' ? '📚' :
                       category.name === 'Automotive' ? '🚗' : '📦'}
                    </div>
                    <Card.Title className="mb-3">{category.name}</Card.Title>
                    <p className="text-muted mb-3">
                      {category.subcategories.length} subcategories
                    </p>
                    <p className="text-muted mb-4">
                      {totalProducts} products available
                    </p>
                    <Button 
                      variant="outline-primary" 
                      className="mt-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(category.id);
                      }}
                    >
                      Explore {category.name} →
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* Quick Stats */}
        <Row className="mt-5">
          <Col>
            <Card className="stats-card">
              <Card.Body className="text-center py-4">
                <Row>
                  <Col md={4}>
                    <h3 className="text-primary">{categories.length}</h3>
                    <p className="text-muted">Categories</p>
                  </Col>
                  <Col md={4}>
                    <h3 className="text-success">
                      {categories.reduce((total, cat) => total + cat.subcategories.length, 0)}
                    </h3>
                    <p className="text-muted">Subcategories</p>
                  </Col>
                  <Col md={4}>
                    <h3 className="text-info">
                      {categories.reduce((total, cat) => 
                        total + cat.subcategories.reduce((subTotal, sub) => 
                          subTotal + sub.products.length, 0
                        ), 0
                      )}
                    </h3>
                    <p className="text-muted">Products</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;