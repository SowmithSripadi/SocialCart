const express = require("express");

const {
  addToCart,
  fetchCartItems,
  updateCartItems,
  deleteCartItems,
} = require("../../controllers/shop/cart-controller");

const router = express.Router();

router.get("/add", addToCart);
router.get("/get/:userId", fetchCartItems);
router.put("/udpate-cart", updateCartItems);
router.delete("/:userId/:productId", deleteCartItems);

module.exports = router;
