const { getUserById } = require("../user/service");

function validateProductId(req, res, next) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
  next();
}

function validateSearchQuery(req, res, next) {
  const { query } = req.query;
  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Search query is required" });
  }
  next();
}

async function verifySellerApproval(req, res, next) {
  try {
    const user = await getUserById(req.userId);
    if (!user || (user.role === "SELLER" && !user.isApproved)) {
      return res.status(403).json({
        message: "Your seller account is pending approval. You cannot manage products yet."
      });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Error checking seller approval status" });
  }
}

module.exports = { validateProductId, validateSearchQuery, verifySellerApproval };


