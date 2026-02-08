import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Alert, Modal } from 'react-bootstrap';
import { API_ENDPOINTS } from '../../config/api';

const CategoryManager = ({ onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');

  // Edit state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      // DEBUG: Check who I am
      fetch(`${API_ENDPOINTS.categories.split('/categories')[0]}/users/me`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('b2b_token')}` }
      })
        .then(r => r.json())
        .then(data => console.log("CURRENT USER AUTH STATE:", data))
        .catch(e => console.error("Could not check auth state", e));

      const response = await fetch(API_ENDPOINTS.categories);
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } else {
        setMessage(`Error fetching categories: ${response.status}`);
      }
    } catch (error) {
      setMessage(`Error fetching categories: ${error.message}`);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      if (description) formData.append('description', description);
      if (photo) formData.append('photo', photo);

      const response = await fetch(API_ENDPOINTS.categories, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('b2b_token')}`
          // No 'Content-Type': 'application/json' for FormData, fetch automatically sets multipart boundary
        },
        body: formData
      });

      if (response.ok) {
        setName('');
        setDescription('');
        setPhoto(null);
        // Reset file input manually if needed using ref, but usually internal state is enough if key changes or form resets
        document.getElementById('cat-photo-input').value = '';

        setMessage('Category added successfully');
        fetchCategories();
        onCategoryChange?.();
      } else {
        const err = await response.json().catch(() => ({}));
        setMessage(`Error adding category: ${err.message || response.statusText}`);
      }
    } catch (error) {
      setMessage('Error adding category');
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? All subcategories will also be deleted.')) {
      try {
        const response = await fetch(`${API_ENDPOINTS.categories}/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('b2b_token')}`
          }
        });
        if (response.ok) {
          setMessage('Category deleted successfully');
          fetchCategories();
          // Small delay to ensure backend operation completes
          setTimeout(() => {
            onCategoryChange?.();
          }, 100);
        } else {
          setMessage('Failed to delete category');
        }
      } catch (error) {
        setMessage('Error deleting category');
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory({
      id: category.id,
      name: category.name,
      description: category.description || '',
      currentPhoto: category.photo
    });
    setShowEditModal(true);
  };

  const updateCategory = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editingCategory.name);
      formData.append('description', editingCategory.description);
      if (editingCategory.newPhoto) {
        formData.append('photo', editingCategory.newPhoto);
      }

      const response = await fetch(`${API_ENDPOINTS.categories}/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('b2b_token')}`
        },
        body: formData
      });

      if (response.ok) {
        setMessage('Category updated successfully');
        setShowEditModal(false);
        fetchCategories();
        onCategoryChange?.();
      } else {
        setMessage('Failed to update category');
      }
    } catch (error) {
      setMessage('Error updating category');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Helper to resolve image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    // Assuming backend serves static files from root or /api base?
    // Usually Spring Boot static resource mapping handles /uploads/filename.jpg maps to file:/...
    // If we serve on 8080: http://localhost:8080/uploads/...
    // API_ENDPOINTS.categories is http://localhost:8080/api/categories
    // So base is http://localhost:8080
    const baseUrl = API_ENDPOINTS.categories.split('/api')[0];
    return `${baseUrl}${path}`;
  };

  return (
    <div>
      {message && <Alert variant="info">{message}</Alert>}
      <Form onSubmit={addCategory}>
        <div className="form-row">
          <Form.Control
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mb-2"
          />
          <Form.Control
            type="text"
            placeholder="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-2"
          />
          <Form.Group className="mb-2">
            <Form.Label className="small text-muted mb-1">Upload Photo</Form.Label>
            <Form.Control
              id="cat-photo-input"
              type="file"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </Form.Group>
          <Button type="submit" variant="light">Add Category</Button>
        </div>
      </Form>
      <Table striped hover size="sm" className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Photo</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>
                {cat.photo ? (
                  <img src={getImageUrl(cat.photo)} alt={cat.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                ) : (
                  <span className="text-muted small">No Img</span>
                )}
              </td>
              <td>
                <div className="fw-bold">{cat.name}</div>
                <div className="small text-muted">
                  {cat.subCategories?.map(s => s.name).join(', ') || 'No subcategories'}
                </div>
              </td>
              <td>{cat.description || '-'}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(cat)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteCategory(cat.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={updateCategory}>
            <Form.Group className="mb-3">
              <Form.Label>Category Name *</Form.Label>
              <Form.Control
                type="text"
                value={editingCategory?.name || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={editingCategory?.description || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Photo (Optional - leave empty to keep current)</Form.Label>
              {editingCategory?.currentPhoto && (
                <div className="mb-2">
                  <img
                    src={getImageUrl(editingCategory.currentPhoto)}
                    alt="Current"
                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                  />
                </div>
              )}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setEditingCategory({ ...editingCategory, newPhoto: e.target.files[0] })}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update Category
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CategoryManager;