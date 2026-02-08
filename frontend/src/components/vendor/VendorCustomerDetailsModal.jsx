import React, { useMemo } from 'react';
import { Modal, Button, Row, Col, Card, Table, Badge } from 'react-bootstrap';

const VendorCustomerDetailsModal = ({ show, onHide, customer, orders }) => {

    // Calculate stats for this specific customer
    const stats = useMemo(() => {
        if (!orders || !customer) return { totalSpend: 0, totalOrders: 0, productsBought: {} };

        const customerOrders = orders.filter(o =>
            o.shopkeeper?.id === customer.id && o.status !== 'CANCELLED'
        );

        const totalSpend = customerOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const totalOrders = customerOrders.length;

        // Product breakdown
        const productsBought = {};
        customerOrders.forEach(order => {
            order.orderItems?.forEach(item => {
                if (productsBought[item.product?.name]) {
                    productsBought[item.product?.name].qty += item.quantity;
                    productsBought[item.product?.name].spent += (item.price * item.quantity);
                } else {
                    productsBought[item.product?.name] = {
                        qty: item.quantity,
                        spent: item.price * item.quantity,
                        image: item.product?.photoLink || item.product?.image
                    };
                }
            });
        });

        return { totalSpend, totalOrders, productsBought };
    }, [orders, customer]);

    if (!customer) return null;

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Customer Analytics: {customer.shopName || customer.user?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="mb-4">
                    <Col md={6}>
                        <Card className="text-center border-success h-100">
                            <Card.Body>
                                <h3 className="text-success">₹{stats.totalSpend.toLocaleString()}</h3>
                                <p className="mb-0">💰 Total Earned from Customer</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="text-center border-primary h-100">
                            <Card.Body>
                                <h3 className="text-primary">{stats.totalOrders}</h3>
                                <p className="mb-0">📦 Total Orders Completed</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <h5>Product Breakdown</h5>
                <Table responsive hover size="sm">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th className="text-center">Total Qty Sold</th>
                            <th className="text-end">Total Earned</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(stats.productsBought).length === 0 ? (
                            <tr><td colSpan="3" className="text-center">No products sold yet.</td></tr>
                        ) : (
                            Object.entries(stats.productsBought).sort((a, b) => b[1].spent - a[1].spent).map(([name, data]) => (
                                <tr key={name}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            {data.image && (
                                                <img src={data.image} alt="" style={{ width: 30, height: 30, objectFit: 'cover', marginRight: 10, borderRadius: 4 }} />
                                            )}
                                            {name}
                                        </div>
                                    </td>
                                    <td className="text-center">{data.qty}</td>
                                    <td className="text-end">₹{data.spent.toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default VendorCustomerDetailsModal;
