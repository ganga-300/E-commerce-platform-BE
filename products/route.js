const express = require('express');
const router = express.Router();
const { getAllProducts } = require("./controller.js");
const {getSearchProducts} = require('./controller.js')
const {getIdProduct} = require('./controller.js')
const { validateProductId, validateSearchQuery } = require("./middleware.js");

router.get("/:id", validateProductId, getIdProduct);
router.get('/',getAllProducts);
router.get("/search",getSearchProducts,validateSearchQuery);



module.exports = router