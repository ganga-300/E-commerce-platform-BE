const express = require("express");
const router = express.Router();
const paymentController = require("./controller");
const { verifyToken } = require("../shared/middlewares/verifyToken");

router.post("/create-order", verifyToken, paymentController.createOrder);
router.post("/verify", verifyToken, paymentController.verifyPayment);

module.exports = router;
