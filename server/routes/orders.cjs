const express = require("express");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order.cjs");

const router = express.Router();

// =========================
// AUTHENTICATION MIDDLEWARE
// =========================

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// =========================
// CREATE ORDER
// =========================

router.post(
  "/",
  authenticateUser,
  async (req, res) => {
    try {
      const { items, totalAmount } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({
          message: "Cart is empty",
        });
      }

      if (
        typeof totalAmount !== "number" ||
        totalAmount <= 0
      ) {
        return res.status(400).json({
          message: "Invalid total amount",
        });
      }

      const orderItems = items.map((item) => ({
        product: item.product || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const order = await Order.create({
        user: req.user.userId,
        items: orderItems,
        totalAmount,
      });

      res.status(201).json({
        message: "Order placed successfully",
        order,
      });
    } catch (error) {
      console.error(
        "Create order error:",
        error
      );

      res.status(500).json({
        message: "Failed to place order",
        error: error.message,
      });
    }
  }
);

// =========================
// GET MY ORDERS
// =========================

router.get(
  "/",
  authenticateUser,
  async (req, res) => {
    try {
      const orders = await Order.find({
        user: req.user.userId,
      })
        .populate("items.product")
        .sort({ createdAt: -1 });

      res.json(orders);
    } catch (error) {
      console.error(
        "Fetch orders error:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch orders",
        error: error.message,
      });
    }
  }
);

// =========================
// GET SINGLE ORDER
// =========================

router.get(
  "/:id",
  authenticateUser,
  async (req, res) => {
    try {
      const order = await Order.findOne({
        _id: req.params.id,
        user: req.user.userId,
      }).populate("items.product");

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.json(order);
    } catch (error) {
      console.error(
        "Fetch order error:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch order",
        error: error.message,
      });
    }
  }
);

module.exports = router;