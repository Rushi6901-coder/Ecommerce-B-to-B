import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('b2b_user');
      const savedCart = localStorage.getItem('b2b_cart');

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.role) {
          parsedUser.role = parsedUser.role.toLowerCase();
        }
        setUser(parsedUser);
      }
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      localStorage.removeItem('b2b_user');
      localStorage.removeItem('b2b_cart');
    }
    setLoading(false);
  }, []);

  // login: flexible - if passed a user object (has role) it sets directly,
  // otherwise it will attempt server login using provided credentials
  const login = async (payload, maybePassword) => {
    try {
      // Handle direct Login Response (from LoginPage) which contains { token, user }
      if (payload && payload.token) {
        const token = payload.token;
        const userObj = payload.user;

        localStorage.setItem('b2b_token', token);

        if (userObj && userObj.role) {
          userObj.role = userObj.role.toLowerCase();
        }

        // Preserve shopkeeperId and vendorId
        const completeUser = {
          ...userObj,
          shopkeeperId: userObj.shopkeeperId,
          vendorId: userObj.vendorId
        };

        setUser(completeUser);
        localStorage.setItem('b2b_user', JSON.stringify(completeUser));
        return completeUser;
      }

      // Direct user object (already authenticated, no token in top level of this specific object or it's just a user dump)
      if (payload && typeof payload === 'object' && typeof payload.token === 'undefined' && payload.role) {
        // Flatten the user object logic...

        let userToStore = payload;

        // If shopkeeper/vendor has a nested user object, unwrap it
        if (payload.shopkeeper?.user) {
          userToStore = payload.shopkeeper.user;
        } else if (payload.vendor?.user) {
          userToStore = payload.vendor.user;
        }

        // Remove shopkeeper and vendor objects to prevent infinite recursion
        const { shopkeeper, vendor, ...cleanUser } = userToStore;
        const normalized = { ...cleanUser, role: cleanUser.role.toLowerCase() };

        setUser(normalized);
        localStorage.setItem('b2b_user', JSON.stringify(normalized));
        return normalized;
      }

      console.log("AuthContext login called with:", payload); // DEBUG

      // Support call signatures: login({email, password}) or login(email, password)
      let credentials = null;
      if (typeof payload === 'string' && typeof maybePassword === 'string') {
        credentials = { email: payload, password: maybePassword };
      } else if (payload && typeof payload === 'object') {
        credentials = payload;
      }

      console.log("Resolved credentials object:", credentials); // DEBUG

      if (!credentials) {
        throw new Error('Invalid login payload: ' + JSON.stringify(payload));
      }

      const res = await fetch(API_ENDPOINTS.userLogin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.email, password: credentials.password })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Login failed');
      }

      const data = await res.json();

      // Handle JWT Response { token: "...", user: { ... } }
      let userObj = data.user;
      const token = data.token;

      if (token) {
        localStorage.setItem('b2b_token', token);
      }

      if (userObj && userObj.role) userObj.role = userObj.role.toLowerCase();

      // Ensure we preserve shopkeeperId and vendorId from the backend response
      const completeUser = {
        ...userObj,
        shopkeeperId: userObj.shopkeeperId,
        vendorId: userObj.vendorId
      };

      setUser(completeUser);
      localStorage.setItem('b2b_user', JSON.stringify(completeUser));
      return completeUser;
    } catch (err) {
      throw err;
    }
  };

  // register: send data to backend. Supports shopkeeper and vendor creation.
  const register = async (userData) => {
    try {
      if (!userData || !userData.email) throw new Error('Invalid registration data');

      // default - if role not provided, assume shopkeeper
      const role = (userData.role || 'shopkeeper').toLowerCase();

      let endpoint = null;
      let body = {};

      if (role === 'shopkeeper') {
        endpoint = API_ENDPOINTS.shopkeeperRegister;
        body = {
          Name: userData.name || '',
          ShopName: userData.shopName || `${userData.name || 'Shop'}'s Shop`,
          Email: userData.email,
          Phone: userData.phone || '',
          Password: userData.password || '123'
        };
      } else {
        // vendor registration (AdminVendor POST)
        endpoint = API_ENDPOINTS.vendorRegister;
        body = {
          Name: userData.name || '',
          ShopName: userData.shopName || `${userData.name || 'Shop'}'s Shop`,
          Email: userData.email,
          Phone: userData.phone || '',
          Password: userData.password || '123'
        };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Registration failed');
      }

      const created = await res.json();

      // Normalize created object to a lightweight user for frontend
      const normalized = {
        id: created.shopkeeperId || created.vendorId || created.id || created.originalId || created.ShopkeeperId || created.VendorId || created.Id || created.Id,
        name: created.name || created.Name || '',
        email: created.email || created.Email || '',
        role: role
      };

      // Auto-login newly created user (if shopkeeper/vendor created)
      setUser(normalized);
      localStorage.setItem('b2b_user', JSON.stringify(normalized));
      return normalized;
    } catch (err) {
      throw err;
    }
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    localStorage.setItem('b2b_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('b2b_user');
    localStorage.removeItem('b2b_cart');
  };

  const addToCart = (product) => {
    // Check for Single Vendor Constraint
    if (cart.length > 0) {
      const existingVendorId = cart[0].vendorId;
      // Handle case where product might use 'vendorId' or 'VendorId' or just 'vendor' (string name)
      // Assuming demoData uses 'vendorId' now.
      const newVendorId = product.vendorId;

      if (existingVendorId && newVendorId && existingVendorId !== newVendorId) {
        // You might want to use a toast here if you have access, or just return false/throw
        // Since we can't easily access toast from Context without circular deps or passing it in,
        // we will alert custom way or just fail. 
        // Better: return a success/failure status.
        alert("You can only add products from one vendor at a time. Please clear your cart or finish the current order first.");
        return false;
      }
    }

    const newCart = [...cart, { ...product, quantity: 1, cartId: Date.now() }];
    setCart(newCart);
    localStorage.setItem('b2b_cart', JSON.stringify(newCart));
    return true;
  };

  const removeFromCart = (cartId) => {
    const newCart = cart.filter(item => item.cartId !== cartId);
    setCart(newCart);
    localStorage.setItem('b2b_cart', JSON.stringify(newCart));
  };

  const updateCartQuantity = (cartId, quantity) => {
    const newCart = cart.map(item =>
      item.cartId === cartId ? { ...item, quantity } : item
    );
    setCart(newCart);
    localStorage.setItem('b2b_cart', JSON.stringify(newCart));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user, login, register, logout, updateUser, cart, addToCart, removeFromCart, updateCartQuantity
    }}>
      {children}
    </AuthContext.Provider>
  );
};