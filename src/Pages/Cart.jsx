import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = ({ cartItems = [], updateQuantity, removeFromCart, getTotalPrice, clearCart }) => {
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  
  // Navbar visibility states
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Replace with your actual WhatsApp number (include country code without +)
  const WHATSAPP_NUMBER = "916397116830";

  // Scroll handler for dynamic navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar if at top of page
      if (currentScrollY === 0) {
        setIsNavbarVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Only update visibility if scroll difference is significant (prevents jittery behavior)
      if (Math.abs(currentScrollY - lastScrollY) < 10) {
        return;
      }

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold
        setIsNavbarVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsNavbarVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Add scroll listener with throttling for better performance
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

  const createWhatsAppMessage = () => {
    const itemsList = cartItems.map(item => 
      `${item.emoji || '🍫'} ${item.name} x ${item.quantity} (₹${(item.price * item.quantity).toFixed(2)})`
    ).join(', ');
    
    const total = calculateTotal();
    
    const message = `Hi! I would like to order: ${itemsList}. Total: ₹${total.toFixed(2)}. Please confirm availability and delivery details. Thank you!`;

    return encodeURIComponent(message);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsCheckingOut(true);
    
    try {
      const whatsappMessage = createWhatsAppMessage();
      const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;
      
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        window.location.href = whatsappURL;
      } else {
        const newWindow = window.open(whatsappURL, '_blank');
        if (!newWindow) {
          window.location.href = whatsappURL;
        }
      }
      
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      alert('Unable to open WhatsApp. Please try again or contact us directly.');
      setIsCheckingOut(false);
      return;
    }
    
    setTimeout(() => {
      setIsCheckingOut(false);
      setShowOrderSuccess(true);
      clearCart();
      setTimeout(() => {
        setShowOrderSuccess(false);
        navigate('/');
      }, 3000);
    }, 2000);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18;
  };

  const calculateShipping = () => {
    return calculateSubtotal() >= 350 ? 0 : 50.00;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Order Success Modal Component
  const OrderSuccessModal = () => (
    <div className="cart-order-success-overlay">
      <div className="cart-order-success-modal">
        <div className="cart-success-animation">
          <span className="cart-success-checkmark">✅</span>
        </div>
        <h2 className="cart-success-title">WhatsApp Message Sent! 📱</h2>
        <p className="cart-success-message">Your order has been sent via WhatsApp. We'll confirm your order shortly!</p>
        <p className="cart-success-redirect">Redirecting to home page...</p>
      </div>
    </div>
  );

  // Empty Cart Component
  const EmptyCartContent = () => (
    <div className="cart-empty-state">
      <div className="cart-empty-icon">🛒</div>
      <h2 className="cart-empty-title">Your cart is empty</h2>
      <p className="cart-empty-description">Looks like you haven't added any delicious chocolates yet!</p>

    </div>
  );

  // Dynamic Cart Header Component
  const CartHeader = () => (
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
          <span>{getTotalItems()} items</span>
        </div>
      </div>
    </div>
  );

  // Cart Item Component
  const CartItem = ({ item }) => (
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
            disabled={isCheckingOut}
          >
            −
          </button>
          <span className="cart-quantity-value">{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="cart-quantity-btn cart-quantity-increase"
            disabled={isCheckingOut}
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
          disabled={isCheckingOut}
          title="Remove item"
        >
          🗑️
        </button>
      </div>
    </div>
  );

  // Cart Items Section Component
  const CartItemsSection = () => (
    <div className="cart-items-section">
      <div className="cart-items-header">
        <h2 className="cart-section-title">Your Items ({cartItems.length})</h2>
        <button 
          onClick={clearCart} 
          className="cart-clear-btn"
          disabled={isCheckingOut}
        >
          🗑️ Clear All
        </button>
      </div>
      
      <div className="cart-items-list">
        {cartItems.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      
      <div className="cart-continue-shopping-section">

      </div>
    </div>
  );

  // Order Summary Component
  const OrderSummary = () => (
    <div className="cart-order-summary">
      <h3 className="cart-summary-title">Order Summary</h3>
      
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
        
        {calculateSubtotal() < 550 && (
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
        className={`cart-checkout-btn ${isCheckingOut ? 'cart-checking-out' : ''}`}
        onClick={handleProceedToCheckout}
        disabled={isCheckingOut || cartItems.length === 0}
      >
        {isCheckingOut ? (
          <>
            <span className="cart-spinner"></span>
            Opening WhatsApp...
          </>
        ) : (
          <>
            📱 Order via WhatsApp 💬
          </>
        )}
      </button>
      
      <div className="cart-payment-methods">
        <p>We accept:</p>
        <div className="cart-payment-icons">
          <span>💸 COD</span>
          <span>📱 UPI</span>
        </div>
      </div>
      
      <div className="cart-security-badge">
        <span>🔒</span>
        <p>Secure ordering via WhatsApp</p>
      </div>
    </div>
  );

  // Main render
  if (showOrderSuccess) {
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