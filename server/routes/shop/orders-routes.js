const express = require("express");
const { createOrder, listOrders, getOrderDetails, capturePayment } = require("../../controllers/shop/orders-controller");

const router = express.Router();

router.post("/create", createOrder);
router.get("/list/:userId", listOrders);
router.get("/details/:id", getOrderDetails);
router.post("/capture", capturePayment);

// router.post("/create", createOrder);
// router.post("/capture", capturePayment);
// router.get("/list/:userId", getAllOrdersByUser);
// router.get("/details/:id", getOrderDetails);

module.exports = router;


