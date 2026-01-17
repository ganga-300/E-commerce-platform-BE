const express = require("express");
const router = express.Router();
const { addReview, getReviews, editReview, removeReview, markReviewHelpful } = require("./controller");
const { verifyToken } = require("../shared/middlewares/verifyToken");

// Get reviews for a product (public)
router.get("/product/:productId", getReviews);

// Protected routes (require authentication)
router.post("/", verifyToken, addReview);
router.put("/:id", verifyToken, editReview);
router.delete("/:id", verifyToken, removeReview);
router.post("/:id/helpful", markReviewHelpful);

module.exports = router;
