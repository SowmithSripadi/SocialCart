const Order = require("../../models/order");
const Product = require("../../models/product");
const ProductReview = require("../../models/review");

const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } = req.body;

    const order = await Order.findOne({ userId, "items.productId": productId });
    if (!order) {
      return res.status(403).json({ success: false, message: "You need to purchase product to review it." });
    }

    const existing = await ProductReview.findOne({ productId, userId });
    if (existing) {
      return res.status(400).json({ success: false, message: "You already reviewed this product!" });
    }

    const newReview = new ProductReview({ productId, userId, userName, reviewMessage, reviewValue });
    await newReview.save();

    const reviews = await ProductReview.find({ productId });
    const total = reviews.length;
    const averageReview = reviews.reduce((sum, r) => sum + r.reviewValue, 0) / total;
    await Product.findByIdAndUpdate(productId, { averageReview });

    res.status(201).json({ success: true, data: newReview });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await ProductReview.find({ productId });
    res.status(200).json({ success: true, data: reviews });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = { addProductReview, getProductReviews };


