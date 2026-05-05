const Order = require("../models/order.model");
const User = require("../models/user.model");
const nodemailer = require("nodemailer");
const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY || "sk_test_demo",
);
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

// Configure Nodemailer for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Generate unique order ID
const generateOrderId = () => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Validate address
const validateAddressWithAPI = async (address) => {
  try {
    // Basic validation
    const required = ["name", "email", "address", "city", "zip"];
    for (let field of required) {
      if (!address[field] || !address[field].toString().trim()) {
        return { valid: false, message: `${field} is required` };
      }
    }

    // ZIP code validation (5-6 digits)
    if (!/^\d{5,6}$/.test(address.zip)) {
      return { valid: false, message: "Invalid ZIP code format" };
    }

    // Email validation
    if (!/\S+@\S+\.\S+/.test(address.email)) {
      return { valid: false, message: "Invalid email format" };
    }

    return { valid: true };
  } catch (error) {
    console.error("Address validation error:", error.message);
    return { valid: false, message: "Address validation error" };
  }
};

// Send order confirmation email
const sendOrderEmail = async (user, order) => {
  try {
    const itemsHtml = order.items
      .map(
        (item) => `
      <li style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
        <strong>${item.productName}</strong> (Qty: ${item.quantity}) - ₹${item.price * item.quantity}
      </li>
    `,
      )
      .join("");

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: order.shippingAddress.email,
      subject: `Order Confirmation - ${order.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #333; border-bottom: 3px solid #007bff; padding-bottom: 10px;">Order Confirmed!</h2>
          <p style="font-size: 16px; color: #555;">Hi <strong>${order.shippingAddress.name}</strong>,</p>
          <p style="color: #666;">Thank you for your purchase! Here are your order details:</p>
          
          <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">${order.orderStatus.toUpperCase()}</span></p>
          </div>

          <h3 style="color: #333; margin-top: 20px;">Items Ordered:</h3>
          <ul style="list-style: none; padding: 0;">
            ${itemsHtml}
          </ul>

          <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td>Subtotal:</td>
                <td style="text-align: right;">₹${order.pricing.subtotal}</td>
              </tr>
              <tr>
                <td>Tax (10%):</td>
                <td style="text-align: right;">₹${order.pricing.tax}</td>
              </tr>
              <tr>
                <td>Shipping:</td>
                <td style="text-align: right;">₹${order.pricing.shipping}</td>
              </tr>
              <tr style="font-weight: bold; border-top: 2px solid #333; padding-top: 10px;">
                <td>Total:</td>
                <td style="text-align: right;">₹${order.pricing.total}</td>
              </tr>
            </table>
          </div>

          <h3 style="color: #333; margin-top: 20px;">Shipping Address:</h3>
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
            <p style="margin: 5px 0;">${order.shippingAddress.name}</p>
            <p style="margin: 5px 0;">${order.shippingAddress.address}</p>
            <p style="margin: 5px 0;">${order.shippingAddress.city} - ${order.shippingAddress.zip}</p>
            <p style="margin: 5px 0;">📧 ${order.shippingAddress.email}</p>
          </div>

          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            You will receive a shipping update within 24 hours. For any questions, please reply to this email.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px;">
            <p>© 2026 Bravyn. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(
      `Order confirmation email sent to ${order.shippingAddress.email}`,
    );
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

// Log order event
const logOrderEvent = async (orderId, eventType, orderData) => {
  try {
    console.log(`[Order Event] ${eventType} - Order ID: ${orderId}`);
  } catch (error) {
    console.warn("Failed to log event:", error.message);
  }
};

// Send SMS notification
const sendSMSNotification = async (mobileNumber, message) => {
  try {
    if (!mobileNumber) {
      console.log("No mobile number provided for SMS");
      return;
    }
    console.log(`[SMS Notification] Sending to ${mobileNumber}: ${message}`);
  } catch (error) {
    console.warn("Failed to send SMS:", error.message);
  }
};

// Create Stripe Payment Intent
const createPaymentIntent = async (amount) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "inr",
      metadata: {
        integration_check: "accept_a_payment",
      },
    });
    return paymentIntent;
  } catch (error) {
    throw new Error(`Stripe error: ${error.message}`);
  }
};

const attachOrderToUser = async (userId, orderId) => {
  if (!userId || !orderId) return;

  await User.findByIdAndUpdate(userId, {
    $addToSet: { orders: orderId },
  });
};

// Place Order
const placeOrder = asyncHandler(async (req, res) => {
  const {
    userId,
    items,
    shippingAddress,
    paymentMethod: rawPaymentMethod,
    paymentDetails,
    mobileNumber,
  } = req.body;
  const paymentMethod = rawPaymentMethod || paymentDetails?.method || "cod";

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ message: "At least one order item is required" });
  }

  const hasInvalidItems = items.some(
    (item) =>
      !item?.productId ||
      !item?.productName ||
      typeof item?.price !== "number" ||
      typeof item?.quantity !== "number" ||
      item.quantity <= 0,
  );
  if (hasInvalidItems) {
    throw new ApiError(400, "Invalid order items");
  }

  if (!shippingAddress) {
    throw new ApiError(400, "Shipping address is required");
  }

  // Validate address using external API
  const validation = await validateAddressWithAPI(shippingAddress);
  if (!validation.valid) {
    throw new ApiError(400, validation.message);
  }

  // Calculate pricing
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shipping;

  // Create order object
  const orderId = generateOrderId();
  const orderData = {
    orderId,
    userId,
    items,
    shippingAddress,
    mobileNumber,
    pricing: { subtotal, tax, shipping, total },
    paymentDetails: {
      method: paymentMethod || "cod",
      status: paymentMethod === "stripe" ? "pending" : "completed",
    },
    orderStatus: "pending",
  };

  // Handle Stripe payment
  if (paymentMethod === "stripe") {
    const paymentIntent = await createPaymentIntent(total);
    orderData.paymentDetails.stripePaymentIntentId = paymentIntent.id;
    orderData.paymentDetails.status = "pending";

    const order = await new Order(orderData).save();
    await attachOrderToUser(userId, order._id);

    await logOrderEvent(orderId, "PAYMENT_INITIATED", orderData);

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { order, clientSecret: paymentIntent.client_secret },
          "Payment required",
        ),
      );
  }

  // COD: Order confirmed immediately
  orderData.paymentDetails.status = "completed";
  orderData.orderStatus = "confirmed";

  const order = await new Order(orderData).save();
  await attachOrderToUser(userId, order._id);

  const user = await User.findById(userId);

  await sendOrderEmail(user, order);

  if (mobileNumber) {
    await sendSMSNotification(
      mobileNumber,
      `Order confirmed! Order ID: ${orderId}. Total: ₹${total}. Thank you for shopping with Bravyn!`,
    );
  }

  await logOrderEvent(orderId, "ORDER_CONFIRMED", orderData);

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order placed successfully"));
});

// Confirm Payment
const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentIntentId, orderId } = req.body;

  if (!paymentIntentId || !orderId) {
    throw new ApiError(400, "Payment intent and order ID required");
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status === "succeeded") {
    const order = await Order.findOneAndUpdate(
      { orderId },
      {
        "paymentDetails.status": "completed",
        orderStatus: "confirmed",
      },
      { new: true },
    );

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    await attachOrderToUser(order.userId, order._id);

    const user = await User.findById(order.userId);
    await sendOrderEmail(user, order);

    if (order.mobileNumber) {
      await sendSMSNotification(
        order.mobileNumber,
        `Payment confirmed! Order ${orderId} is now confirmed. Total: ₹${order.pricing.total}. Thank you for shopping with Bravyn!`,
      );
    }

    await logOrderEvent(orderId, "PAYMENT_CONFIRMED", {
      paymentIntentId,
      amount: order.pricing.total,
      status: "completed",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, order, "Payment confirmed"));
  }

  await logOrderEvent(orderId, "PAYMENT_FAILED", {
    paymentIntentId,
    status: paymentIntent.status,
  });

  throw new ApiError(400, "Payment failed");
});

// Get Order by ID
const getOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  const order = await Order.findOne({ orderId }).populate(
    "userId",
    "name email",
  );

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

// Get User Orders
const getUserOrders = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const orders = await Order.find({ userId }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "User orders fetched successfully"));
});

module.exports = {
  placeOrder,
  confirmPayment,
  getOrder,
  getUserOrders,
};
