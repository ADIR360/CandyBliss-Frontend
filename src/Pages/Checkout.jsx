import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendOrderConfirmationEmails } from '../emailService';
import orderIdService from '../orderIdService';
import './Checkout.css';

const Checkout = ({ 
  cartItems, 
  clearCart, 
  getTotalPrice, 
  getTotalItems, 
  getSubtotal, 
  getTax, 
  getShipping, 
  getFinalTotal 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get cart items from props (preferred) or location state (fallback) - memoized to prevent re-renders
  const currentCartItems = useMemo(() => {
    return cartItems || location.state?.cartItems || [];
  }, [cartItems, location.state?.cartItems]);

  // Form states
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    deliveryInstructions: ''
  });

  // UI states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formErrors, setFormErrors] = useState({});
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [orderStatus, setOrderStatus] = useState('');

  // API URLs - with more robust fallbacks
  const GOOGLE_SHEETS_API_URL = process.env.REACT_APP_GOOGLE_SHEETS_API_URL || 
    'https://script.google.com/macros/s/AKfycbwA--I9thjGA7wU-CwWuzFmv59crmE-fAVLGpLxJY4pXhTbhS4uyiEYuaBMJgCrXv_nNg/exec';
  
  const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_sample_key';

  // Load Razorpay script with better error handling
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        // Check if Razorpay is already loaded
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        
        script.onload = () => {
          console.log('✅ Razorpay script loaded successfully');
          resolve(true);
        };
        
        script.onerror = () => {
          console.error('❌ Failed to load Razorpay script');
          resolve(false);
        };
        
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  // Enhanced form validation
  const validateForm = useCallback(() => {
    const errors = {};
    const { name, phone, email, address, city, pincode } = customerForm;

    // Required field validation
    if (!name?.trim()) errors.name = 'Full name is required';
    if (!phone?.trim()) errors.phone = 'Phone number is required';
    if (!email?.trim()) errors.email = 'Email address is required';
    if (!address?.trim()) errors.address = 'Delivery address is required';
    if (!city?.trim()) errors.city = 'City is required';
    if (!pincode?.trim()) errors.pincode = 'Pincode is required';

    // Format validation
    if (phone?.trim()) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone.trim())) {
        errors.phone = 'Please enter a valid 10-digit Indian phone number';
      }
    }

    if (email?.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = 'Please enter a valid email address';
      }
    }

    if (pincode?.trim()) {
      const pincodeRegex = /^\d{6}$/;
      if (!pincodeRegex.test(pincode.trim())) {
        errors.pincode = 'Please enter a valid 6-digit pincode';
      }
    }

    if (name?.trim() && name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [customerForm]);

  // Handle form changes with sanitization
  const handleFormChange = useCallback((field, value) => {
    // Basic sanitization
    let sanitizedValue = value;
    
    if (field === 'phone') {
      // Remove any non-numeric characters
      sanitizedValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (field === 'pincode') {
      // Remove any non-numeric characters and limit to 6 digits
      sanitizedValue = value.replace(/\D/g, '').slice(0, 6);
    } else if (field === 'name') {
      // Remove numbers and special characters, keep only letters and spaces
      sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
    } else if (field === 'email') {
      // Basic email sanitization
      sanitizedValue = value.toLowerCase().trim().slice(0, 100);
    }

    setCustomerForm(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [formErrors]);

  // Handle form blur
  const handleFormBlur = useCallback(() => {
    setIsFormTouched(true);
  }, []);

  // Calculate totals with proper error handling - use props if available
  const calculateSubtotal = useCallback(() => {
    if (getSubtotal && typeof getSubtotal === 'function') {
      return getSubtotal();
    }
    try {
      return currentCartItems.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return total + (price * quantity);
      }, 0);
    } catch (error) {
      console.error('Error calculating subtotal:', error);
      return 0;
    }
  }, [currentCartItems, getSubtotal]);

  const calculateTax = useCallback(() => {
    if (getTax && typeof getTax === 'function') {
      return getTax();
    }
    const subtotal = calculateSubtotal();
    return subtotal * 0.18; // 18% GST
  }, [calculateSubtotal, getTax]);

  const calculateShipping = useCallback(() => {
    if (getShipping && typeof getShipping === 'function') {
      return getShipping();
    }
    const subtotal = calculateSubtotal();
    return subtotal >= 350 ? 0 : 50.00;
  }, [calculateSubtotal, getShipping]);

  const calculateTotal = useCallback(() => {
    if (getFinalTotal && typeof getFinalTotal === 'function') {
      return getFinalTotal();
    }
    return calculateSubtotal() + calculateTax() + calculateShipping();
  }, [calculateSubtotal, calculateTax, calculateShipping, getFinalTotal]);

  // Enhanced Google Sheets submission with retry logic
  const submitOrderToGoogleSheets = async (orderData, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`📊 Attempting to submit to Google Sheets (attempt ${attempt}/${retries})`);
        console.log('📤 Sending order data:', JSON.stringify(orderData, null, 2));
        
        const requestBody = {
          action: 'addOrder',
          data: orderData,
          timestamp: new Date().toISOString()
        };
        
        console.log('📦 Full request body:', JSON.stringify(requestBody, null, 2));
        
        const response = await fetch(GOOGLE_SHEETS_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          mode: 'cors'
        });

        console.log('📡 Response status:', response.status, response.statusText);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        let result;
        const responseText = await response.text();
        console.log('📥 Raw response text:', responseText);
        
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.warn('⚠️ Could not parse response as JSON:', parseError);
          // If response is just "true" or simple text, treat as success
          if (responseText.trim() === 'true' || responseText.includes('success')) {
            result = { success: true, message: 'Order submitted successfully' };
          } else {
            throw new Error(`Invalid response format: ${responseText}`);
          }
        }
        
        console.log('✅ Parsed response:', result);
        
        if (result.success === false) {
          throw new Error(result.error || 'Google Sheets returned success: false');
        }
        
        console.log('✅ Google Sheets submission successful:', result);
        
        // Log spreadsheet URL if provided
        if (result.spreadsheetUrl) {
          console.log('📊 View your data here:', result.spreadsheetUrl);
        }
        
        return result;
        
      } catch (error) {
        console.error(`❌ Google Sheets attempt ${attempt} failed:`, error);
        console.error('🔍 Error details:', {
          message: error.message,
          stack: error.stack,
          attempt: attempt,
          url: GOOGLE_SHEETS_API_URL
        });
        
        if (attempt === retries) {
          // On final attempt, still allow order to proceed but log the issue
          console.warn('⚠️ All Google Sheets attempts failed, but order will still be processed');
          console.warn('🔧 Please check your Google Apps Script deployment and permissions');
          return { 
            success: false, 
            error: error.message,
            warning: 'Order processed but may not be stored in sheets'
          };
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  };

  // Function to clear cart and redirect
  const handleOrderSuccess = useCallback(() => {
    console.log('🎉 Order completed successfully, clearing cart');
    
    // Clear the cart
    if (clearCart && typeof clearCart === 'function') {
      clearCart();
      console.log('✅ Cart cleared successfully');
    } else {
      console.warn('⚠️ clearCart function not available');
    }
    
    // Show success modal
    setShowOrderSuccess(true);
    
    // Redirect after 5 seconds
    setTimeout(() => {
      setShowOrderSuccess(false);
      navigate('/', { replace: true });
    }, 5000);
  }, [clearCart, navigate]);

  // Function to handle order success with email sending
  const handleOrderSuccessWithEmails = async (orderData) => {
    console.log('🎉 Order completed successfully, sending emails...');
    
    // Send confirmation emails
    try {
      setOrderStatus('Sending confirmation emails...');
      const emailResults = await sendOrderConfirmationEmails(orderData);
      
      if (emailResults.customer.success) {
        console.log('✅ Customer confirmation email sent');
      } else {
        console.warn('⚠️ Customer email failed:', emailResults.customer.error);
      }
      
      if (emailResults.admin.success) {
        console.log('✅ Admin notification email sent');
      } else {
        console.warn('⚠️ Admin email failed:', emailResults.admin.error);
      }
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      // Don't fail the order if emails fail
    }
    
    // Continue with existing success flow
    handleOrderSuccess();
  };

  // Enhanced payment handling
  const handlePayment = async () => {
    console.log('🚀 Payment process started');
    
    // Validate form first
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      setIsFormTouched(true);
      setOrderStatus('Please fill in all required fields correctly');
      
      // Scroll to first error
      const firstErrorField = document.querySelector('.checkout-form-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Check if cart is empty
    if (!currentCartItems || currentCartItems.length === 0) {
      console.log('❌ Cart is empty');
      setOrderStatus('Your cart is empty');
      return;
    }

    console.log('✅ Form validation passed');
    setIsProcessingPayment(true);
    setOrderStatus('Processing your order...');

    try {
      // Prepare order data
      const orderData = {
        orderId: orderIdService.generateOrderId(),
        timestamp: new Date().toISOString(),
        customerDetails: { 
          ...customerForm,
          // Ensure all fields are properly trimmed
          name: customerForm.name.trim(),
          phone: customerForm.phone.trim(),
          email: customerForm.email.trim(),
          address: customerForm.address.trim(),
          city: customerForm.city.trim(),
          pincode: customerForm.pincode.trim()
        },
        cartItems: currentCartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price) || 0,
          quantity: parseInt(item.quantity) || 1,
          total: (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1)
        })),
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment',
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        shipping: calculateShipping(),
        total: calculateTotal(),
        status: paymentMethod === 'cod' ? 'Pending' : 'Payment Initiated'
      };

      console.log('📋 Order data prepared:', orderData);

      if (paymentMethod === 'cod') {
        console.log('💸 Processing Cash on Delivery order');
        setOrderStatus('Submitting your order...');
        
        // Submit to Google Sheets (with retry logic)
        await submitOrderToGoogleSheets(orderData);
        
        console.log('✅ COD order submitted successfully');
        setOrderStatus('Order placed successfully!');
        
        // Clear cart and redirect
        handleOrderSuccessWithEmails(orderData);
        
      } else {
        console.log('💳 Processing online payment with Razorpay');
        setOrderStatus('Initializing payment gateway...');
        
        // Check if Razorpay is loaded
        if (!window.Razorpay) {
          throw new Error('Payment gateway not loaded. Please refresh the page and try again.');
        }

        const razorpayOptions = {
          key: RAZORPAY_KEY_ID,
          amount: Math.round(calculateTotal() * 100), // Convert to paise and round
          currency: 'INR',
          name: 'Candy Bliss',
          description: 'Premium Handcrafted Chocolates',
          image: '/logo192.png', // Fallback to React logo
          order_id: orderData.orderId,
          handler: async function (response) {
            console.log('✅ Razorpay payment successful:', response);
            setOrderStatus('Payment successful! Confirming your order...');
            
            try {
              // Update order status
              const updatedOrderData = {
                ...orderData,
                status: 'Paid',
                paymentDetails: {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature
                }
              };

              // Submit to Google Sheets
              await submitOrderToGoogleSheets(updatedOrderData);

              console.log('✅ Online payment order confirmed');
              setOrderStatus('Order confirmed successfully!');

              // Clear cart and redirect
              handleOrderSuccessWithEmails(updatedOrderData);
              
            } catch (error) {
              console.error('❌ Post-payment processing error:', error);
              alert('Payment was successful, but there was an issue confirming your order. Please contact support with your payment ID: ' + response.razorpay_payment_id);
            }
          },
          prefill: {
            name: customerForm.name,
            email: customerForm.email,
            contact: customerForm.phone,
          },
          notes: {
            address: customerForm.address,
            city: customerForm.city,
            pincode: customerForm.pincode,
            order_id: orderData.orderId
          },
          theme: {
            color: '#D2691E',
          },
          modal: {
            ondismiss: function() {
              console.log('⚠️ Payment modal dismissed by user');
              setIsProcessingPayment(false);
              setOrderStatus('Payment cancelled');
            }
          }
        };

        console.log('🔓 Opening Razorpay payment gateway');
        const razorpay = new window.Razorpay(razorpayOptions);
        razorpay.open();
      }
      
    } catch (error) {
      console.error('❌ Payment processing error:', error);
      setOrderStatus(`Error: ${error.message}`);
      alert(`Order submission failed: ${error.message}\nPlease try again or contact support.`);
    } finally {
      if (paymentMethod === 'cod') {
        setIsProcessingPayment(false);
      }
      // For Razorpay, processing state is cleared in modal handlers
    }
  };

  // Enhanced Success Modal Component
  const OrderSuccessModal = () => (
    <div className="checkout-success-overlay">
      <div className="checkout-success-modal">
        <div className="checkout-success-animation">
          <div className="checkout-success-checkmark">🎉</div>
        </div>
        <h2 className="checkout-success-title">Order Placed Successfully!</h2>
        <p className="checkout-success-message">
          {paymentMethod === 'cod' 
            ? `Your order has been confirmed! We'll contact you soon to arrange cash on delivery.`
            : `Payment received successfully! Your order is being processed and you'll receive updates shortly.`
          }
        </p>
        <div className="checkout-success-redirect">
          <p>Redirecting to home page in a few seconds...</p>
        </div>
      </div>
    </div>
  );

  // Main render
  if (showOrderSuccess) {
    return <OrderSuccessModal />;
  }

  if (!currentCartItems || currentCartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h2>Your cart is empty</h2>
          <p>Add some delicious chocolates to your cart before checking out!</p>
          <button 
            onClick={() => navigate('/')} 
            className="checkout-back-btn"
            style={{ marginTop: '1rem', position: 'static' }}
          >
            🍫 Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Fixed Header */}
      <div className="checkout-header">
        <div className="checkout-container">
          <button 
            onClick={() => navigate('/cart')}
            className="checkout-back-btn"
            disabled={isProcessingPayment}
          >
            ← Back to Cart
          </button>
          <h1 className="checkout-title">Complete Your Order</h1>
        </div>
      </div>

      <div className="checkout-container">
        <div className="checkout-main">
          {/* Customer Details Form */}
          <div className="checkout-form-section">
            <h2 className="checkout-section-title">👤 Customer Details</h2>
            <div className="checkout-form">
              <div className="checkout-form-row">
                <div className="checkout-form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    value={customerForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    onBlur={handleFormBlur}
                    className={formErrors.name && isFormTouched ? 'checkout-form-error' : ''}
                    placeholder="Enter your full name"
                    disabled={isProcessingPayment || !currentCartItems || currentCartItems.length === 0}
                    maxLength={50}
                  />
                  {formErrors.name && isFormTouched && (
                    <span className="checkout-error-message">{formErrors.name}</span>
                  )}
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    value={customerForm.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    onBlur={handleFormBlur}
                    className={formErrors.phone && isFormTouched ? 'checkout-form-error' : ''}
                    placeholder="Enter 10-digit phone number"
                    disabled={isProcessingPayment}
                    maxLength={10}
                  />
                  {formErrors.phone && isFormTouched && (
                    <span className="checkout-error-message">{formErrors.phone}</span>
                  )}
                </div>
              </div>

              <div className="checkout-form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  value={customerForm.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  onBlur={handleFormBlur}
                  className={formErrors.email && isFormTouched ? 'checkout-form-error' : ''}
                  placeholder="Enter your email address"
                  disabled={isProcessingPayment}
                  maxLength={100}
                />
                {formErrors.email && isFormTouched && (
                  <span className="checkout-error-message">{formErrors.email}</span>
                )}
              </div>

              <div className="checkout-form-group">
                <label htmlFor="address">Delivery Address *</label>
                <textarea
                  id="address"
                  value={customerForm.address}
                  onChange={(e) => handleFormChange('address', e.target.value)}
                  onBlur={handleFormBlur}
                  className={formErrors.address && isFormTouched ? 'checkout-form-error' : ''}
                  placeholder="Enter your complete delivery address with landmarks"
                  rows={3}
                  disabled={isProcessingPayment}
                  maxLength={200}
                />
                {formErrors.address && isFormTouched && (
                  <span className="checkout-error-message">{formErrors.address}</span>
                )}
              </div>

              <div className="checkout-form-row">
                <div className="checkout-form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    id="city"
                    type="text"
                    value={customerForm.city}
                    onChange={(e) => handleFormChange('city', e.target.value)}
                    onBlur={handleFormBlur}
                    className={formErrors.city && isFormTouched ? 'checkout-form-error' : ''}
                    placeholder="Enter your city"
                    disabled={isProcessingPayment}
                    maxLength={50}
                  />
                  {formErrors.city && isFormTouched && (
                    <span className="checkout-error-message">{formErrors.city}</span>
                  )}
                </div>
                <div className="checkout-form-group">
                  <label htmlFor="pincode">Pincode *</label>
                  <input
                    id="pincode"
                    type="text"
                    value={customerForm.pincode}
                    onChange={(e) => handleFormChange('pincode', e.target.value)}
                    onBlur={handleFormBlur}
                    className={formErrors.pincode && isFormTouched ? 'checkout-form-error' : ''}
                    placeholder="Enter 6-digit pincode"
                    disabled={isProcessingPayment}
                    maxLength={6}
                  />
                  {formErrors.pincode && isFormTouched && (
                    <span className="checkout-error-message">{formErrors.pincode}</span>
                  )}
                </div>
              </div>

              <div className="checkout-form-group">
                <label htmlFor="deliveryInstructions">Delivery Instructions (Optional)</label>
                <textarea
                  id="deliveryInstructions"
                  value={customerForm.deliveryInstructions}
                  onChange={(e) => handleFormChange('deliveryInstructions', e.target.value)}
                  placeholder="Any special delivery instructions, preferred delivery time, etc..."
                  rows={2}
                  disabled={isProcessingPayment}
                  maxLength={150}
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="checkout-payment-section">
            <h2 className="checkout-section-title">💳 Payment Method</h2>
            <div className="checkout-payment-options">
              <label className="checkout-payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={isProcessingPayment}
                />
                <div className="checkout-payment-card">
                  <span className="checkout-payment-icon">💸</span>
                  <div className="checkout-payment-details">
                    <h3>Cash on Delivery</h3>
                    <p>Pay when you receive your order at your doorstep</p>
                  </div>
                </div>
              </label>

              <label className="checkout-payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={isProcessingPayment}
                />
                <div className="checkout-payment-card">
                  <span className="checkout-payment-icon">💳</span>
                  <div className="checkout-payment-details">
                    <h3>Online Payment</h3>
                    <p>Cards, UPI, Net Banking & Wallets - Secured by Razorpay</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="checkout-sidebar">
          <div className="checkout-order-summary">
            <h2 className="checkout-summary-title">📋 Order Summary</h2>
            
            {/* Order Items */}
            <div className="checkout-items">
              {currentCartItems.map(item => (
                <div key={item.id} className="checkout-item">
                  <div className="checkout-item-image">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <div className="checkout-item-details">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                    <span className="checkout-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="checkout-price-breakdown">
              <div className="checkout-price-line">
                <span>Subtotal ({currentCartItems.length} items):</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="checkout-price-line">
                <span>Tax (GST 18%):</span>
                <span>₹{calculateTax().toFixed(2)}</span>
              </div>
              <div className="checkout-price-line">
                <span>Shipping:</span>
                <span>
                  {calculateShipping() === 0 ? (
                    <span className="checkout-free-shipping">FREE</span>
                  ) : (
                    `₹${calculateShipping().toFixed(2)}`
                  )}
                </span>
              </div>
              
              {calculateSubtotal() < 350 && (
                <div className="checkout-shipping-notice">
                  <p>💡 Add ₹{(350 - calculateSubtotal()).toFixed(2)} more for free shipping!</p>
                </div>
              )}
              
              <div className="checkout-price-line checkout-total-line">
                <span>Total Amount:</span>
                <span className="checkout-total-amount">₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Order Status */}
            {orderStatus && (
              <div className="checkout-order-status" style={{
                padding: '0.75rem',
                background: 'rgba(210, 105, 30, 0.1)',
                borderRadius: 'var(--border-radius-small)',
                marginBottom: '1rem',
                textAlign: 'center',
                color: 'var(--primary-brown)',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                {orderStatus}
              </div>
            )}

            {/* Place Order Button */}
            <button 
              className={`checkout-place-order-btn ${isProcessingPayment ? 'checkout-processing' : ''}`}
              onClick={handlePayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <>
                  <span className="checkout-spinner"></span>
                  Processing...
                </>
              ) : currentCartItems.length === 0 ? (
                'Cart is Empty'
              ) : (
                <>
                  {paymentMethod === 'cod' ? '📝 Place Order' : '💳 Pay Now'} - ₹{calculateTotal().toFixed(2)}
                </>
              )}
            </button>

            {/* Security Badge */}
            <div className="checkout-security-badge">
              <span className="checkout-security-icon">🔒</span>
              <span>Secure & Encrypted Processing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;