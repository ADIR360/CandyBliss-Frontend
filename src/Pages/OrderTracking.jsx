import React, { useState } from 'react';
import './OrderTracking.css';
import { useNavigate } from 'react-router-dom';

const OrderTracking = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState(null);

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError('');
    setOrderData(null);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Since orders are stored in Google Sheets and not in a backend database,
    // we cannot provide real-time order tracking. Show a helpful message instead.
    setError('Order tracking is currently not available. Orders are processed through Google Sheets. Please contact support for order status updates.');
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      case 'cancelled': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return '✅';
      case 'pending': return '⏳';
      case 'failed': return '❌';
      case 'cancelled': return '🚫';
      default: return '❓';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="order-tracking-container">
      <div className="order-tracking-header">
        <button
          className="return-arrow-btn"
          onClick={() => navigate('/')}
          aria-label="Return to Shop"
        >
          <span style={{fontSize: '1.5rem', color: '#fff', fontWeight: 700}}>&larr;</span>
        </button>
        <h1>Track Your Order 📦</h1>
        <p>Enter your order ID to check the status of your chocolate order</p>
      </div>

      <form onSubmit={handleTrackOrder} className="order-search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter your order ID (e.g., CB123456ABC)"
            className="order-search-input"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="order-search-btn"
            disabled={loading || !orderId.trim()}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Searching...
              </>
            ) : (
              <>
                🔍 Track Order
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="order-error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
      </form>

      {orderData && (
        <div className="order-details-card">
          <div className="order-header">
            <div className="order-title">
              <h2>Order Details</h2>
              <div 
                className="order-status-badge"
                style={{ backgroundColor: getStatusColor(orderData.status) }}
              >
                {getStatusIcon(orderData.status)} {orderData.status.toUpperCase()}
              </div>
            </div>
            <div className="order-meta">
              <p><strong>Order ID:</strong> {orderData.orderId}</p>
              <p><strong>Placed on:</strong> {formatDate(orderData.createdAt)}</p>
              {orderData.razorpayPaymentId && (
                <p><strong>Payment ID:</strong> {orderData.razorpayPaymentId}</p>
              )}
            </div>
          </div>

          <div className="order-timeline">
            <div className={`timeline-step ${orderData.status === 'pending' || orderData.status === 'paid' ? 'completed' : ''}`}>
              <div className="timeline-icon">📝</div>
              <div className="timeline-content">
                <h4>Order Placed</h4>
                <p>{formatDate(orderData.createdAt)}</p>
              </div>
            </div>
            
            <div className={`timeline-step ${orderData.status === 'paid' ? 'completed' : orderData.status === 'failed' ? 'failed' : ''}`}>
              <div className="timeline-icon">
                {orderData.status === 'paid' ? '💳' : orderData.status === 'failed' ? '❌' : '⏳'}
              </div>
              <div className="timeline-content">
                <h4>Payment {orderData.status === 'paid' ? 'Completed' : orderData.status === 'failed' ? 'Failed' : 'Processing'}</h4>
                <p>{orderData.status === 'paid' ? formatDate(orderData.updatedAt) : 'Waiting for payment confirmation'}</p>
              </div>
            </div>
            
            <div className={`timeline-step ${orderData.status === 'paid' ? 'upcoming' : 'disabled'}`}>
              <div className="timeline-icon">📦</div>
              <div className="timeline-content">
                <h4>Order Processing</h4>
                <p>Your chocolates are being prepared</p>
              </div>
            </div>
            
            <div className={`timeline-step ${orderData.status === 'paid' ? 'upcoming' : 'disabled'}`}>
              <div className="timeline-icon">🚚</div>
              <div className="timeline-content">
                <h4>Out for Delivery</h4>
                <p>Your order is on its way</p>
              </div>
            </div>
            
            <div className={`timeline-step disabled`}>
              <div className="timeline-icon">✅</div>
              <div className="timeline-content">
                <h4>Delivered</h4>
                <p>Enjoy your chocolates!</p>
              </div>
            </div>
          </div>

          <div className="order-sections">
            <div className="customer-details-section">
              <h3>📋 Customer Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">{orderData.customerDetails.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone:</span>
                  <span className="detail-value">{orderData.customerDetails.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">City:</span>
                  <span className="detail-value">{orderData.customerDetails.city}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Pincode:</span>
                  <span className="detail-value">{orderData.customerDetails.pincode}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{orderData.customerDetails.address}</span>
                </div>
              </div>
            </div>

            <div className="order-items-section">
              <h3>🍫 Order Items</h3>
              <div className="items-list">
                {orderData.cartItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.img} alt={item.name} className="item-image" />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p className="item-price">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-summary-section">
              <h3>💰 Order Summary</h3>
              <div className="summary-lines">
                <div className="summary-line">
                  <span>Subtotal:</span>
                  <span>₹{orderData.orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-line">
                  <span>Tax (18%):</span>
                  <span>₹{orderData.orderSummary.tax.toFixed(2)}</span>
                </div>
                <div className="summary-line">
                  <span>Shipping:</span>
                  <span>{orderData.orderSummary.shipping === 0 ? 'FREE' : `₹${orderData.orderSummary.shipping.toFixed(2)}`}</span>
                </div>
                <div className="summary-line total-line">
                  <span>Total:</span>
                  <span className="total-amount">₹{orderData.orderSummary.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {orderData.status === 'failed' && (
            <div className="order-action-section">
              <div className="failed-payment-notice">
                <h4>🚨 Payment Failed</h4>
                <p>Your payment could not be processed. Please try placing the order again or contact our support team.</p>
                <button className="retry-payment-btn">
                  Try Again
                </button>
              </div>
            </div>
          )}

          {orderData.status === 'paid' && (
            <div className="order-action-section">
              <div className="success-notice">
                <h4>🎉 Payment Successful!</h4>
                <p>Thank you for your order! We'll start processing your chocolates shortly and keep you updated via WhatsApp.</p>
                <div className="contact-support">
                  <p>Questions about your order? Contact us:</p>
                  <div className="contact-options">
                    <a href="tel:+917453937763" className="contact-btn">
                      📞 Call Us
                    </a>
                    <a href="https://wa.me/917453937763" className="contact-btn" target="_blank" rel="noopener noreferrer">
                      💬 WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!orderData && !loading && (
        <div className="order-help-section">
          <h3>Need Help? 🤔</h3>
          <div className="help-cards">
            <div className="help-card">
              <div className="help-icon">📧</div>
              <h4>Check Your Email</h4>
              <p>Your order ID was sent to your email after placing the order</p>
            </div>
            <div className="help-card">
              <div className="help-icon">💬</div>
              <h4>WhatsApp Message</h4>
              <p>Look for your order confirmation message on WhatsApp</p>
            </div>
            <div className="help-card">
              <div className="help-icon">🆔</div>
              <h4>Order ID Format</h4>
              <p>Order IDs start with "CB" followed by numbers and letters (e.g., CB123456ABC)</p>
            </div>
          </div>
          
          <div className="support-contact">
            <p>Still can't find your order? We're here to help!</p>
            <div className="support-buttons">
              <a href="tel:+917453937763" className="support-btn">
                📞 Call Support
              </a>
              <a href="https://wa.me/917453937763" className="support-btn" target="_blank" rel="noopener noreferrer">
                💬 WhatsApp Support
              </a>
              <a href="mailto:meetadubey1205@gmail.com" className="support-btn">
                ✉️ Email Support
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;