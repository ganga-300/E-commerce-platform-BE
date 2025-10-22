
function validateProductId(req, res, next) {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
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

module.exports = { validateProductId, validateSearchQuery };


