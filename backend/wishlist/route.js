const express = require("express");
const router = express.Router();
const { handleToggleWishlist, handleGetWishlist } = require("./controller.js");

router.post("/toggle", handleToggleWishlist);
router.get("/:userId", handleGetWishlist);

module.exports = router;
