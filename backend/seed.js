require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Order = require('./models/order');
const OrderStatus = require('./models/orderStatus');

async function seed() {
  await connectDB();
  console.log('Seeding sample data...');

  // Remove existing small set (optional)
  // await Order.deleteMany({});
  // await OrderStatus.deleteMany({});

  // create sample orders
  const orders = [
    { school_id: process.env.SCHOOL_ID || '65b0e6293e9f76a9694d84b4', custom_order_id: 'ORD-1001', gateway_name: 'PhonePe', student_info: { name: 'Ravi', id: 'S1', email: 'ravi@example.com' }},
    { school_id: process.env.SCHOOL_ID || '65b0e6293e9f76a9694d84b4', custom_order_id: 'ORD-1002', gateway_name: 'Razorpay', student_info: { name: 'Priya', id: 'S2', email: 'priya@example.com' }},
  ];

  for (const o of orders) {
    let ex = await Order.findOne({ custom_order_id: o.custom_order_id });
    if (!ex) ex = await new Order(o).save();
    // create status
    const s = await OrderStatus.findOne({ collect_id: ex._id });
    if (!s) await new OrderStatus({
      collect_id: ex._id,
      order_amount: 2000,
      transaction_amount: 2000,
      payment_mode: 'upi',
      payment_details: 'success@ybl',
      bank_reference: 'REF' + Math.floor(Math.random() * 10000),
      payment_message: 'payment success',
      status: 'success',
      payment_time: new Date()
    }).save();
  }
  console.log('Seeding completed.');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
