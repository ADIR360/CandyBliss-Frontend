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

// Format order items for email display
const formatOrderItemsForEmail = (cartItems) => {
  if (!cartItems || cartItems.length === 0) {
    return 'No items in order';
  }
  
  let itemsText = '';
  cartItems.forEach((item, index) => {
    itemsText += `${index + 1}. ${item.name}\n`;
    itemsText += `   Price: ₹${item.price} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}\n\n`;
  });
  
  return itemsText.trim();
};

// Format date for email
const formatDateForEmail = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Send customer confirmation email
export const sendCustomerConfirmationEmail = async (orderData) => {
  try {
    console.log('📧 Preparing customer confirmation email...');
    console.log('📋 Order data for email:', {
      orderId: orderData.orderId,
      customerEmail: orderData.customerDetails?.email,
      customerName: orderData.customerDetails?.name,
      itemCount: orderData.cartItems?.length
    });

    // **FIX: Properly map all template parameters including to_email**
    const templateParams = {
      // **CRITICAL: EmailJS requires these fields to send the email**
      to_email: orderData.customerDetails.email,  // 🔧 This was missing!
      to_name: orderData.customerDetails.name,    // 🔧 This was also missing!
      
      // Order details
      order_id: orderData.orderId,
      order_date: formatDateForEmail(orderData.timestamp),
      order_status: orderData.status || 'Confirmed',
      payment_method: orderData.paymentMethod,
      item_count: orderData.cartItems?.length || 0,
      
      // Customer information
      customer_name: orderData.customerDetails.name,
      customer_phone: orderData.customerDetails.phone,
      customer_email: orderData.customerDetails.email,
      
      // Delivery address
      customer_address: orderData.customerDetails.address,
      customer_city: orderData.customerDetails.city,
      customer_pincode: orderData.customerDetails.pincode,
      delivery_instructions: orderData.customerDetails.deliveryInstructions || 'None specified',
      
      // Order items and pricing
      order_items: formatOrderItemsForEmail(orderData.cartItems),
      subtotal: `₹${orderData.subtotal?.toFixed(2) || '0.00'}`,
      tax: `₹${orderData.tax?.toFixed(2) || '0.00'}`,
      shipping: orderData.shipping === 0 ? 'FREE' : `₹${orderData.shipping?.toFixed(2) || '0.00'}`,
      total_amount: `₹${orderData.total?.toFixed(2) || '0.00'}`,
      
      // Additional metadata
      from_name: 'Candy Bliss',
      reply_to: ADMIN_EMAIL
    };

    // **Debug: Log the complete template params**
    console.log('📤 Complete templateParams being sent to EmailJS:', templateParams);
    
    // Validate required fields
    if (!templateParams.to_email) {
      throw new Error('Customer email (to_email) is required but missing');
    }
    
    if (!templateParams.to_name) {
      throw new Error('Customer name (to_name) is required but missing');
    }

    console.log('📨 Sending customer confirmation email to:', templateParams.to_email);
    
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_CUSTOMER_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ Customer email sent successfully:', {
      status: response.status,
      text: response.text,
      to: templateParams.to_email
    });

    return {
      success: true,
      response: response,
      emailSentTo: templateParams.to_email
    };

  } catch (error) {
    console.error('❌ Customer email failed:', {
      error: error.message,
      status: error.status,
      text: error.text,
      customerEmail: orderData.customerDetails?.email
    });

    return {
      success: false,
      error: error.message,
      details: {
        status: error.status,
        text: error.text
      }
    };
  }
};

// Send admin notification email
export const sendAdminNotificationEmail = async (orderData) => {
  try {
    console.log('📧 Preparing admin notification email...');

    // **FIX: Admin email template params with proper mapping**
    const adminTemplateParams = {
      // **CRITICAL: EmailJS requires these fields**
      to_email: ADMIN_EMAIL,  // 🔧 Admin email as recipient
      to_name: 'Admin',       // 🔧 Admin name
      
      // Order details for admin
      order_id: orderData.orderId,
      order_date: formatDateForEmail(orderData.timestamp),
      order_status: orderData.status || 'New Order',
      payment_method: orderData.paymentMethod,
      item_count: orderData.cartItems?.length || 0,
      
      // Customer information for admin
      customer_name: orderData.customerDetails.name,
      customer_phone: orderData.customerDetails.phone,
      customer_email: orderData.customerDetails.email,
      
      // Delivery address for admin
      customer_address: orderData.customerDetails.address,
      customer_city: orderData.customerDetails.city,
      customer_pincode: orderData.customerDetails.pincode,
      delivery_instructions: orderData.customerDetails.deliveryInstructions || 'None specified',
      
      // Order items and pricing for admin
      order_items: formatOrderItemsForEmail(orderData.cartItems),
      subtotal: `₹${orderData.subtotal?.toFixed(2) || '0.00'}`,
      tax: `₹${orderData.tax?.toFixed(2) || '0.00'}`,
      shipping: orderData.shipping === 0 ? 'FREE' : `₹${orderData.shipping?.toFixed(2) || '0.00'}`,
      total_amount: `₹${orderData.total?.toFixed(2) || '0.00'}`,
      
      // Admin-specific fields
      from_name: 'Candy Bliss Order System',
      reply_to: orderData.customerDetails.email,
      subject: `New Order #${orderData.orderId} - ${orderData.customerDetails.name}`
    };

    console.log('📤 Admin templateParams:', {
      to_email: adminTemplateParams.to_email,
      order_id: adminTemplateParams.order_id,
      customer_name: adminTemplateParams.customer_name
    });

    console.log('📨 Sending admin notification email to:', adminTemplateParams.to_email);
    
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_ADMIN_TEMPLATE_ID, // Using separate admin template
      adminTemplateParams
    );

    console.log('✅ Admin email sent successfully:', {
      status: response.status,
      text: response.text
    });

    return {
      success: true,
      response: response,
      emailSentTo: adminTemplateParams.to_email
    };

  } catch (error) {
    console.error('❌ Admin email failed:', {
      error: error.message,
      status: error.status,
      text: error.text
    });

    return {
      success: false,
      error: error.message,
      details: {
        status: error.status,
        text: error.text
      }
    };
  }
};

// Main function to send both emails
export const sendOrderConfirmationEmails = async (orderData) => {
  console.log('📧 Starting email sending process for order:', orderData.orderId);
  
  // Validate order data
  if (!orderData.customerDetails?.email) {
    console.error('❌ Cannot send emails: Customer email is missing');
    return {
      customer: {
        success: false,
        error: 'Customer email is missing from order data'
      },
      admin: {
        success: false,
        error: 'Customer email is missing from order data'
      }
    };
  }

  if (!orderData.customerDetails?.name) {
    console.error('❌ Cannot send emails: Customer name is missing');
    return {
      customer: {
        success: false,
        error: 'Customer name is missing from order data'
      },
      admin: {
        success: false,
        error: 'Customer name is missing from order data'
      }
    };
  }

  // Send both emails concurrently
  const [customerResult, adminResult] = await Promise.allSettled([
    sendCustomerConfirmationEmail(orderData),
    sendAdminNotificationEmail(orderData)
  ]);

  const results = {
    customer: customerResult.status === 'fulfilled' ? customerResult.value : {
      success: false,
      error: customerResult.reason?.message || 'Unknown error'
    },
    admin: adminResult.status === 'fulfilled' ? adminResult.value : {
      success: false,
      error: adminResult.reason?.message || 'Unknown error'
    }
  };

  console.log('📊 Email results summary:', {
    customerSuccess: results.customer.success,
    adminSuccess: results.admin.success,
    orderId: orderData.orderId
  });

  return results;
};

// Export as named exports and default export to avoid ESLint warning
const emailService = {
  sendCustomerConfirmationEmail,
  sendAdminNotificationEmail,
  sendOrderConfirmationEmails
};

export default emailService;