import React, { useState, useMemo } from 'react';
import { Row, Col, Card, Table, Button, Form, InputGroup } from 'react-bootstrap';
import VendorCustomerDetailsModal from './VendorCustomerDetailsModal';

const VendorCustomers = ({ orders }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Extract unique customers and aggregated stats
    const customers = useMemo(() => {
        if (!orders) return [];

        const customerMap = new Map();

        orders.forEach(order => {
            if (!order.shopkeeper) return;

            const shopkeeperId = order.shopkeeper.id;

            if (!customerMap.has(shopkeeperId)) {
                customerMap.set(shopkeeperId, {
                    id: shopkeeperId,
                    name: order.shopkeeper.user?.name || 'Unknown',
                    shopName: order.shopkeeper.shopName || 'Unknown Shop',
                    contact: order.shopkeeper.contactNumber || 'N/A',
                    address: order.shopkeeper.address || 'N/A',
                    totalOrders: 0,
                    totalSpent: 0,
                    lastOrderDate: order.orderDate,
                    ...order.shopkeeper // store full obj just in case
                });
            }

            const cust = customerMap.get(shopkeeperId);
            if (order.status !== 'CANCELLED') {
                cust.totalOrders += 1;
                cust.totalSpent += (order.totalAmount || 0);
            }
            if (new Date(order.orderDate) > new Date(cust.lastOrderDate)) {
                cust.lastOrderDate = order.orderDate;
            }
        });

        return Array.from(customerMap.values());
    }, [orders]);

    const filteredCustomers = customers.filter(c =>
        c.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewStats = (customer) => {
        setSelectedCustomer(customer);
        setShowModal(true);
    };

    return (
        <Row>
            <Col>
                <Card className="shadow-sm">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4>My Customers</h4>
                            <div style={{ width: '300px' }}>
                                <InputGroup>
                                    <InputGroup.Text>🔍</InputGroup.Text>
                                    <Form.Control
                                        placeholder="Search customers..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </div>
                        </div>

                        {filteredCustomers.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <h5>No customers found.</h5>
                                <p>Customers who place orders with you will appear here.</p>
                            </div>
                        ) : (
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>Shop Name</th>
                                        <th>Contact Person</th>
                                        <th>Total Orders</th>
                                        <th>Total Spend (Earnings)</th>
                                        <th>Last Order</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCustomers.map(customer => (
                                        <tr key={customer.id}>
                                            <td>{customer.shopName}</td>
                                            <td>
                                                <div>{customer.name}</div>
                                                <small className="text-muted">{customer.contact}</small>
                                            </td>
                                            <td>{customer.totalOrders}</td>
                                            <td className="text-success fw-bold">₹{customer.totalSpent.toLocaleString()}</td>
                                            <td>{new Date(customer.lastOrderDate).toLocaleDateString()}</td>
                                            <td>
                                                <Button
                                                    variant="outline-info"
                                                    size="sm"
                                                    onClick={() => handleViewStats(customer)}
                                                >
                                                    View Analytics
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            </Col>

            <VendorCustomerDetailsModal
                show={showModal}
                onHide={() => setShowModal(false)}
                customer={selectedCustomer}
                orders={orders}
            />
        </Row>
    );
};

export default VendorCustomers;
