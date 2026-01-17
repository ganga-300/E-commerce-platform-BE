const express = require("express");
const router = express.Router();
const { addCategory, getCategories, getCategory } = require("./controller");
const { verifyToken } = require("../shared/middlewares/verifyToken");
const { verifyAdmin } = require("../admin/middleware");

// Public routes
router.get("/", getCategories);
router.get("/:slug", getCategory);

// Admin only
router.post("/", verifyToken, verifyAdmin, addCategory);

module.exports = router;
