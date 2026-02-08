import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import productService from '../../services/productService';
import ProductCard from '../../components/common/ProductCard';
import { toast } from 'react-toastify';
import './Breadcrumb.css';

const AllProductsPage = () => {
  const navigate = useNavigate();
  const { user, addToCart } = useAuth();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [activeCategory, activeSubcategory, products]);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);

      // Extract unique categories
      const categoryMap = {};
      data.forEach(product => {
        if (!categoryMap[product.categoryId]) {
          categoryMap[product.categoryId] = {
            categoryId: product.categoryId,
            categoryName: product.categoryName,
            subcategories: {}
          };
        }

        if (!categoryMap[product.categoryId].subcategories[product.subCategoryId]) {
          categoryMap[product.categoryId].subcategories[product.subCategoryId] = {
            subCategoryId: product.subCategoryId,
            subCategoryName: product.subCategoryName
          };
        }
      });

      const categoriesArray = Object.values(categoryMap).map(cat => ({
        ...cat,
        subcategories: Object.values(cat.subcategories)
      }));

      setCategories(categoriesArray);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (activeCategory) {
      filtered = filtered.filter(p => p.categoryId === activeCategory);
    }

    if (activeSubcategory) {
      filtered = filtered.filter(p => p.subCategoryId === activeSubcategory);
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (user.role !== 'shopkeeper') {
      toast.error('Only shopkeepers can add items to cart');
      return;
    }
    if (addToCart(product)) {
      toast.success(`${product.productName || product.name} added to cart!`);
    }
  };

  const selectedCategory = categories.find(cat => cat.categoryId === activeCategory);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading products...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
          <Button variant="link" onClick={fetchAllProducts}>Try Again</Button>
        </Alert>
      </Container>
    );
  }

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
                    <Nav.Item key={category.categoryId}>
                      <Nav.Link
                        active={activeCategory === category.categoryId}
                        onClick={() => {
                          setActiveCategory(category.categoryId);
                          setActiveSubcategory(null);
                        }}
                      >
                        {category.categoryName}
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
                        All {selectedCategory.categoryName}
                      </Nav.Link>
                    </Nav.Item>
                    {selectedCategory.subcategories.map(subcategory => (
                      <Nav.Item key={subcategory.subCategoryId}>
                        <Nav.Link
                          active={activeSubcategory === subcategory.subCategoryId}
                          onClick={() => setActiveSubcategory(subcategory.subCategoryId)}
                          className="text-muted"
                        >
                          {subcategory.subCategoryName}
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
                !activeSubcategory ? `📱 ${selectedCategory?.categoryName}` :
                  `📱 ${selectedCategory?.subcategories.find(s => s.subCategoryId === activeSubcategory)?.subCategoryName}`}
            </h4>
            <Row>
              {filteredProducts.map(product => (
                <Col key={product.productId} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <ProductCard
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                </Col>
              ))}
            </Row>

            {filteredProducts.length === 0 && (
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