import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Tab, Tabs, Badge } from 'react-bootstrap';
import { categories, users, contactQueries } from '../../data/demoData';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubcategory, setShowAddSubcategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState({ name: '', categoryId: '' });
  const [localCategories, setLocalCategories] = useState(categories);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const newCat = {
        id: Date.now(),
        name: newCategory,
        subcategories: []
      };
      setLocalCategories(prev => [...prev, newCat]);
      setNewCategory('');
      setShowAddCategory(false);
      toast.success('Category added successfully!');
    } else {
      toast.error('Please enter category name');
    }
  };

  const handleAddSubcategory = () => {
    if (newSubcategory.name.trim() && newSubcategory.categoryId) {
      setLocalCategories(prev => prev.map(cat => 
        cat.id === parseInt(newSubcategory.categoryId)
          ? {
              ...cat,
              subcategories: [...cat.subcategories, {
                id: Date.now(),
                name: newSubcategory.name,
                products: []
              }]
            }
          : cat
      ));
      setNewSubcategory({ name: '', categoryId: '' });
      setShowAddSubcategory(false);
      toast.success('Subcategory added successfully!');
    } else {
      toast.error('Please fill all fields');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h2>🔧 Admin Panel</h2>
          </Col>
        </Row>
        
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h3 className="text-primary">{localCategories.length}</h3>
                <p className="mb-0">📁 Categories</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h3 className="text-success">{localCategories.reduce((sum, cat) => sum + cat.subcategories.length, 0)}</h3>
                <p className="mb-0">📂 Subcategories</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h3 className="text-info">{users.length}</h3>
                <p className="mb-0">👥 Total Users</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h3 className="text-warning">{contactQueries.length}</h3>
                <p className="mb-0">💬 Queries</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Card className="shadow-sm">
          <Card.Body>
            <Tabs defaultActiveKey="categories" className="mb-3">
              <Tab eventKey="categories" title="📁 Categories">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Manage Categories</h5>
                  <div>
                    <Button 
                      variant="primary" 
                      size="sm"
                      className="me-2"
                      onClick={() => setShowAddCategory(true)}
                    >
                      + Add Category
                    </Button>
                    <Button 
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowAddSubcategory(true)}
                    >
                      + Add Subcategory
                    </Button>
                  </div>
                </div>
                
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Subcategories</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localCategories.map(category => (
                        <tr key={category.id}>
                          <td><strong>{category.name}</strong></td>
                          <td>
                            {category.subcategories.length > 0 ? (
                              category.subcategories.map(sub => (
                                <Badge key={sub.id} bg="secondary" className="me-1">{sub.name}</Badge>
                              ))
                            ) : (
                              <span className="text-muted">No subcategories</span>
                            )}
                          </td>
                          <td>
                            <Badge bg="info">{category.subcategories.length}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>
              
              <Tab eventKey="users" title="👥 Users">
                <h5 className="mb-3">All Users</h5>
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <Badge bg={
                              user.role === 'admin' ? 'danger' : 
                              user.role === 'vendor' ? 'warning' : 'info'
                            }>
                              {user.role.toUpperCase()}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg="success">✓ Active</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>
              
              <Tab eventKey="queries" title="💬 Contact Queries">
                <h5 className="mb-3">Contact Us Queries</h5>
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactQueries.map(query => (
                        <tr key={query.id}>
                          <td>{query.name}</td>
                          <td>{query.email}</td>
                          <td>{query.message}</td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => toast.success('✉️ Response sent!')}
                            >
                              📧 Respond
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>

        {/* Add Category Modal */}
        <Modal show={showAddCategory} onHide={() => setShowAddCategory(false)}>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Add New Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddCategory(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddCategory}>Add Category</Button>
          </Modal.Footer>
        </Modal>

        {/* Add Subcategory Modal */}
        <Modal show={showAddSubcategory} onHide={() => setShowAddSubcategory(false)}>
          <Modal.Header closeButton className="bg-secondary text-white">
            <Modal.Title>Add New Subcategory</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Select Category</Form.Label>
                <Form.Select
                  value={newSubcategory.categoryId}
                  onChange={(e) => setNewSubcategory({...newSubcategory, categoryId: e.target.value})}
                >
                  <option value="">Choose category...</option>
                  {localCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Subcategory Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newSubcategory.name}
                  onChange={(e) => setNewSubcategory({...newSubcategory, name: e.target.value})}
                  placeholder="Enter subcategory name"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddSubcategory(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddSubcategory}>Add Subcategory</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminPanel;