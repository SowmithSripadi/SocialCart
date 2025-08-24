const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    title: String,
    image: String,
    price: Number,
    salePrice: Number,
    quantity: Number,
  },
  { _id: false }
);

const AddressSchema = new mongoose.Schema(
  {
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: "Session", default: null },
    items: [OrderItemSchema],
    address: AddressSchema,
    subtotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: { type: String, default: "placed" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);


