import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Alert } from 'react-bootstrap';
import { API_ENDPOINTS } from '../../config/api';

const CategoryManager = ({ onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [message, setMessage] = useState('');

  const fetchCategories = async () => {
    try {
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
      const response = await fetch(API_ENDPOINTS.categories, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName })
      });
      if (response.ok) {
        setCategoryName('');
        setMessage('Category added successfully');
        fetchCategories();
        onCategoryChange?.(); // Notify parent component
      }
    } catch (error) {
      setMessage('Error adding category');
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? All subcategories will also be deleted.')) {
      try {
        const response = await fetch(`${API_ENDPOINTS.categories}/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setMessage('Category deleted successfully');
          fetchCategories();
          // Small delay to ensure backend operation completes
          setTimeout(() => {
            onCategoryChange?.();
          }, 100);
        }
      } catch (error) {
        setMessage('Error deleting category');
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      {message && <Alert variant="info">{message}</Alert>}
      <Form onSubmit={addCategory}>
        <div className="form-row">
          <Form.Control
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
          <Button type="submit" variant="light">Add</Button>
        </div>
      </Form>
      <Table striped hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.categoryId}>
              <td>{cat.categoryId}</td>
              <td>
                <div className="fw-bold">{cat.categoryName}</div>
                <div className="small text-muted">
                  {cat.subCategories?.map(s => s.subCategoryName).join(', ') || 'No subcategories'}
                </div>
              </td>
              <td>{cat.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteCategory(cat.categoryId)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CategoryManager;