const mongoose = require("mongoose");
const { Schema } = mongoose;

const StudentInfoSchema = new Schema(
  {
    name: { type: String, required: true },
    id: { type: String, required: true },
    email: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    school_id: { type: Schema.Types.Mixed, required: true, index: true },
    trustee_id: { type: Schema.Types.Mixed },
    student_info: { type: StudentInfoSchema, required: true },
    school_name: { type: String },
    gateway_name: { type: String },
    custom_order_id: { type: String, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
