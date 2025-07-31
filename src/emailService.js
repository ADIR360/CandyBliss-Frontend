import emailjs from '@emailjs/browser';

// Initialize EmailJS with a fallback public key
// You can replace this with your actual public key
const EMAILJS_PUBLIC_KEY = 'HnM8VT7Sq8Mc3wvpd'; // Replace with your actual public key
const EMAILJS_SERVICE_ID = 'service_tot3f4r'; // Replace with your actual service ID
const EMAILJS_CUSTOMER_TEMPLATE_ID = 'template_2ehxmwq'; // Replace with your actual template ID
const EMAILJS_ADMIN_TEMPLATE_ID = 'template_2ehxmwq'; // Replace with your actual template ID
const ADMIN_EMAIL = 'meetadubey1205@gmail.com'; // Replace with your actual admin email

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// Email templates with all form fields
const formatOrderDetailsForEmail = (orderData) => {
  const itemsList = orderData.cartItems.map(item => 
    `• ${item.name} - Qty: ${item.quantity} - ₹${item.total.toFixed(2)}`
  ).join('\n');

  return {
    // Order Information
    order_id: orderData.orderId,
    order_date: new Date(orderData.timestamp).toLocaleString('en-IN'),
    order_status: orderData.status,
    payment_method: orderData.paymentMethod,
    
    // Customer Information (all form fields)
    customer_name: orderData.customerDetails.name,
    customer_email: orderData.customerDetails.email,
    customer_phone: orderData.customerDetails.phone,
    customer_address: orderData.customerDetails.address,
    customer_city: orderData.customerDetails.city,
    customer_pincode: orderData.customerDetails.pincode,
    delivery_instructions: orderData.customerDetails.deliveryInstructions || 'None',
    
    // Delivery Address (formatted)
    delivery_address: `${orderData.customerDetails.address}, ${orderData.customerDetails.city} - ${orderData.customerDetails.pincode}`,
    
    // Order Items
    order_items: itemsList,
    item_count: orderData.cartItems.length,
    
    // Pricing Information
    subtotal: `₹${orderData.subtotal.toFixed(2)}`,
    tax: `₹${orderData.tax.toFixed(2)}`,
    shipping: orderData.shipping === 0 ? 'FREE' : `₹${orderData.shipping.toFixed(2)}`,
    total_amount: `₹${orderData.total.toFixed(2)}`,
    
    // Additional Information
    order_summary: `Order #${orderData.orderId} - ${orderData.cartItems.length} items - ${orderData.paymentMethod}`,
    contact_info: `Phone: ${orderData.customerDetails.phone} | Email: ${orderData.customerDetails.email}`,
    
    // For EmailJS template variables
    to_name: orderData.customerDetails.name,
    to_email: orderData.customerDetails.email
  };
};

// Send customer confirmation email
export const sendCustomerConfirmationEmail = async (orderData) => {
  try {
    // Check if EmailJS is properly configured
    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY_HERE') {
      console.warn('⚠️ EmailJS not configured. Please update the public key in emailService.js');
      return { success: false, error: 'EmailJS not configured' };
    }

    const templateParams = {
      ...formatOrderDetailsForEmail(orderData),
      to_email: orderData.customerDetails.email,
      to_name: orderData.customerDetails.name
    };

    console.log('📧 Sending customer confirmation email...');
    console.log('📧 Template params:', templateParams);
    
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_CUSTOMER_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ Customer email sent successfully:', result);
    return { success: true, result };
  } catch (error) {
    console.error('❌ Failed to send customer email:', error);
    return { success: false, error: error.message };
  }
};

// Send admin notification email
export const sendAdminNotificationEmail = async (orderData) => {
  try {
    // Check if EmailJS is properly configured
    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY_HERE') {
      console.warn('⚠️ EmailJS not configured. Please update the public key in emailService.js');
      return { success: false, error: 'EmailJS not configured' };
    }

    const templateParams = {
      ...formatOrderDetailsForEmail(orderData),
      to_email: ADMIN_EMAIL,
      to_name: 'Candy Bliss Admin'
    };

    console.log('📧 Sending admin notification email...');
    console.log('📧 Template params:', templateParams);
    
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_ADMIN_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ Admin email sent successfully:', result);
    return { success: true, result };
  } catch (error) {
    console.error('❌ Failed to send admin email:', error);
    return { success: false, error: error.message };
  }
};

// Send both emails
export const sendOrderConfirmationEmails = async (orderData) => {
  console.log('📨 Sending order confirmation emails...');
  
  const results = await Promise.allSettled([
    sendCustomerConfirmationEmail(orderData),
    sendAdminNotificationEmail(orderData)
  ]);

  const customerResult = results[0];
  const adminResult = results[1];

  console.log('📊 Email sending results:', {
    customer: customerResult.status === 'fulfilled' ? customerResult.value : customerResult.reason,
    admin: adminResult.status === 'fulfilled' ? adminResult.value : adminResult.reason
  });

  return {
    customer: customerResult.status === 'fulfilled' ? customerResult.value : { success: false, error: customerResult.reason },
    admin: adminResult.status === 'fulfilled' ? adminResult.value : { success: false, error: adminResult.reason }
  };
}; 
