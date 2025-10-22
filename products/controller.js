const { Prisma } = require("@prisma/client");
const { getProductsFromDB, searchProductsInDB, getProductsFromId } = require("./service.js");

async function getAllProducts(req, res) {
  try {
    const products = await getProductsFromDB();
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}


async function getIdProduct(req, res) {
  try {
    const { id } = req.params;
    console.log("Product ID:", id);

    const product = await getProductsFromId(Number(id)); 
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching product by ID" });
  }
}


async function getSearchProducts(req, res) {
  try {
    const searchTerm = req.query.query;
    console.log("Search term:", searchTerm);

    const results = await searchProductsInDB(searchTerm);
    res.json(results);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error searching products" });
  }
}

module.exports = { getAllProducts ,getSearchProducts,getIdProduct};