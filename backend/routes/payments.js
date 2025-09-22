// routes/payment.js
const express = require("express");
const router = express.Router();
require('dotenv').config();
const { body, validationResult } = require("express-validator");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const auth = require("../middleware/auth");
const Order = require("../models/order");
const OrderStatus = require("../models/orderStatus");

// POST /create-payment
router.post(
  "/create-payment",
  auth,
  body("orderId").isString().notEmpty(),
  body("orderAmount").isNumeric(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { orderId, orderAmount, student } = req.body;

      // Ensure order exists
      let order = await Order.findOne({ custom_order_id: orderId });
      if (!order) {
        order = await new Order({
          school_id: process.env.SCHOOL_ID,
          custom_order_id: orderId,
          gateway_name: "edviron",
          student_info:student
        }).save();
      }
      

      // ✅ Create JWT sign payload (must be minimal)
      const signPayload = {
        school_id: process.env.SCHOOL_ID,
        amount: String(orderAmount),
        callback_url: "https://google.com",
      };
      const sign = jwt.sign(signPayload, process.env.PAYMENT_PG_KEY, {
        algorithm: "HS256",
      });

      // ✅ Final request body to provider
      const requestBody = {
        school_id: process.env.SCHOOL_ID,
        amount: String(orderAmount),
        callback_url: "https://google.com",
        sign,
      };

      // Call provider API
      const providerUrl =
        (process.env.PAYMENT_BASE_URL ||
          "https://dev-vanilla.edviron.com/erp") + "/create-collect-request";

      const r = await axios.post(providerUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PAYMENT_API_KEY}`,
        },
        timeout: 15000,
      });

      const data = r.data;

      // Save initial OrderStatus
      await OrderStatus.findOneAndUpdate(
        { collect_id: order._id },
        {
          collect_id: order._id,
          order_amount: orderAmount,
          status: "pending",
        },
        { upsert: true, new: true }
      );

      await axios.post(
    `${process.env.BACKEND_URL}/webhook`, 
    data, 
    {body:data,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log("✅ Webhook called successfully");

      // Return payment link if available
      return res.json({
        ok: true,
        payment_url: data.Collect_request_url,
        collect_request_id: data.collect_request_id,
        raw: data,
      });
    } catch (err) {
      console.error("❌ Payment create error:", err.message);
      next(err);
    }
  }
);

module.exports = router;
