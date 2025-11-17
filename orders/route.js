const express = require("express");
const router = express.Router();
const { placeUserOrder, getUserOrders } = require("./controller.js");


router.post("/place/:userId", placeUserOrder);
router.get("/user/:userId", getUserOrders);

module.exports = router;
