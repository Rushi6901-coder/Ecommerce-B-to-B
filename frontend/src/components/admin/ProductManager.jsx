import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Badge } from 'react-bootstrap';
import api from '../../services/api';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState('');

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
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
                await api.delete(`/products/${id}`);
                setMessage('Product deleted successfully');
                fetchProducts();
            } catch (error) {
                setMessage('Error deleting product');
            }
        }
    };

    return (
        <div className="p-3">
            <h4>Product Management</h4>
            <p className="text-muted">Overview of all products</p>

            {message && <Alert variant="info" onClose={() => setMessage('')} dismissible>{message}</Alert>}

            <Table striped hover responsive className="shadow-sm bg-white">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Discount</th>
                        <th>Vendor</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td><strong>{product.name}</strong></td>
                            <td>{product.description || 'N/A'}</td>
                            <td className="text-success">₹{product.price}</td>
                            <td>{product.stockQuantity}</td>
                            <td>{product.discount}%</td>
                            <td>{product.vendor?.shopName || 'N/A'}</td>
                            <td>
                                <Badge bg="secondary">{product.subCategory?.category?.name || 'N/A'}</Badge>
                                <br/>
                                <small>{product.subCategory?.name || 'N/A'}</small>
                            </td>
                            <td>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => deleteProduct(product.id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan="9" className="text-center py-4">No products found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default ProductManager;
