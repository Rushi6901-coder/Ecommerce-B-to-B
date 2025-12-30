import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppNavbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// New MVC Pages
import HomePage from './views/pages/HomePage';
import ContactPage from './views/pages/ContactPage';
import CategoryPage from './views/pages/CategoryPage';
import AllProductsPage from './views/pages/AllProductsPage';

// Legacy components (to be migrated)
import LoginPage from './components/common/LoginPage';
import Chat from './components/common/Chat';
import OrderHistory from './components/common/OrderHistory';
import Cart from './components/shopkeeper/Cart';
import VendorDashboard from './components/vendor/VendorDashboard';
import AdminPanel from './components/admin/AdminPanel';
import AdminLogin from './components/admin/AdminLogin';
import LoginModal from './components/common/LoginModal';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './theme.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (!user) {
    console.log('ProtectedRoute: No user found, showing login reminder');
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container mt-4">
          <div className="alert alert-warning text-center shadow-sm">
            <h5>🔐 Authentication Required</h5>
            <p>Please login to access this administrator area.</p>
            <button
              className="btn btn-primary px-4"
              onClick={() => setShowLogin(true)}
            >
              Go to Login
            </button>
          </div>
        </div>
        <LoginModal show={showLogin} onHide={() => setShowLogin(false)} />
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log(`ProtectedRoute: Access denied for role: ${user.role}`);
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container mt-4">
          <div className="alert alert-danger text-center shadow-sm">
            <h5>🚫 Access Denied</h5>
            <p>Your account ({user.role}) does not have permission to view this page.</p>
            <button className="btn btn-outline-secondary mt-2" onClick={() => window.location.href = '/'}>Return Home</button>
          </div>
        </div>
      </div>
    );
  }

  console.log('ProtectedRoute: Access granted for role:', user.role);
  return children;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppNavbar />
      <div style={{ flex: '1', width: '100%', background: '#fff' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<AllProductsPage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={['shopkeeper']}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['vendor']}>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
