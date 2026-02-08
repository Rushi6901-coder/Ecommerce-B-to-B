import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';

const VendorProductManager = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: 0,
    stockQuantity: '',
    categoryId: '',
    subCategoryId: ''
  });

  useEffect(() => {
    if (user?.vendorId) {
      fetchProducts();
      fetchCategories();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await api.get(`/products/vendor/${user.vendorId}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('🔍 Fetching categories...');
      const response = await api.get('/categories');
      console.log('✅ Categories response:', response.data);
      console.log('📊 Number of categories:', response.data.length);
      if (response.data.length > 0) {
        console.log('📦 First category:', response.data[0]);
        console.log('📂 Subcategories of first category:', response.data[0].subCategories);
      }
      setCategories(response.data);
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      console.error('❌ Error response:', error.response);
      toast.error('Failed to load categories');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      discount: 0,
      stockQuantity: '',
      categoryId: '',
      subCategoryId: ''
    });
    setSelectedImage(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);

    // Find the category that contains this subcategory
    let foundCategoryId = '';
    if (product.subCategory?.id) {
      const category = categories.find(cat =>
        cat.subCategories?.some(sub => sub.id === product.subCategory.id)
      );
      foundCategoryId = category?.id || '';
    }

    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      discount: product.discount || 0,
      stockQuantity: product.stockQuantity,
      categoryId: foundCategoryId,
      subCategoryId: product.subCategory?.id || ''
    });
    setSelectedImage(null);
    setImagePreview(product.imageUrl ? `http://localhost:8080${product.imageUrl}` : null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('discount', formData.discount);
    data.append('stockQuantity', formData.stockQuantity);
    data.append('subCategoryId', formData.subCategoryId);
    data.append('vendorId', user.vendorId);

    if (selectedImage) {
      data.append('image', selectedImage);
    }

    try {
      let updatedProduct;
      if (editingProduct) {
        const response = await api.put(`/products/${editingProduct.id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        updatedProduct = response.data;
        toast.success('Product updated successfully');
      } else {
        const response = await api.post('/products', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        updatedProduct = response.data;
        toast.success('Product added successfully');
      }
      setShowModal(false);
      // Immediately update the products list
      await fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const selectedCategory = categories.find(c => c.id === parseInt(formData.categoryId));
  const subcategories = selectedCategory?.subCategories || [];

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>📦 Product Management</h2>
          <p className="text-muted">{products.length} products</p>
        </div>
        <Button variant="success" onClick={handleAdd}>+ Add Product</Button>
      </div>

      <Row className="g-4">
        {products.length === 0 ? (
          <Col>
            <Card className="text-center py-5">
              <Card.Body>
                <h5 className="text-muted">No products yet</h5>
                <p>Click "Add Product" to get started</p>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          products.map(product => (
            <Col xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card className="h-100 shadow-sm position-relative">
                {product.discount > 0 && (
                  <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                    {product.discount}% OFF
                  </Badge>
                )}
                <div style={{ height: '180px', overflow: 'hidden' }}>
                  <Card.Img
                    variant="top"
                    src={product.imageUrl ? `http://localhost:8080${product.imageUrl}` : 'https://via.placeholder.com/150'}
                    style={{ height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <Card.Body>
                  <Card.Title className="text-truncate">{product.name}</Card.Title>
                  <div className="mb-2">
                    <Badge bg="info" className="me-2">
                      {product.subCategory?.name || 'N/A'}
                    </Badge>
                    <Badge bg={product.stockQuantity > 0 ? 'success' : 'danger'}>
                      Stock: {product.stockQuantity}
                    </Badge>
                  </div>
                  <div className="mb-2">
                    {product.discount > 0 ? (
                      <>
                        <div>
                          <span style={{ textDecoration: 'line-through', color: '#6c757d', fontSize: '0.9rem' }}>
                            ₹{Number(product.price).toFixed(2)}
                          </span>
                        </div>
                        <h5 className="text-success mb-0">
                          ₹{(Number(product.price) * (1 - product.discount / 100)).toFixed(2)}
                        </h5>
                      </>
                    ) : (
                      <h5 className="text-primary mb-0">₹{Number(product.price).toFixed(2)}</h5>
                    )}
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="flex-grow-1"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      🗑️
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit' : 'Add'} Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, subCategoryId: '' })}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Subcategory *</Form.Label>
                  <Form.Select
                    value={formData.subCategoryId}
                    onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value })}
                    required
                    disabled={!formData.categoryId}
                  >
                    <option value="">{formData.categoryId ? 'Select Subcategory' : 'Select Category First'}</option>
                    {subcategories.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount (%)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity *</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                  />
                </div>
              )}
            </Form.Group>

            <div className="text-end">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingProduct ? 'Update' : 'Add'} Product
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default VendorProductManager;