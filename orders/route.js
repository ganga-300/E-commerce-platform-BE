const express = require("express");
const router = express.Router();
const { createNewOrder, getUserOrders } = require("../controllers/orderController");


router.post("/", createNewOrder);
router.get("/:userId", getUserOrders);

module.exports = router;
