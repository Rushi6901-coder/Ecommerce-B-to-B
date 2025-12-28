import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { categories } from '../../data/demoData';
import ProductCard from '../../components/common/ProductCard';
import { toast } from 'react-toastify';
import './Breadcrumb.css';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { user, addToCart } = useAuth();
  const [activeSubcategory, setActiveSubcategory] = useState(null);

  const category = categories.find(cat => cat.id === parseInt(categoryId));

  if (!category) {
    return (
      <Container className="py-5">
        <Card className="text-center">
          <Card.Body>
            <h3>Category not found</h3>
            <Button onClick={() => navigate('/')}>Go Back Home</Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const handleAddToCart = (product) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (user.role !== 'shopkeeper') {
      toast.error('Only shopkeepers can add items to cart');
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const getProductsToShow = () => {
    if (!activeSubcategory) {
      return category.subcategories.flatMap(sub => sub.products);
    }
    const subcategory = category.subcategories.find(sub => sub.id === activeSubcategory);
    return subcategory ? subcategory.products : [];
  };

  const selectedSubcategory = category.subcategories.find(sub => sub.id === activeSubcategory);

  return (
    <div className="page-container">
      <Container className="py-4">
      {/* Breadcrumb */}
      <Row className="mb-4">
        <Col>
          <Button 
            variant="primary" 
            onClick={() => navigate('/')} 
            className="breadcrumb-home-btn"
          >
            🏠 Home
          </Button>
        </Col>
      </Row>

      {/* Category Header */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body className="text-center py-4">
              <h1>{category.name}</h1>
              <p className="text-muted">Explore our {category.name.toLowerCase()} collection</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Subcategory Navigation */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">📂 Subcategories</h5>
            </Card.Header>
            <Card.Body>
              <Nav variant="pills" className="flex-column flex-sm-row">
                <Nav.Item>
                  <Nav.Link 
                    active={!activeSubcategory}
                    onClick={() => setActiveSubcategory(null)}
                  >
                    All {category.name}
                  </Nav.Link>
                </Nav.Item>
                {category.subcategories.map(subcategory => (
                  <Nav.Item key={subcategory.id}>
                    <Nav.Link
                      active={activeSubcategory === subcategory.id}
                      onClick={() => setActiveSubcategory(subcategory.id)}
                    >
                      {subcategory.name}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Products Grid */}
      <Row>
        <Col>
          <h4 className="mb-3">
            {!activeSubcategory ? 
              `🛍️ All ${category.name}` : 
              `📱 ${selectedSubcategory?.name}`
            }
          </h4>
          <Row>
            {getProductsToShow().map(product => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <ProductCard 
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                />
              </Col>
            ))}
          </Row>
          
          {getProductsToShow().length === 0 && (
            <Card className="text-center py-5">
              <Card.Body>
                <h5 className="text-muted">No products found</h5>
                <p className="text-muted">Try selecting a different subcategory</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      </Container>
    </div>
  );
};

export default CategoryPage;