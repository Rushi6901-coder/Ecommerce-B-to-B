import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('b2b_user');
    const savedCart = localStorage.getItem('b2b_cart');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('b2b_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('b2b_user');
    localStorage.removeItem('b2b_cart');
  };

  const addToCart = (product) => {
    const newCart = [...cart, { ...product, quantity: 1, cartId: Date.now() }];
    setCart(newCart);
    localStorage.setItem('b2b_cart', JSON.stringify(newCart));
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
      user, login, logout, cart, addToCart, removeFromCart, updateCartQuantity
    }}>
      {children}
    </AuthContext.Provider>
  );
};