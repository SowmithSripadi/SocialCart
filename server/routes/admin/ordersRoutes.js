const express = require("express");
const { getAllOrdersOfAllUsers, getOrderDetailsForAdmin, updateOrderStatus } = require("../../controllers/admin/orders-controller");

const router = express.Router();

router.get("/get", getAllOrdersOfAllUsers);
router.get("/get/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);

module.exports = router;


