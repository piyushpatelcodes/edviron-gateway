const express = require('express');
const router = express.Router();
const WebhookLog = require('../models/webhookLog');
const Order = require('../models/order');
const OrderStatus = require('../models/orderStatus');
const cron = require("node-cron");
const pollTransaction = require("../pollingStatus");
// const mongoose = require('mongoose');

router.post('/', async (req, res, next) => {
  try {
    const payload = req.body;
    console.log("🚀 ~ webhook payload:", payload)

    await new WebhookLog({ payload, receivedAt: new Date() }).save();

    const info = payload.order_info || payload;
    const orderIdRaw = info.order_id || info.orderId || info.collect_id;

    // Determine how to find the order:
    // 1) If orderIdRaw looks like ObjectId -> search by _id
    // 2) fallback to custom_order_id equal to orderIdRaw
    let order = null;

    if (orderIdRaw && /^[0-9a-fA-F]{24}$/.test(orderIdRaw)) {
      order = await Order.findById(orderIdRaw).lean();
    }
    if (!order && info.custom_order_id) {
      order = await Order.findOne({ custom_order_id: info.custom_order_id }).lean();
    }
    if (!order && orderIdRaw) {
      order = await Order.findOne({ custom_order_id: orderIdRaw }).lean();
    }

    const collectId = order ? order._id : null;
    cron.schedule("*/15 * * * * *", async () => {
  console.log("⏱️ Polling payments...");
    await pollTransaction(payload.collect_request_id);
  
});

    const statusPayload = {
      collect_id: collectId,
      order_amount: info.order_amount ?? info.orderAmount,
      transaction_amount: info.transaction_amount ?? info.transactionAmount,
      payment_mode: info.payment_mode ?? info.paymentMode,
      payment_details: info.payment_details ?? info.payment_details ?? info.paymentDetails,
      bank_reference: info.bank_reference ?? info.bankReference,
      payment_message: info.Payment_message ?? info.payment_message ?? info.paymentMessage,
      status: String(info.status ?? info.statusCode ?? 'unknown'),
      error_message: info.error_message ?? info.errorMessage ?? null,
      payment_time: info.payment_time ? new Date(info.payment_time) : (info.paymentTime ? new Date(info.paymentTime) : new Date())
    };

    let existing = null;
    if (collectId) existing = await OrderStatus.findOne({ collect_id: collectId });
    if (!existing && statusPayload.bank_reference) existing = await OrderStatus.findOne({ bank_reference: statusPayload.bank_reference });

    if (existing) {
      Object.assign(existing, statusPayload);
      await existing.save();
    } else {
      await new OrderStatus(statusPayload).save();
    }

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
