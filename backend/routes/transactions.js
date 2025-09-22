const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/order');
const OrderStatus = require('../models/orderStatus');
const mongoose = require('mongoose');

// GET /transactions
// supports pagination: ?page=1&limit=20&sort=payment_time&order=desc
// router.get('/', auth, async (req, res, next) => {
//   try {
//     const page = Math.max(1, parseInt(req.query.page || '1'));
//     const limit = Math.max(1, parseInt(req.query.limit || '20'));
//     const sortField = req.query.sort || 'payment_time';
//     const order = (req.query.order || 'desc').toLowerCase() === 'desc' ? -1 : 1;

//     const skip = (page - 1) * limit;

//     const pipeline = [
//       // join with orderstatuses
//       {
//         $lookup: {
//           from: 'orderstatuses',
//           localField: '_id',
//           foreignField: 'collect_id',
//           as: 'statuses'
//         }
//       },
//       { $unwind: { path: '$statuses', preserveNullAndEmptyArrays: true } },
//       {
//         $project: {
//           collect_id: '$statuses.collect_id',
//           school_id: '$school_id',
//           gateway: '$gateway_name',
//           order_amount: '$statuses.order_amount',
//           transaction_amount: '$statuses.transaction_amount',
//           status: '$statuses.status',
//           custom_order_id: '$custom_order_id',
//           payment_time: '$statuses.payment_time'
//         }
//       },
//       { $sort: { [sortField]: order } },
//       { $skip: skip },
//       { $limit: limit }
//     ];

//     const results = await Order.aggregate(pipeline);
//     res.json({ page, limit, data: results });
//   } catch (err) { console.log("🚀 ~ err:", err); next(err); }
  
// });

router.get('/', auth, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, parseInt(req.query.limit || '20'));
    const sortField = req.query.sort || 'payment_time';
    const order = (req.query.order || 'desc').toLowerCase() === 'desc' ? -1 : 1;

    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'status_doc'
        }
      },
      { $unwind: { path: '$status_doc', preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 0,
          custom_order_id: '$custom_order_id',
          school_name: 1,
          collect_id: '$statuses.collect_id',
          school_id: '$school_id',
          trustee_id: '$trustee_id',
          school_name: '$school_name',
          gateway: '$gateway_name',
          student_name: '$student_info.name',
          student_email: '$student_info.email',
          student_id: '$student_info.id',
          order_amount: '$status_doc.order_amount',
          transaction_amount: '$status_doc.transaction_amount',
          payment_time: '$status_doc.payment_time',
          status: '$status_doc.status',
          payment_mode: '$status_doc.payment_mode',
        }
      },
      { $sort: { [sortField]: order } },
      { $skip: skip },
      { $limit: limit }
    ];

    const results = await Order.aggregate(pipeline);
    res.json({ page, limit, data: results });
  } catch (err) {
    console.error("🚀 ~ err:", err);
    next(err);
  }
});


// GET /transactions/school/:schoolId
router.get('/school/:schoolId', auth, async (req, res, next) => {
  try {
    const schoolId = req.params.schoolId;
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, parseInt(req.query.limit || '20'));
    const sortField = req.query.sort || 'payment_time';
    const order = (req.query.order || 'desc').toLowerCase() === 'desc' ? -1 : 1;
    const skip = (page - 1) * limit;

    const matchStage = { $match: {} };
    if (/^[0-9a-fA-F]{24}$/.test(schoolId)) {
      matchStage.$match.school_id = mongoose.Types.ObjectId(schoolId);
    } else {
      matchStage.$match.school_id = schoolId;
    }

    const pipeline = [
      matchStage,
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'statuses'
        }
      },
      { $unwind: { path: '$statuses', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          collect_id: '$statuses.collect_id',
          school_id: '$school_id',
          gateway: '$gateway_name',
          order_amount: '$statuses.order_amount',
          transaction_amount: '$statuses.transaction_amount',
          status: '$statuses.status',
          custom_order_id: '$custom_order_id',
          payment_time: '$statuses.payment_time'
        }
      },
      { $sort: { [sortField]: order } },
      { $skip: skip },
      { $limit: limit }
    ];

    const results = await Order.aggregate(pipeline);
    res.json({ page, limit, data: results });
  } catch (err) { next(err); }
});

// GET /transaction-status/:custom_order_id
router.get('/status/:custom_order_id', auth, async (req, res, next) => {
  try {
    const customId = req.params.custom_order_id;
    const order = await Order.findOne({ custom_order_id: customId }).lean();
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const status = await OrderStatus.findOne({ collect_id: order._id }).lean();
    res.json({ order, status });
  } catch (err) { next(err); }
});

module.exports = router;
