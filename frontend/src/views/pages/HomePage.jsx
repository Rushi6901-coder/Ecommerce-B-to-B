import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getValidImageUrl } from '../../utils/imageUtils';
import categoryService from '../../services/categoryService';
import productService from '../../services/productService';
import './Home.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch categories directly (includes PhotoLink and SubCategories)
      const categoriesData = await categoryService.getAllCategories();

      // We also need product counts. 
      // Option A: Backend adds productCount to CategoryDto (Cleaner)
      // Option B: We fetch all products and count them (Current approach)
      // For now, let's fetch products to count them, but use categoriesData for the main structure.
      const productsData = await productService.getAllProducts();

      // Create a map of product counts
      const counts = {};
      productsData.forEach(p => {
        // Note: ProductDto might be missing CategoryId, so we rely on CategoryName if needed 
        // OR ideally we fix ProductDto.
        // If we fixed DTO, we'd use p.categoryId. 
        // For now, let's try to match by name if ID is missing.
      });

      // Actually, let's just use the categoriesData. 
      // If we need counts, the backend should provide them or we accept 0 for now until DTO fix.

      const enrichedCategories = categoriesData.map(cat => {
        // Count products for this category (if possible)
        // Since we know ProductDto is missing CategoryId, we can't count accurately client-side yet.
        // We will default to "Active" or something, or wait for DTO fix.
        return {
          ...cat,
          productCount: 'Available', // Placeholder
          subcategories: cat.subCategories || []
        };
      });

      setCategories(enrichedCategories);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load shop data.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAllProducts = () => {
    navigate('/products');
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  // Category icons mapping
  const getCategoryIcon = (categoryName) => {
    if (!categoryName) return '📦'; // Default icon for undefined/null
    const name = categoryName.toLowerCase();
    if (name.includes('electronic')) return '📱';
    if (name.includes('fashion')) return '👕';
    if (name.includes('home') || name.includes('kitchen')) return '🏠';
    if (name.includes('sport') || name.includes('fitness')) return '🏋️';
    if (name.includes('book') || name.includes('stationery')) return '📚';
    if (name.includes('automotive') || name.includes('auto')) return '🚗';
    return '📦';
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading categories...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
          <Button variant="link" onClick={fetchData}>Try Again</Button>
        </Alert>
      </Container>
    );
  }

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
          {categories.map(category => (
            <Col key={category.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card
                className="category-card h-100 text-center"
                onClick={() => handleCategoryClick(category.id)}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="d-flex flex-column">
                  <div 
                    className="category-icon mb-3" 
                    style={{ 
                      height: '120px', 
                      backgroundImage: getValidImageUrl(category.photo) ? `url(${getValidImageUrl(category.photo)})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: '8px',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    {!getValidImageUrl(category.photo) && (
                      <span style={{ fontSize: '3rem' }}>{getCategoryIcon(category.name)}</span>
                    )}
                    {getValidImageUrl(category.photo) && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ fontSize: '2.5rem', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                          {getCategoryIcon(category.name)}
                        </span>
                      </div>
                    )}
                  </div>
                  <Card.Title className="mb-3">{category.name}</Card.Title>
                  <p className="text-muted mb-3">
                    {category.subcategories?.length || 0} subcategories
                  </p>
                  <p className="text-muted mb-4">
                    {category.productCount} products available
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
          ))}
        </Row>

        {categories.length === 0 && !loading && (
          <Row className="mt-5">
            <Col>
              <Alert variant="info" className="text-center">
                <h5>No categories available yet</h5>
                <p>Please add categories through the admin panel to get started.</p>
              </Alert>
            </Col>
          </Row>
        )}

        {/* Quick Stats */}
        {categories.length > 0 && (
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
                        Active
                      </h3>
                      <p className="text-muted">Products</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default HomePage;