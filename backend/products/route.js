const express = require('express');
const router = express.Router();
const { createProducts, getSearchProducts, getIdProduct, getAllProducts, updateProduct, deleteProduct } = require('./controller.js')
const { validateProductId, validateSearchQuery, verifySellerApproval } = require("./middleware.js");
const { verifyToken } = require("../shared/middlewares/verifyToken");
router.post('/', verifyToken, verifySellerApproval, createProducts)
router.get("/", getAllProducts);
router.get("/search", validateSearchQuery, getSearchProducts);
router.get("/:id", validateProductId, getIdProduct);
router.put("/:id", verifyToken, verifySellerApproval, validateProductId, updateProduct);
router.delete("/:id", verifyToken, verifySellerApproval, validateProductId, deleteProduct);

module.exports = router



