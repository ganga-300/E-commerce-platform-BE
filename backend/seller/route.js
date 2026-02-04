const express = require('express');
const router = express.Router();
const { getSellerAnalytics, getSellerOrders, updateOrderStatus } = require('./controller');
const { verifyToken } = require('../shared/middlewares/verifyToken');
const { verifySellerApproval } = require('../products/middleware');

router.get('/analytics', verifyToken, verifySellerApproval, getSellerAnalytics);
router.get('/orders', verifyToken, verifySellerApproval, getSellerOrders);
router.put('/orders/:orderId/status', verifyToken, verifySellerApproval, updateOrderStatus);

module.exports = router;
