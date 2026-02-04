const express = require("express");
const router = express.Router();
const { placeUserOrder, getUserOrders, getOrder } = require("./controller.js");


router.post("/place/:userId", placeUserOrder);
router.get("/user/:userId", getUserOrders);
router.get("/:id", getOrder);

module.exports = router;
