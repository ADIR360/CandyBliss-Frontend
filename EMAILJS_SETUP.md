# EmailJS Setup Guide for Candy Bliss

This guide will help you set up EmailJS to send order confirmation emails for your Candy Bliss chocolate store.

## ✅ **Order ID System**

The application now uses a **sequential order ID system**:
- Orders start from **CB_001** and increment automatically
- Order IDs are stored in localStorage and persist across sessions
- Format: `CB_001`, `CB_002`, `CB_003`, etc.

## Step 1: Create EmailJS Account

1. **Go to [EmailJS.com](https://www.emailjs.com/)**
2. **Sign up for a free account**
3. **Verify your email address**

## Step 2: Get Your Public Key

1. **Log in to EmailJS dashboard**
2. **Go to Account → API Keys**
3. **Copy your Public Key**
4. **Replace `YOUR_PUBLIC_KEY_HERE` in `src/emailService.js`**

## Step 3: Create Email Service

1. **Go to Email Services**
2. **Click "Add New Service"**
3. **Choose your email provider (Gmail, Outlook, etc.)**
4. **Connect your email account**
5. **Copy the Service ID**
6. **Replace `YOUR_SERVICE_ID_HERE` in `src/emailService.js`**

## Step 4: Create Email Templates

### Customer Confirmation Template

1. **Go to Email Templates**
2. **Click "Create New Template"**
3. **Name it: "Customer Order Confirmation"**
4. **Use this comprehensive template:**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Order Confirmation - Candy Bliss</title>
    <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    <div style="background: linear-gradient(135deg, #ff6b6b, #ffa500); color: white; padding: 30px; text-align: center; border-radius: 15px; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 28px;">🍫 Candy Bliss</h1>
        <h2 style="margin: 10px 0 0 0; font-size: 20px;">Order Confirmation</h2>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h3 style="color: #333; margin-top: 0;">Hello {{to_name}},</h3>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">Thank you for your order! We're excited to prepare your delicious chocolates.</p>
        
        <!-- Order Details Section -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffa500;">
            <h4 style="color: #333; margin-top: 0;">📋 Order Details</h4>
            <p style="margin: 8px 0;"><strong>Order ID:</strong> <span style="color: #ff6b6b; font-weight: bold;">{{order_id}}</span></p>
            <p style="margin: 8px 0;"><strong>Order Date:</strong> {{order_date}}</p>
            <p style="margin: 8px 0;"><strong>Payment Method:</strong> {{payment_method}}</p>
            <p style="margin: 8px 0;"><strong>Status:</strong> <span style="color: #28a745;">{{order_status}}</span></p>
            <p style="margin: 8px 0;"><strong>Items:</strong> {{item_count}} products</p>
        </div>
        
        <!-- Customer Information Section -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #17a2b8;">
            <h4 style="color: #333; margin-top: 0;">👤 Customer Information</h4>
            <p style="margin: 8px 0;"><strong>Name:</strong> {{customer_name}}</p>
            <p style="margin: 8px 0;"><strong>Phone:</strong> {{customer_phone}}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> {{customer_email}}</p>
        </div>
        
        <!-- Delivery Address Section -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h4 style="color: #333; margin-top: 0;">📍 Delivery Address</h4>
            <p style="margin: 8px 0;"><strong>Address:</strong> {{customer_address}}</p>
            <p style="margin: 8px 0;"><strong>City:</strong> {{customer_city}}</p>
            <p style="margin: 8px 0;"><strong>Pincode:</strong> {{customer_pincode}}</p>
            {% if delivery_instructions != 'None' %}
            <p style="margin: 8px 0;"><strong>Delivery Instructions:</strong> {{delivery_instructions}}</p>
            {% endif %}
        </div>
        
        <!-- Order Items Section -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h4 style="color: #333; margin-top: 0;">📦 Order Items</h4>
            <div style="background: white; padding: 15px; border-radius: 8px;">
                <pre style="white-space: pre-wrap; font-family: inherit; margin: 0; color: #333;">{{order_items}}</pre>
            </div>
        </div>
        
        <!-- Order Summary Section -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <h4 style="color: #333; margin-top: 0;">💰 Order Summary</h4>
            <p style="margin: 8px 0;"><strong>Subtotal:</strong> {{subtotal}}</p>
            <p style="margin: 8px 0;"><strong>Tax (18%):</strong> {{tax}}</p>
            <p style="margin: 8px 0;"><strong>Shipping:</strong> {{shipping}}</p>
            <p style="margin: 8px 0; font-size: 18px; font-weight: bold; color: #ff6b6b;"><strong>Total Amount:</strong> {{total_amount}}</p>
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 30px; color: #666; background: white; padding: 20px; border-radius: 10px;">
        <p style="margin: 8px 0; font-size: 16px;">We'll notify you when your order is ready for delivery!</p>
        <p style="margin: 8px 0; font-size: 14px;">Thank you for choosing Candy Bliss! 🍫</p>
        <p style="margin: 8px 0; font-size: 12px; color: #999;">For any questions, contact us at support@candybliss.com</p>
    </div>
</body>
</html>
```

5. **Copy the Template ID**
6. **Replace `YOUR_CUSTOMER_TEMPLATE_ID_HERE` in `src/emailService.js`**

### Admin Notification Template

1. **Create another template named "Admin Order Notification"**
2. **Use this comprehensive template:**

```html
<!DOCTYPE html>
<html>
<head>
    <title>New Order - Candy Bliss</title>
    <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    <div style="background: linear-gradient(135deg, #ff6b6b, #ffa500); color: white; padding: 30px; text-align: center; border-radius: 15px; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 28px;">🍫 Candy Bliss</h1>
        <h2 style="margin: 10px 0 0 0; font-size: 20px;">New Order Alert!</h2>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h3 style="color: #333; margin-top: 0;">🚨 New Order Received</h3>
        <p style="color: #666; font-size: 16px; line-height: 1.6;">A new order has been placed and requires your attention.</p>
        
        <!-- Order Details Section -->
        <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h4 style="color: #333; margin-top: 0;">📋 Order Details</h4>
            <p style="margin: 8px 0;"><strong>Order ID:</strong> <span style="color: #ff6b6b; font-weight: bold;">{{order_id}}</span></p>
            <p style="margin: 8px 0;"><strong>Order Date:</strong> {{order_date}}</p>
            <p style="margin: 8px 0;"><strong>Payment Method:</strong> {{payment_method}}</p>
            <p style="margin: 8px 0;"><strong>Status:</strong> <span style="color: #28a745;">{{order_status}}</span></p>
            <p style="margin: 8px 0;"><strong>Items:</strong> {{item_count}} products</p>
        </div>
        
        <!-- Customer Information Section -->
        <div style="background: #d1ecf1; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #17a2b8;">
            <h4 style="color: #333; margin-top: 0;">👤 Customer Information</h4>
            <p style="margin: 8px 0;"><strong>Name:</strong> {{customer_name}}</p>
            <p style="margin: 8px 0;"><strong>Phone:</strong> {{customer_phone}}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> {{customer_email}}</p>
        </div>
        
        <!-- Delivery Address Section -->
        <div style="background: #d4edda; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h4 style="color: #333; margin-top: 0;">📍 Delivery Address</h4>
            <p style="margin: 8px 0;"><strong>Address:</strong> {{customer_address}}</p>
            <p style="margin: 8px 0;"><strong>City:</strong> {{customer_city}}</p>
            <p style="margin: 8px 0;"><strong>Pincode:</strong> {{customer_pincode}}</p>
            {% if delivery_instructions != 'None' %}
            <p style="margin: 8px 0;"><strong>Delivery Instructions:</strong> {{delivery_instructions}}</p>
            {% endif %}
        </div>
        
        <!-- Order Items Section -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #6c757d;">
            <h4 style="color: #333; margin-top: 0;">📦 Order Items</h4>
            <div style="background: white; padding: 15px; border-radius: 8px;">
                <pre style="white-space: pre-wrap; font-family: inherit; margin: 0; color: #333;">{{order_items}}</pre>
            </div>
        </div>
        
        <!-- Order Summary Section -->
        <div style="background: #f8d7da; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <h4 style="color: #333; margin-top: 0;">💰 Order Summary</h4>
            <p style="margin: 8px 0;"><strong>Subtotal:</strong> {{subtotal}}</p>
            <p style="margin: 8px 0;"><strong>Tax (18%):</strong> {{tax}}</p>
            <p style="margin: 8px 0;"><strong>Shipping:</strong> {{shipping}}</p>
            <p style="margin: 8px 0; font-size: 18px; font-weight: bold; color: #dc3545;"><strong>Total Amount:</strong> {{total_amount}}</p>
        </div>
        
        <!-- Contact Information -->
        <div style="background: #e2e3e5; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #6c757d;">
            <h4 style="color: #333; margin-top: 0;">📞 Contact Information</h4>
            <p style="margin: 8px 0;"><strong>Phone:</strong> {{customer_phone}}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> {{customer_email}}</p>
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 30px; color: #666; background: white; padding: 20px; border-radius: 10px;">
        <p style="margin: 8px 0; font-size: 16px; font-weight: bold; color: #dc3545;">Please process this order as soon as possible!</p>
        <p style="margin: 8px 0; font-size: 14px;">Order Summary: {{order_summary}}</p>
    </div>
</body>
</html>
```

3. **Copy the Template ID**
4. **Replace `YOUR_ADMIN_TEMPLATE_ID_HERE` in `src/emailService.js`**

## Step 5: Update Configuration

Open `src/emailService.js` and replace these values:

```javascript
const EMAILJS_PUBLIC_KEY = 'your_actual_public_key_here';
const EMAILJS_SERVICE_ID = 'your_actual_service_id_here';
const EMAILJS_CUSTOMER_TEMPLATE_ID = 'your_customer_template_id_here';
const EMAILJS_ADMIN_TEMPLATE_ID = 'your_admin_template_id_here';
const ADMIN_EMAIL = 'your_admin_email@gmail.com';
```

## Step 6: Test the Setup

1. **Start your development server:**
   ```bash
   npm start
   ```

2. **Go to your application and place a test order**

3. **Check the browser console for email sending logs**

4. **Check your email inbox for confirmation emails**

## ✅ **Available Template Variables**

The EmailJS templates now include **all form fields**:

### Order Information
- `{{order_id}}` - Sequential order ID (CB_001, CB_002, etc.)
- `{{order_date}}` - Order date and time
- `{{order_status}}` - Order status (Pending, Paid, etc.)
- `{{payment_method}}` - Payment method (Cash on Delivery, Online Payment)
- `{{item_count}}` - Number of items in order

### Customer Information
- `{{customer_name}}` - Customer's full name
- `{{customer_email}}` - Customer's email address
- `{{customer_phone}}` - Customer's phone number
- `{{customer_address}}` - Delivery address
- `{{customer_city}}` - City
- `{{customer_pincode}}` - Pincode
- `{{delivery_instructions}}` - Special delivery instructions

### Order Details
- `{{order_items}}` - List of all ordered items with quantities and prices
- `{{subtotal}}` - Order subtotal
- `{{tax}}` - Tax amount (18%)
- `{{shipping}}` - Shipping cost (FREE if ≥₹350)
- `{{total_amount}}` - Total order amount

### Additional Information
- `{{order_summary}}` - Brief order summary
- `{{contact_info}}` - Contact information summary
- `{{to_name}}` - Recipient name
- `{{to_email}}` - Recipient email

## Troubleshooting

### Common Issues:

1. **"EmailJS not configured" error:**
   - Make sure you've replaced all placeholder values in `emailService.js`

2. **"Service not found" error:**
   - Verify your Service ID is correct
   - Make sure your email service is properly connected

3. **"Template not found" error:**
   - Verify your Template IDs are correct
   - Make sure templates are published and active

4. **Emails not sending:**
   - Check browser console for detailed error messages
   - Verify your EmailJS account has sufficient credits
   - Check if your email service is working

### Debug Mode:

The application includes detailed console logging. Check your browser's developer console for:
- 📧 Email sending attempts
- ✅ Success messages
- ❌ Error messages
- 📊 Email sending results

## EmailJS Free Plan Limits

- **200 emails per month** (free plan)
- **2 email services** (free plan)
- **5 email templates** (free plan)

For production use, consider upgrading to a paid plan.

## Security Notes

- Never expose your EmailJS Private Key in frontend code
- The Public Key is safe to use in frontend applications
- Consider rate limiting for production applications 