// models/cart.js
const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session", // Reference to the Session model, if collaborative
    default: null, // Null indicates no collaborative session
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
});

module.exports = mongoose.model("Cart", CartSchema);
