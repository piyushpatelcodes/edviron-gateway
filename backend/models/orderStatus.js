const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderStatusSchema = new Schema(
  {
    collect_id: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      index: true,
      sparse: true,
    },
    order_amount: { type: Number },
    transaction_amount: { type: Number },
    payment_mode: { type: String },
    payment_details: { type: String },
    bank_reference: { type: String, index: true, sparse: true },
    payment_message: { type: String },
    status: { type: String, index: true },
    error_message: { type: String },
    payment_time: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderStatus", OrderStatusSchema);
