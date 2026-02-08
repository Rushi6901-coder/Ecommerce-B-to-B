import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import paymentService from '../../services/paymentService';
import orderService from '../../services/orderService';
import { generateInvoicePDF } from '../../utils/invoiceGenerator';
import logo from '../../assets/react.svg'; // Or any app logo path

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  console.log('Cart - User Object:', user); // Debugging log

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const sendEstimation = async () => {
    if (!user) {
      toast.error('Please login to send estimation');
      return;
    }

    setLoading(true);
    console.log('Cart Items:', cart); // Debug log

    try {
      // 1. Group items by Vendor
      const itemsByVendor = cart.reduce((acc, item) => {
        // Try to get vendorId from direct property or nested object
        let vId = item.vendorId;

        // Fallback: if vendorId is missing but vendor is an object with id
        if (!vId && item.vendor && typeof item.vendor === 'object' && item.vendor.id) {
          vId = item.vendor.id;
        }

        if (!vId) {
          console.warn('Item missing vendorId:', item);
          return acc;
        }

        if (!acc[vId]) acc[vId] = [];
        acc[vId].push(item);
        return acc;
      }, {});

      const vendorIds = Object.keys(itemsByVendor);

      if (vendorIds.length === 0) {
        toast.error('Cannot determine vendor for valid items in cart. Please clear cart and try again.');
        return;
      }

      // We will init chat for the first vendor found to demonstrate flow
      const vendorId = vendorIds[0];
      const items = itemsByVendor[vendorId];

      // 2. Create or Get Chat Room
      const shopkeeperId = user.shopkeeperId; // Use specific shopkeeperId, not generic user.id
      if (!shopkeeperId) {
        throw new Error("Shopkeeper Profile ID missing. Please log out and log in again.");
      }

      console.log(`Creating chat room for Shopkeeper: ${shopkeeperId}, Vendor: ${vendorId}`);
      const createRoomResponse = await api.post(`/chat/room?shopkeeperId=${shopkeeperId}&vendorId=${vendorId}`);
      console.log('Chat Room Response:', createRoomResponse.data);

      const chatRoomId = createRoomResponse.data.id; // Corrected property name from 'chatRoomId' to 'id'

      if (!chatRoomId) {
        throw new Error('Failed to retrieve valid Chat Room ID');
      }

      // 3. Construct Estimation Message
      const estimationText = `📋 **Estimation Request**\n\n` +
        items.map(i => `- ${i.name} (x${i.quantity}): ₹${(i.price * i.quantity).toLocaleString()}`).join('\n') +
        `\n\n**Total Estimated Cost:** ₹${items.reduce((sum, i) => sum + (i.price * i.quantity), 0).toLocaleString()}`;

      // 4. Send Message via API
      await api.post('/chat/message', {
        chatRoomId: chatRoomId,
        senderId: user.id,
        senderRole: user.role,
        content: estimationText,
        messageType: 'ESTIMATION'
      });

      toast.success('Estimation sent successfully!');

      // 5. Navigate to Chat
      navigate('/chat', { state: { activeChatId: chatRoomId } });

    } catch (error) {
      console.error('Estimation error:', error);
      toast.error('Failed to send estimation. Please try again.');
    } finally {
      setLoading(false);
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

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please log in to proceed.");
      return;
    }

    // 1. Group items by Vendor (Single Vendor Constraint)
    // Same logic as sendEstimation
    const itemsByVendor = cart.reduce((acc, item) => {
      let vId = item.vendorId || (item.vendor?.id);
      if (!vId) return acc;
      if (!acc[vId]) acc[vId] = [];
      acc[vId].push(item);
      return acc;
    }, {});

    const vendorIds = Object.keys(itemsByVendor);
    if (vendorIds.length === 0) {
      toast.error("Invalid Cart Items (No Vendor). Clear Cart.");
      return;
    }
    if (vendorIds.length > 1) {
      toast.error("Please order from one vendor at a time.");
      return;
    }

    const vendorId = vendorIds[0];
    const items = itemsByVendor[vendorId];

    // Calculate exact total for this vendor's items (matches current 'total' if cart is clean)
    const orderTotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    try {
      setLoading(true);
      const res = await loadRazorpay();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        return;
      }

      // 2. Create Internal Order first (Status: PENDING)
      const orderData = {
        shopkeeperId: user.shopkeeperId,
        vendorId: parseInt(vendorId),
        items: items.map(i => ({ productId: i.id, quantity: i.quantity }))
      };

      console.log("Creating Internal Order...", orderData);
      const internalOrder = await orderService.placeOrder(orderData);
      console.log("Internal Order Created:", internalOrder);

      // 3. Create Razorpay Order
      const rzpOrder = await paymentService.createRazorpayOrder(orderTotal);
      console.log("Razorpay Order Created:", rzpOrder);

      // 4. Open Razorpay Checktout
      const options = {
        key: "rzp_test_SAwhFZC2b6Zm1m", // Enter the Key ID generated from the Dashboard
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "B2B Marketplace",
        description: `Order #${internalOrder.id} Payment`,
        image: logo, // Optional
        order_id: rzpOrder.id,
        handler: async function (response) {
          console.log("Payment Success:", response);

          try {
            // 5. Verify Payment on Backend
            await paymentService.verifyPayment({
              internalOrderId: internalOrder.id.toString(),
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            toast.success("Payment Successful! Order Confirmed.");

            // Clear items from this vendor
            items.forEach(i => removeFromCart(i.cartId));

            navigate('/order-history'); // Redirect to orders
          } catch (verErr) {
            console.error("Verification Failed:", verErr);
            toast.error("Payment successful but verification failed. Contact support.");
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
      console.error("Payment Error:", error);
      toast.error("Something went wrong initializing payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Container fluid className="py-4">
        <Row>
          <Col lg={8}>
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">🛒 Shopping Cart</h4>
              </Card.Header>
              <Card.Body>
                {/* Delivery Location Info */}
                <Card className="mb-4 bg-light">
                  <Card.Body>
                    <Card.Title>📍 Delivery Location</Card.Title>
                    <Card.Text>
                      {user?.address ? (
                        <>
                          <strong>Address:</strong> {user.address}<br />
                          <strong>City:</strong> {user?.location?.city}, {user?.location?.state}
                        </>
                      ) : (
                        <span className="text-muted">No address provided. Please update your profile.</span>
                      )}
                    </Card.Text>
                  </Card.Body>
                </Card>

                {cart.length === 0 ? (
                  <div className="text-center py-5">
                    <div style={{ fontSize: '4rem' }}>🛒</div>
                    <h5 className="text-muted mt-3">Your cart is empty</h5>
                    <p>Browse our categories to add products</p>
                  </div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <Table hover className="align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.map(item => (
                            <tr key={item.cartId}>
                              <td>
                                <div>
                                  <strong>{item.name}</strong>
                                  <br />
                                  <small className="text-muted">{item.description}</small>
                                  <br />
                                  <small className="text-info">Vendor: {typeof item.vendor === 'string' ? item.vendor : item.vendor?.shopName || item.vendor?.name || 'Unknown'}</small>
                                </div>
                              </td>
                              <td>
                                <InputGroup size="sm" style={{ width: '120px' }}>
                                  <Button
                                    variant="outline-secondary"
                                    onClick={() => updateCartQuantity(item.cartId, Math.max(1, item.quantity - 1))}
                                  >
                                    -
                                  </Button>
                                  <Form.Control
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    className="text-center"
                                    onChange={(e) => updateCartQuantity(item.cartId, parseInt(e.target.value) || 1)}
                                  />
                                  <Button
                                    variant="outline-secondary"
                                    onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)}
                                  >
                                    +
                                  </Button>
                                </InputGroup>
                              </td>
                              <td className="text-success fw-bold">₹{item.price.toLocaleString()}</td>
                              <td className="text-success fw-bold">₹{(item.price * item.quantity).toLocaleString()}</td>
                              <td>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => {
                                    removeFromCart(item.cartId);
                                    toast.info(`${item.name} removed from cart`);
                                  }}
                                >
                                  🗑️
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>

                    <div className="border-top pt-3">
                      <Row className="align-items-center">
                        <Col md={6}>
                          <h4 className="text-success mb-0">Grand Total: ₹{total.toLocaleString()}</h4>
                        </Col>
                        <Col md={6} className="text-end">
                          <Button
                            variant="primary"
                            className="me-2"
                            onClick={sendEstimation}
                            disabled={loading}
                          >
                            {loading ? 'Sending...' : '📋 Send Estimation to Vendor'}
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm">
              <Card.Header className="bg-info text-white">
                <h6 className="mb-0">📊 Order Summary</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span className="text-success">₹{total.toLocaleString()}</span>
                </div>
                {cart.length > 0 && (
                  <>
                    <Button
                      variant="warning"
                      className="w-100 mt-3"
                      onClick={handlePayment}
                    >
                      💳 Pay Now (Razorpay)
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="w-100 mt-2"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to clear the cart?')) {
                          cart.forEach(item => removeFromCart(item.cartId));
                          toast.info('Cart cleared');
                        }
                      }}
                    >
                      🗑️ Clear Cart
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Cart;