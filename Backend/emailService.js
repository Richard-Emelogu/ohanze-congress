const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email to admin when new order is placed
const sendNewOrderNotification = async (order) => {
  // Skip if email not configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️  Email not configured. Skipping admin notification.');
    return false;
  }

  const transporter = createTransporter();

  const itemsList = order.items.map(item => 
    `- ${item.productName} (${item.size}) x${item.quantity} - ₦${item.price.toFixed(2)}`
  ).join('\n');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `🎉 New Order Received - Order #${order.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7f1d1d;">New Order Notification</h2>
        <p>A new order has been placed on the Ohanze Congress website!</p>
        
        <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #7f1d1d; margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Customer:</strong> ${order.customerName}</p>
          <p><strong>Email:</strong> ${order.email}</p>
          <p><strong>Phone:</strong> ${order.phone}</p>
          <p><strong>Total Amount:</strong> ₦${order.totalAmount.toFixed(2)}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Payment:</strong> ${order.paymentStatus}</p>
        </div>

        <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
          <h3 style="color: #7f1d1d; margin-top: 0;">Items Ordered</h3>
          <pre style="font-family: monospace; white-space: pre-wrap;">${itemsList}</pre>
        </div>

        ${order.shippingAddress ? `
        <div style="margin-top: 20px;">
          <h3 style="color: #7f1d1d;">Shipping Address</h3>
          <p>
            ${order.shippingAddress.street || ''}<br>
            ${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''}<br>
            ${order.shippingAddress.zipCode || ''}
          </p>
        </div>
        ` : ''}

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            This is an automated notification from Ohanze Congress Store.<br>
            Order placed on ${new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Admin notification email sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Error sending admin email:', error.message);
    return false;
  }
};

// Send confirmation email to customer
const sendOrderConfirmation = async (order) => {
  // Skip if email not configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('⚠️  Email not configured. Skipping customer confirmation.');
    return false;
  }

  const transporter = createTransporter();

  const itemsList = order.items.map(item => 
    `- ${item.productName} (${item.size}) x${item.quantity} - ₦${item.price.toFixed(2)}`
  ).join('\n');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.email,
    subject: `Order Confirmation - August 93 Club`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #7f1d1d, #b91c1c); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0;">August 93 Club</h1>
          <p style="margin: 5px 0;">A.K.A Ohanze Congress</p>
        </div>

        <div style="padding: 30px;">
          <h2 style="color: #7f1d1d;">Thank You for Your Order!</h2>
          <p>Dear ${order.customerName},</p>
          <p>We've received your order and will process it shortly. Here are your order details:</p>
          
          <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #7f1d1d; margin-top: 0;">Order Summary</h3>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ₦${order.totalAmount.toFixed(2)}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>

          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #7f1d1d; margin-top: 0;">Items</h3>
            <pre style="font-family: monospace; white-space: pre-wrap;">${itemsList}</pre>
          </div>

          ${order.shippingAddress ? `
          <div style="margin: 20px 0;">
            <h3 style="color: #7f1d1d;">Delivery Address</h3>
            <p>
              ${order.shippingAddress.street || ''}<br>
              ${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''}<br>
              ${order.shippingAddress.zipCode || ''}
            </p>
          </div>
          ` : ''}

          <div style="margin-top: 30px; padding: 20px; background: #dbeafe; border-radius: 8px;">
            <p style="margin: 0;"><strong>Questions?</strong></p>
            <p style="margin: 5px 0;">Contact us at: ${process.env.EMAIL_USER}</p>
          </div>
        </div>

        <div style="background: #f3f4f6; padding: 20px; text-align: center;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            © 2025 August 93 Club - Ohanze Congress. All rights reserved.
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Customer confirmation email sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Error sending customer email:', error.message);
    return false;
  }
};

// Test email function
const sendTestEmail = async () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('❌ Email not configured. Please set EMAIL_USER and EMAIL_PASS in .env file');
    return false;
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: 'Test Email - Ohanze Congress',
    html: `
      <h2>Email Configuration Test</h2>
      <p>If you're reading this, your email notifications are working correctly! ✅</p>
      <p>You will now receive notifications whenever a new order is placed.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Error sending test email:', error.message);
    return false;
  }
};

module.exports = {
  sendNewOrderNotification,
  sendOrderConfirmation,
  sendTestEmail
};