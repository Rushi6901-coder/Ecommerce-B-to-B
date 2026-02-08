import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, Button, Badge, InputGroup } from 'react-bootstrap';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';
import logo from '../../assets/react.svg';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../common/ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const ProductCatalog = () => {
    const { addToCart, user } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: 'all',
        subcategory: 'all',
        search: '',
        minPrice: '',
        maxPrice: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [products, filters]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsData, categoriesData] = await Promise.all([
                productService.getAllProducts(),
                categoryService.getAllCategories()
            ]);

            setProducts(productsData);
            setCategories(categoriesData);
        } catch (err) {
            console.error('Failed to load products:', err);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...products];

        // Search filter
        if (filters.search) {
            filtered = filtered.filter(p =>
                p.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
                p.description?.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Category filter
        if (filters.category !== 'all') {
            filtered = filtered.filter(p => p.subCategory?.category?.id === parseInt(filters.category));
        }

        // Subcategory filter
        if (filters.subcategory !== 'all') {
            filtered = filtered.filter(p => p.subCategory?.id === parseInt(filters.subcategory));
        }

        // Price filters
        if (filters.minPrice) {
            filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice));
        }
        if (filters.maxPrice) {
            filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice));
        }

        setFilteredProducts(filtered);
    };

    const handleAddToCart = (product) => {
        if (!product.vendor || !product.vendor.id) {
            console.warn('Adding product without vendor ID:', product);
        }

        const success = addToCart({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            vendor: product.vendor?.user?.name || product.vendor?.shopName || 'Unknown Vendor',
            vendorId: product.vendor?.id,
            stockQuantity: product.stockQuantity
        });

        if (success) {
            toast.success(`${product.name} added to cart`);
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleDirectBuy = async (product) => {
        if (!user) {
            toast.error("Please login to place an order");
            return;
        }

        if (!product.vendor || !product.vendor.id) {
            toast.error("Product vendor information missing");
            return;
        }

        // const confirmBuy = window.confirm(`Are you sure you want to buy 1 unit of ${product.name}?`);
        // if (!confirmBuy) return;

        const orderData = {
            shopkeeperId: user.id,
            vendorId: product.vendor.id,
            items: [
                {
                    productId: product.id,
                    quantity: 1
                }
            ]
        };

        try {
            setLoading(true);
            const res = await loadRazorpay();
            if (!res) {
                toast.error('Razorpay SDK failed to load. Are you online?');
                return;
            }

            // 1. Create Internal Order
            const internalOrder = await orderService.placeOrder(orderData);
            console.log("Internal Order Created:", internalOrder);

            // 2. Create Razorpay Order
            const rzpOrder = await paymentService.createRazorpayOrder(product.price * 1); // 1 unit
            console.log("Razorpay Order Created:", rzpOrder);

            // 3. Open Razorpay Checkout
            const options = {
                key: "rzp_test_SAwhFZC2b6Zm1m", // Enter the Key ID generated from the Dashboard
                amount: rzpOrder.amount,
                currency: rzpOrder.currency,
                name: "B2B Marketplace",
                description: `Order #${internalOrder.id} Payment`,
                image: logo,
                order_id: rzpOrder.id,
                handler: async function (response) {
                    console.log("Payment Success:", response);

                    try {
                        // 4. Verify Payment on Backend
                        await paymentService.verifyPayment({
                            internalOrderId: internalOrder.id.toString(),
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        toast.success("Payment Successful! Order Confirmed.");
                        navigate('/order-history');
                    } catch (verErr) {
                        console.error("Verification Failed:", verErr);
                        toast.error("Payment successful but verification failed.");
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone || "9999999999"
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                toast.error(response.error.description || "Payment Failed");
            });
            rzp1.open();

        } catch (error) {
            console.error('Order/Payment failed:', error);
            toast.error(error.response?.data || "Failed to process direct buy");
        } finally {
            setLoading(false);
        }
    };

    const selectedCategory = categories.find(c => c.id === parseInt(filters.category));
    const subcategories = selectedCategory?.subCategories || [];

    if (loading) {
        return <LoadingSpinner message="Loading products..." />;
    }

    return (
        <Container fluid>
            <Row className="mb-4">
                <Col>
                    <h3>🛍️ Product Catalog</h3>
                    <p className="text-muted">Browse and add products to your cart</p>
                </Col>
            </Row>

            {/* Filters */}
            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Search Products</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>🔍</InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by name..."
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group>
                                <Form.Label>Category</Form.Label>
                                <Form.Select
                                    value={filters.category}
                                    onChange={(e) => setFilters({ ...filters, category: e.target.value, subcategory: 'all' })}
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group>
                                <Form.Label>Subcategory</Form.Label>
                                <Form.Select
                                    value={filters.subcategory}
                                    onChange={(e) => setFilters({ ...filters, subcategory: e.target.value })}
                                    disabled={filters.category === 'all'}
                                >
                                    <option value="all">All</option>
                                    {subcategories.map(sub => (
                                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group>
                                <Form.Label>Min Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="₹ Min"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group>
                                <Form.Label>Max Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="₹ Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={1} className="d-flex align-items-end">
                            <Button
                                variant="outline-secondary"
                                onClick={() => setFilters({ category: 'all', subcategory: 'all', search: '', minPrice: '', maxPrice: '' })}
                            >
                                Clear
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Results */}
            <Row className="mb-3">
                <Col>
                    <Badge bg="secondary">{filteredProducts.length} products found</Badge>
                </Col>
            </Row>

            {/* Products Grid */}
            <Row>
                {filteredProducts.length === 0 ? (
                    <Col>
                        <Card className="text-center py-5">
                            <Card.Body>
                                <h5 className="text-muted">No products found</h5>
                                <p>Try adjusting your filters</p>
                            </Card.Body>
                        </Card>
                    </Col>
                ) : (
                    filteredProducts.map(product => (
                        <Col key={product.id} md={4} lg={3} className="mb-4">
                            <ProductCard
                                product={product}
                                onAddToCart={() => handleAddToCart(product)}
                                onDirectBuy={() => handleDirectBuy(product)}
                                showVendor={true}
                                showActions={true}
                            />
                        </Col>
                    ))
                )}
            </Row>
        </Container>
    );
};

export default ProductCatalog;
