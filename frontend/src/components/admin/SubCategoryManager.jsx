import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Alert } from 'react-bootstrap';
import { API_ENDPOINTS } from '../../config/api';

const SubCategoryManager = ({ refreshTrigger }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [message, setMessage] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.categories);
      if (response.ok) {
        const data = await response.json();
        console.log('Categories loaded:', data);
        setCategories(Array.isArray(data) ? data : []);
      } else {
        setMessage(`Error loading categories: ${response.status}`);
      }
    } catch (error) {
      setMessage('Error fetching categories');
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.subcategories);
      if (response.ok) {
        const data = await response.json();
        console.log('SubCategories loaded:', data);
        setSubCategories(Array.isArray(data) ? data : []);
      } else {
        setMessage(`SubCategory endpoint not available (${response.status})`);
      }
    } catch (error) {
      setMessage('SubCategory endpoint not available');
      console.error('Error fetching subcategories:', error);
    }
  };

  const addSubCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_ENDPOINTS.subcategories, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subCategoryName,
          categoryId: selectedCategoryId
        })
      });
      if (response.ok) {
        setSubCategoryName('');
        setSelectedCategoryId('');
        setMessage('SubCategory added successfully');
        fetchSubCategories();
      }
    } catch (error) {
      setMessage('Error adding subcategory');
    }
  };

  const deleteSubCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      try {
        const response = await fetch(`${API_ENDPOINTS.subcategories}/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setMessage('SubCategory deleted successfully');
          fetchSubCategories();
        }
      } catch (error) {
        setMessage('Error deleting subcategory');
      }
    }
  };

  useEffect(() => {
    console.log('SubCategoryManager refreshing, trigger:', refreshTrigger);
    fetchCategories();
    fetchSubCategories();
  }, [refreshTrigger]);

  return (
    <div>
      {message && <Alert variant="info">{message}</Alert>}
      <div className="form-container">
        <h4 style={{color: '#fff', marginBottom: '1.5rem', textAlign: 'center'}}>➕ Add New Sub-Category</h4>
        <Form onSubmit={addSubCategory}>
          <Form.Group className="mb-3">
            <Form.Label>Select Category</Form.Label>
            <Form.Select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              required
            >
              <option value="">Choose a category...</option>
              {categories.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Sub-Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter sub-category name"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              required
            />
          </Form.Group>
          <div className="text-center">
            <Button type="submit" variant="light" size="lg">
              ✨ Add Sub-Category
            </Button>
          </div>
        </Form>
      </div>
      <div style={{background: 'rgba(255,255,255,0.05)', borderRadius: '15px', padding: '1.5rem'}}>
        <h4 style={{color: '#fff', marginBottom: '1.5rem', textAlign: 'center'}}>📋 Sub-Categories List</h4>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subCategories.map(sub => (
              <tr key={sub.subCategoryId || sub.id}>
                <td>{sub.subCategoryId || sub.id}</td>
                <td>{sub.subCategoryName || sub.name}</td>
                <td>{sub.category?.categoryName || sub.categoryName || 'N/A'}</td>
                <td>{sub.isActive ? '✅ Active' : '❌ Inactive'}</td>
                <td>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => deleteSubCategory(sub.subCategoryId || sub.id)}
                  >
                    🗑️ Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default SubCategoryManager;