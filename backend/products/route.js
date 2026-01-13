const express = require('express');
const router = express.Router();
const { createProducts } = require('./controller.js')
const { getSearchProducts } = require('./controller.js')
const { getIdProduct } = require('./controller.js')
const { getAllProducts } = require('./controller.js')
const { validateProductId, validateSearchQuery } = require("./middleware.js");
const { verifyToken } = require("../shared/middlewares/verifyToken");
router.post('/', verifyToken, createProducts)
router.get("/", getAllProducts);
router.get("/search", validateSearchQuery, getSearchProducts);
router.get("/:id", validateProductId, getIdProduct);





module.exports = router



