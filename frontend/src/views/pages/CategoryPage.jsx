import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import productService from '../../services/productService';
import ProductCard from '../../components/common/ProductCard';
import { toast } from 'react-toastify';
import './Breadcrumb.css';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { user, addToCart } = useAuth();
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryProducts();
  }, [categoryId, activeSubcategory]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);

      if (activeSubcategory) {
        // Fetch products by subcategory
        const data = await productService.getProductsBySubCategory(activeSubcategory);
        setProducts(data);
      } else {
        // Fetch products by category
        const data = await productService.getProductsByCategory(categoryId);
        setProducts(data);

        // Extract category info from first product or assume
        if (data.length > 0) {
          setCategory({
            id: categoryId,
            name: data[0].categoryName || 'Category',
            subcategories: extractSubcategories(data)
          });
        } else {
          // No products, but we should still show the category structure
          // Ideally fetch category by ID from backend
          setCategory({ id: categoryId, name: 'Category', subcategories: [] });
        }
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const extractSubcategories = (products) => {
    const subCatMap = {};
    products.forEach(product => {
      // Backend Product might have subCategoryId or subCategory.id
      const subId = product.subCategoryId || product.subCategory?.id;
      const subName = product.subCategoryName || product.subCategory?.name;
      if (subId && !subCatMap[subId]) {
        subCatMap[subId] = {
          id: subId,
          name: subName
        };
      }
    });
    return Object.values(subCatMap);
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
    addToCart(product);
    toast.success(`${product.productName || product.name} added to cart!`);
  };

  const selectedSubcategory = category?.subcategories?.find(sub => sub.id === activeSubcategory);

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
          <Button variant="link" onClick={fetchCategoryProducts}>Try Again</Button>
        </Alert>
      </Container>
    );
  }

  if (!category && products.length === 0) {
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
                <h1>{category?.name || 'Category'}</h1>
                <p className="text-muted">Explore our {category?.name?.toLowerCase() || 'products'} collection</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Subcategory Navigation */}
        {category?.subcategories && category.subcategories.length > 0 && (
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
        )}

        {/* Products Grid */}
        <Row>
          <Col>
            <h4 className="mb-3">
              {!activeSubcategory ?
                `🛍️ All ${category?.name || 'Products'}` :
                `📱 ${selectedSubcategory?.name}`
              }
            </h4>
            <Row>
              {products.map(product => (
                <Col key={product.productId} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <ProductCard
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                </Col>
              ))}
            </Row>

            {products.length === 0 && (
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