import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      loadUserCart();
    } else {
      setCart([]);
    }
  }, [currentUser]);

  const loadUserCart = () => {
    if (!currentUser) return;
    
    const userCarts = JSON.parse(localStorage.getItem('userCarts')) || {};
    const userCart = userCarts[currentUser.username] || [];
    setCart(userCart);
  };

  const saveUserCart = (newCart) => {
    if (!currentUser) return;
    
    const userCarts = JSON.parse(localStorage.getItem('userCarts')) || {};
    userCarts[currentUser.username] = newCart;
    localStorage.setItem('userCarts', JSON.stringify(userCarts));
    setCart(newCart);
  };

  const addToCart = (product) => {
    if (!currentUser) {
      return { success: false, message: 'Please login to add items to cart!' };
    }

    const existingItem = cart.find(item => item.id === product.id);
    let newCart;

    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }

    saveUserCart(newCart);
    return { success: true, message: `${product.name} added to cart!` };
  };

  const updateQuantity = (productId, change) => {
    const newCart = cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean);

    saveUserCart(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    saveUserCart(newCart);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const clearCart = () => {
    saveUserCart([]);
  };

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartCount,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
