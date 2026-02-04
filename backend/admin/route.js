const express = require("express");
const router = express.Router();
const {
    getDashboardStats,
    getUsers,
    getOrders,
    getProducts,
    deleteProduct,
    getPendingSellersByAdmin,
    approveSeller,
    globalSearch,
    getUserDetails
} = require("./controller");
const { verifyToken } = require("../shared/middlewares/verifyToken");
const { verifyAdmin } = require("./middleware");

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(verifyAdmin);

router.get("/stats", getDashboardStats);
router.get("/users", getUsers);
router.get("/users/:id", getUserDetails);
router.get("/orders", getOrders);
router.get("/products", getProducts);
router.delete("/products/:id", deleteProduct);

// Seller approval routes
router.get("/pending-sellers", getPendingSellersByAdmin);
router.put("/approve-seller/:id", approveSeller);
router.get("/search", globalSearch);

module.exports = router;
