const { createProductsFromDB, searchProductsInDB, getProductsFromId, getProductsFromDB, updateProductInDB, deleteProductInDB } = require("./service.js");

async function createProducts(req, res) {
  try {

    const { name, description, price, stock, sku, family, imageUrl } = req.body
    const sellerId = req.userId; // Extracted from verifyToken middleware
    const product = await createProductsFromDB({ name, description, price, stock, sku, family, imageUrl, sellerId });
    res.json(product)

  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
      stack: error.stack,
      code: error.code
    });
  }
}


async function getAllProducts(req, res) {
  try {
    const filters = {
      category: req.query.category,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      minRating: req.query.minRating,
      sort: req.query.sort,
      sellerId: req.query.sellerId // Support filtering by seller
    };

    const products = await getProductsFromDB(filters);
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
      stack: error.stack,
      code: error.code
    });
  }
}

async function getIdProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await getProductsFromId(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product by ID",
      error: error.message,
      stack: error.stack,
      code: error.code
    });
  }
}

async function getSearchProducts(req, res) {
  try {
    const searchTerm = req.query.query;
    console.log("Search term:", searchTerm);

    const results = await searchProductsInDB(searchTerm);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error searching products",
      error: error.message,
      stack: error.stack,
      code: error.code
    });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await updateProductInDB(id, updateData);
    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
      stack: error.stack,
      code: error.code
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    await deleteProductInDB(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
      stack: error.stack,
      code: error.code
    });
  }
}

module.exports = {
  createProducts,
  getSearchProducts,
  getIdProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
};

