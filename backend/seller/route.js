const express = require('express');
const router = express.Router();
const { getSellerAnalytics } = require('./controller');
const { verifyToken } = require('../shared/middlewares/verifyToken');
const { verifySellerApproval } = require('../products/middleware');

router.get('/analytics', verifyToken, verifySellerApproval, getSellerAnalytics);

module.exports = router;
