const { Router } = require("express");
const {
  placeOrder,
  confirmPayment,
  getOrder,
  getUserOrders,
} = require("../controllers/order.controller");

const router = Router();

// Place an order
router.post("/place", placeOrder);

// Confirm Stripe payment
router.post("/confirm-payment", confirmPayment);

// Get single order
router.get("/:orderId", getOrder);

// Get all orders for a user
router.get("/user/:userId", getUserOrders);

module.exports = router;
