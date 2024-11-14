const express = require("express");

const {
  addToCart,
  fetchCartItems,
  updateCartItems,
  deleteCartItems,
} = require("../../controllers/shop/cart-controller");

const router = express.Router();

router.post("/add", addToCart);
router.get("/get/user/:userId", fetchCartItems);
router.get("/get/session/:sessionId", fetchCartItems);
router.put("/update-cart", updateCartItems);
router.delete("/:userId/:productId", deleteCartItems);
router.delete("/session/:sessionId/:productId", deleteCartItems);

module.exports = router;
