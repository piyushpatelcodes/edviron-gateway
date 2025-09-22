const mongoose = require('mongoose');
const { Schema } = mongoose;

const WebhookLogSchema = new Schema({
  payload: { type: Object },
  receivedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WebhookLog', WebhookLogSchema);
