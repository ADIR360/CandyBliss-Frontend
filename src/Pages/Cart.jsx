import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = ({ cartItems = [], updateQuantity, removeFromCart, getTotalPrice, clearCart }) => {
  const navigate = useNavigate();
  // Removed unused state variables: isProcessingPayment, showOrderSuccess
  
  // Navbar visibility states
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll handler for dynamic navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY === 0) {
        setIsNavbarVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      if (Math.abs(currentScrollY - lastScrollY) < 10) {
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavbarVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsNavbarVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [lastScrollY]);

  // Removed unused form validation and handlers

  // Calculation functions
  const calculateSubtotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const calculateTax = useCallback(() => {
    return calculateSubtotal() * 0.18;
  }, [calculateSubtotal]);

  const calculateShipping = useCallback(() => {
    return calculateSubtotal() >= 350 ? 0 : 50.00;
  }, [calculateSubtotal]);

  const calculateTotal = useCallback(() => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  }, [calculateSubtotal, calculateTax, calculateShipping]);

  // Removed unused form handlers: handleFormChange, handleFormBlur

  // Removed unused submitOrderToGoogleSheets function

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Redirect to checkout page with cart data
    navigate('/checkout', { 
      state: { 
        cartItems: cartItems,
        totalAmount: calculateTotal()
      }
    });
  };

  // Order Success Modal Component
  const OrderSuccessModal = React.memo(() => (
    <div className="cart-order-success-overlay">
      <div className="cart-order-success-modal">
        <div className="cart-success-animation">
          <span className="cart-success-checkmark">✅</span>
        </div>
        <h2 className="cart-success-title">Order Placed Successfully! 🎉</h2>
        <p className="cart-success-message">
          Your order has been placed successfully. You will receive order confirmation via WhatsApp shortly!
        </p>
        <p className="cart-success-redirect">Redirecting to home page...</p>
      </div>
    </div>
  ));

  // Empty Cart Component
  const EmptyCartContent = React.memo(() => (
    <div className="cart-empty-state">
      <div className="cart-empty-icon">🛒</div>
      <h2 className="cart-empty-title">Your cart is empty</h2>
      <p className="cart-empty-description">Looks like you haven't added any delicious chocolates yet!</p>
      <button 
        onClick={() => navigate('/')} 
        className="cart-continue-shopping-btn"
      >
        Continue Shopping
      </button>
    </div>
  ));

  // Dynamic Cart Header Component
  const CartHeader = React.memo(() => (
    <div className={`cart-page-header ${isNavbarVisible ? 'cart-header-visible' : 'cart-header-hidden'}`}>
      <div className="cart-page-container">
        <button 
          onClick={() => navigate('/')} 
          className="cart-back-btn"
        >
          ← Back to Shop
        </button>
        <div className="cart-page-title">
          <span className="cart-title-icon">🛒</span>
          <h1 className="cart-title-text">Shopping Cart</h1>
        </div>
        <div className="cart-items-count">
          <span>{cartItems.reduce((total, item) => total + item.quantity, 0)} items</span>
        </div>
      </div>
    </div>
  ));

  // Cart Item Component
  const CartItem = React.memo(({ item }) => (
    <div className="cart-item-card">
      <div className="cart-item-image">
        <img src={item.img} alt={item.name} className="cart-item-img" />
      </div>
      
      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-description">{item.description}</p>
        <div className="cart-item-unit-price">₹{item.price} each</div>
      </div>
      
      <div className="cart-item-actions">
        <div className="cart-quantity-controls">
          <button 
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="cart-quantity-btn cart-quantity-decrease"
          >
            −
          </button>
          <span className="cart-quantity-value">{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="cart-quantity-btn cart-quantity-increase"
          >
            +
          </button>
        </div>
        
        <div className="cart-item-total-price">
          ₹{(item.price * item.quantity).toFixed(2)}
        </div>
        
        <button 
          className="cart-remove-btn" 
          onClick={() => removeFromCart(item.id)}
          title="Remove item"
        >
          🗑️
        </button>
      </div>
    </div>
  ));

  // Cart Items Section Component
  const CartItemsSection = React.memo(() => (
    <div className="cart-items-section">
      <div className="cart-items-header">
        <h2 className="cart-section-title">Your Items ({cartItems.length})</h2>
        <button 
          onClick={clearCart} 
          className="cart-clear-btn"
        >
          🗑️ Clear All
        </button>
      </div>
      
      <div className="cart-items-list">
        {cartItems.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  ));

  // Removed unused CustomerDetailsForm component

  // Order Summary Component - Memoized to prevent unnecessary re-renders
  const OrderSummary = React.memo(() => (
    <div className="cart-order-summary">
      <h3 className="cart-summary-title">Order Summary</h3>
      
      {/* Customer Details Form - Commented out for now */}
      {/* <CustomerDetailsForm /> */}
      
      {/* Order Summary */}
      <div className="cart-summary-lines">
        <div className="cart-summary-line">
          <span>Subtotal:</span>
          <span>₹{calculateSubtotal().toFixed(2)}</span>
        </div>
        
        <div className="cart-summary-line">
          <span>Tax (18%):</span>
          <span>₹{calculateTax().toFixed(2)}</span>
        </div>
        
        <div className="cart-summary-line">
          <span>Shipping:</span>
          <span>
            {calculateShipping() === 0 ? (
              <span className="cart-free-shipping">FREE</span>
            ) : (
              `₹${calculateShipping().toFixed(2)}`
            )}
          </span>
        </div>
        
        {calculateSubtotal() < 350 && (
          <div className="cart-shipping-notice">
            <p>💡 Add ₹{(350 - calculateSubtotal()).toFixed(2)} more for free shipping!</p>
          </div>
        )}
        
        <div className="cart-summary-line cart-total-line">
          <span>Total:</span>
          <span className="cart-total-amount">₹{calculateTotal().toFixed(2)}</span>
        </div>
      </div>
      
      <button 
        className={`cart-checkout-btn`}
        onClick={handlePayment}
        disabled={cartItems.length === 0}
      >
        {cartItems.length === 0 ? (
          <>
            Cart is empty
          </>
        ) : (
          <>
            🛒 Proceed to Checkout - ₹{calculateTotal().toFixed(2)}
          </>
        )}
      </button>
      
      <div className="cart-payment-security-section">
        <div className="cart-payment-row">
          <div className="cart-payment-methods-fun cart-method-cod">
            <span className="cart-pay-emoji">💸</span>
            <span className="cart-pay-label">Cash on Delivery</span>
          </div>
          <div className="cart-security-badge-fun cart-method-secure">
            <span className="cart-secure-emoji">📱</span>
            <span className="cart-secure-text">Online Payment</span>
          </div>
          <div className="cart-security-badge-fun cart-method-secure">
            <span className="cart-secure-emoji">🚚</span>
            <span className="cart-secure-text">Fast Delivery</span>
          </div>
          <div className="cart-security-badge-fun cart-method-secure">
            <span className="cart-secure-emoji">🔒</span>
            <span className="cart-secure-text">Secure Order Processing</span>
          </div>
        </div>
      </div>
    </div>
  ));

  // Main render
  if (false) { // Removed showOrderSuccess check
    return <OrderSuccessModal />;
  }

  return (
    <div className="cart-page">
      <CartHeader />
      
      {/* Add padding top to account for sticky header */}
      <div className="cart-page-container" style={{ paddingTop: '120px' }}>
        {cartItems.length === 0 ? (
          <EmptyCartContent />
        ) : (
          <div className="cart-main-content">
            <CartItemsSection />
            <div className="cart-sidebar">
              <OrderSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;