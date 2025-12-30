import React, { useState, useCallback, useEffect } from 'react';
import { Container, Tab, Tabs } from 'react-bootstrap';
import { API_ENDPOINTS } from '../../config/api';
import CategoryManager from './CategoryManager';
import SubCategoryManager from './SubCategoryManager';
import VendorManager from './VendorManager';
import ShopkeeperManager from './ShopkeeperManager';
import ProductManager from './ProductManager';
import './AdminPanel.css';

const AdminPanel = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    console.log('Triggering refresh from AdminPanel');
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    const autoSeed = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.categories);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length <= 1) { // 1 or 0 (like my test one)
            console.log('Categories empty or minimal, attempting seed...');
            await fetch(`${API_ENDPOINTS.categories.replace('AdminCategory', 'Seed')}/categories`, {
              method: 'POST'
            });
            triggerRefresh();
          }
        }
      } catch (err) {
        console.error('Auto-seed check failed:', err);
      }
    };
    autoSeed();
  }, [triggerRefresh]);

  return (
    <div className="page-container">
      <Container fluid className="py-4">
        <div className="admin-header">
          <h2>Admin Dashboard</h2>
        </div>

        <Tabs defaultActiveKey="categories" id="admin-tabs" className="mb-3" variant="pills">
          <Tab eventKey="categories" title="Categories">
            <div className="tab-content">
              <CategoryManager onCategoryChange={triggerRefresh} />
            </div>
          </Tab>
          <Tab eventKey="subcategories" title="Sub-Categories">
            <div className="tab-content">
              <SubCategoryManager refreshTrigger={refreshTrigger} />
            </div>
          </Tab>
          <Tab eventKey="vendors" title="Vendors">
            <div className="tab-content">
              <VendorManager />
            </div>
          </Tab>
          <Tab eventKey="shopkeepers" title="Shopkeepers">
            <div className="tab-content">
              <ShopkeeperManager />
            </div>
          </Tab>
          <Tab eventKey="products" title="Products">
            <div className="tab-content">
              <ProductManager />
            </div>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default AdminPanel;