import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Badge } from 'react-bootstrap';
import { API_ENDPOINTS } from '../../config/api';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState('');

    const fetchProducts = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.adminProducts);
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                setMessage('Product list not available');
            }
        } catch (error) {
            setMessage('Error fetching products');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`${API_ENDPOINTS.adminProducts}/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchProducts();
                }
            } catch (error) {
                setMessage('Error deleting product');
            }
        }
    };

    return (
        <div className="p-3">
            <h4>Full Product Inventory</h4>
            <p className="text-muted">Overview of all items added by vendors</p>

            {message && <Alert variant="info">{message}</Alert>}

            <Table striped hover responsive className="shadow-sm bg-white">
                <thead className="table-dark">
                    <tr>
                        <th>Product Name</th>
                        <th>Vendor / Shop</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.productId}>
                            <td>{product.productName}</td>
                            <td>
                                <div><strong>{product.vendorName}</strong></div>
                                <small className="text-muted">{product.shopName}</small>
                            </td>
                            <td>
                                <Badge bg="secondary" className="me-1">{product.categoryName}</Badge>
                                <small>{product.subCategoryName}</small>
                            </td>
                            <td className="text-success">₹{product.price.toLocaleString()}</td>
                            <td>{product.stock}</td>
                            <td>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => deleteProduct(product.productId)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center py-4">No products found in the database.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default ProductManager;
