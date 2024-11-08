
// models/session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  session_id: { type: String, required: true, unique: true },
  host_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  guest_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
  status: { type: String, enum: ['active', 'expired'], default: 'active' },
  created_at: { type: Date, default: Date.now },
  expires_at: { type: Date },
});

module.exports = mongoose.model('Session', sessionSchema);
