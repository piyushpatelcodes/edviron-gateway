const axios = require("axios");
const OrderStatus = require("./models/orderStatus");

// Polling function
async function pollTransaction(transactionId) {
  try {
    const res = await axios.get(
      `https://dev-payments.edviron.com/check-status?transactionId=${transactionId}`
    );

    const data = res.data;

    // Save/update order in MongoDB
    // const collectId = data.custom_order_id || null;
     const collectId = /^[0-9a-fA-F]{24}$/.test(data.custom_order_id)
      ? data.custom_order_id
      : null;

    const statusPayload = {
      collect_id: collectId,
      order_amount: data.amount,
      transaction_amount: data.transaction_amount,
      payment_mode: data.details?.payment_mode,
       payment_details: data.details?.payment_methods
    ? JSON.stringify(data.details.payment_methods)
    : null, 
      bank_reference: data.details?.bank_ref,
      payment_message: data.message || "",
      status: String(data.status.toLowerCase() ?? "pending"),
      error_message: data.error_message || null,
      payment_time: new Date(),
    };

    let existing = null;
    if (collectId) existing = await OrderStatus.findOne({ collect_id: collectId });
    if (!existing && statusPayload.bank_reference) {
      existing = await OrderStatus.findOne({ bank_reference: statusPayload.bank_reference });
    }

    if (existing) {
      Object.assign(existing, statusPayload);
      await existing.save();
    } else {
      await new OrderStatus(statusPayload).save();
    }

    console.log("✅ Payment polled:", statusPayload.status);
  } catch (err) {
    console.error("❌ Polling error:", err.message);
  }
}

module.exports = pollTransaction;
