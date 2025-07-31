import React, { useState, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Shop from './Pages/Shop';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import OrderTracking from './Pages/OrderTracking';
import Checkout from './Pages/Checkout';

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = useCallback((product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, [removeFromCart]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  return (
    <div className="app">
      <Routes>
        <Route 
          path="/" 
          element={
            <Shop 
              cartItems={cartItems}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              getTotalPrice={getTotalPrice}
              getTotalItems={getTotalItems}
            />
          } 
        />
        <Route 
          path="/cart" 
          element={
            <Cart 
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              getTotalPrice={getTotalPrice}
              clearCart={clearCart}
            />
          } 
        />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/order-tracking" element={<OrderTracking />} />
        <Route 
          path="/checkout" 
          element={
            <Checkout 
              cartItems={cartItems}
              clearCart={clearCart}
              getTotalPrice={getTotalPrice}
              getTotalItems={getTotalItems}
              getSubtotal={() => cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)}
              getTax={() => cartItems.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.18}
              getShipping={() => {
                const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
                return subtotal >= 350 ? 0 : 50.00;
              }}
              getFinalTotal={() => {
                const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
                const tax = subtotal * 0.18;
                const shipping = subtotal >= 350 ? 0 : 50.00;
                return subtotal + tax + shipping;
              }}
            />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;