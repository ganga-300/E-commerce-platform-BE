const express = require("express");
const router = express.Router();

const {
  AddProduct,
  deleteProduct,
  viewUserCart,
  updateQuantity,
} = require("./controller.js");


const {
  validateAddToCart,
  validateQuantityUpdate,
} = require("./middleware");


router.post("/add",validateAddToCart, AddProduct);
router.delete("/:cartId", deleteProduct);
router.get("/user/:userId", viewUserCart);
router.put("/:cartId",validateQuantityUpdate, updateQuantity);

module.exports = router;
