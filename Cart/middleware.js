
function validateAddToCart(req, res, next) {
  const { userId, productId, quantity } = req.body;
  if (!userId || !productId) {
    return res.status(400).json({
      message: "userId and productId are required",
    });
  }

  if (quantity && (isNaN(quantity) || quantity < 1)) {
    return res.status(400).json({
      message: "Quantity must be a positive number",
    });
  }

  next();
}

function validateQuantityUpdate(req, res, next) {
  const { quantity } = req.body;
  if (!quantity || isNaN(quantity) || quantity < 1) {
    return res.status(400).json({
      message: "Please provide a valid quantity",
    });
  }
  next();
}

module.exports = {
  validateAddToCart,
  validateQuantityUpdate,
};
