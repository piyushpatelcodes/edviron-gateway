require('dotenv').config();
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const Order = require('./models/order');
const OrderStatus = require('./models/orderStatus');

async function seed() {
  await connectDB();
  console.log('Seeding sample data...');

  // Load JSON data from files
  const orders = JSON.parse(fs.readFileSync(path.join(__dirname, "config",'mockdata.json')));
  const orderStatuses = JSON.parse(fs.readFileSync(path.join(__dirname, 'config','orderstatus_mock.json')));

  // Optional: clear existing data
  // await Order.deleteMany({});
  // await OrderStatus.deleteMany({});

  for (const o of orders) {
    // Check if order exists
    let existingOrder = await Order.findOne({ custom_order_id: o.custom_order_id });
    if (!existingOrder) {
      existingOrder = await new Order(o).save();
      console.log(`Order saved: ${o.custom_order_id}`);
    } else {
      console.log(`Order exists: ${o.custom_order_id}`);
    }

    // Find matching status from orderStatuses
    // Assuming orderStatuses and orders correspond in order (or you can match by some field)
    // Here, you can match by payment_mode or other fields if needed

    // For demonstration, find first status without collect_id linked
    // Or you can try to match by some order_amount if it exists on order or add key linking
    
    // Simple approach: just take the first status that is not linked yet
    const linkedStatus = await OrderStatus.findOne({ collect_id: existingOrder._id });
    if (!linkedStatus) {
      // For demo, pick the first unused status from orderStatuses
      // We'll track used indexes to avoid duplicates
      if (!seed.usedStatuses) seed.usedStatuses = new Set();

      let statusToSave = null;
      for (let i = 0; i < orderStatuses.length; i++) {
        if (!seed.usedStatuses.has(i)) {
          statusToSave = orderStatuses[i];
          seed.usedStatuses.add(i);
          break;
        }
      }

      if (statusToSave) {
        await new OrderStatus({
          collect_id: existingOrder._id,
          order_amount: statusToSave.order_amount,
          transaction_amount: statusToSave.transaction_amount,
          payment_mode: statusToSave.payment_mode,
          payment_details: statusToSave.payment_details,
          bank_reference: statusToSave.bank_reference,
          payment_message: statusToSave.payment_message || '',
          status: statusToSave.status,
          payment_time: new Date(statusToSave.payment_time)
        }).save();
        console.log(`Order status saved for order ${o.custom_order_id}`);
      } else {
        console.log(`No available status found for order ${o.custom_order_id}`);
      }
    } else {
      console.log(`Status already exists for order ${o.custom_order_id}`);
    }
  }

  console.log('Seeding completed.');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
