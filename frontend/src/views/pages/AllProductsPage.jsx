import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { categories } from '../../data/demoData';
import ProductCard from '../../components/common/ProductCard';
import { toast } from 'react-toastify';
import './Breadcrumb.css';

const AllProductsPage = () => {
  const navigate = useNavigate();
  const { user, addToCart } = useAuth();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);

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
    if (!activeCategory) {
      return categories.flatMap(cat => 
        cat.subcategories.flatMap(sub => sub.products)
      );
    }
    
    const category = categories.find(cat => cat.id === activeCategory);
    if (!category) return [];
    
    if (!activeSubcategory) {
      return category.subcategories.flatMap(sub => sub.products);
    }
    
    const subcategory = category.subcategories.find(sub => sub.id === activeSubcategory);
    return subcategory ? subcategory.products : [];
  };

  const selectedCategory = categories.find(cat => cat.id === activeCategory);

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

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body className="text-center py-4">
              <h1>🛍️ All Products</h1>
              <p className="text-muted">Browse our complete product catalog</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Category Navigation */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">📂 Filter by Category</h5>
            </Card.Header>
            <Card.Body>
              <Nav variant="pills" className="flex-column flex-sm-row">
                <Nav.Item>
                  <Nav.Link 
                    active={!activeCategory}
                    onClick={() => {
                      setActiveCategory(null);
                      setActiveSubcategory(null);
                    }}
                  >
                    🏠 All Products
                  </Nav.Link>
                </Nav.Item>
                {categories.map(category => (
                  <Nav.Item key={category.id}>
                    <Nav.Link
                      active={activeCategory === category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setActiveSubcategory(null);
                      }}
                    >
                      {category.name}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
              
              {/* Subcategory Navigation */}
              {selectedCategory && (
                <Nav variant="pills" className="mt-3 flex-column flex-sm-row">
                  <Nav.Item>
                    <Nav.Link 
                      active={!activeSubcategory}
                      onClick={() => setActiveSubcategory(null)}
                      className="text-muted"
                    >
                      All {selectedCategory.name}
                    </Nav.Link>
                  </Nav.Item>
                  {selectedCategory.subcategories.map(subcategory => (
                    <Nav.Item key={subcategory.id}>
                      <Nav.Link
                        active={activeSubcategory === subcategory.id}
                        onClick={() => setActiveSubcategory(subcategory.id)}
                        className="text-muted"
                      >
                        {subcategory.name}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Products Grid */}
      <Row>
        <Col>
          <h4 className="mb-3">
            {!activeCategory ? '🛍️ All Products' : 
             !activeSubcategory ? `📱 ${selectedCategory?.name}` :
             `📱 ${selectedCategory?.subcategories.find(s => s.id === activeSubcategory)?.name}`}
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
                <p className="text-muted">Try selecting a different category</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      </Container>
    </div>
  );
};

export default AllProductsPage;