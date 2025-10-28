
const {createProductsFromDB, searchProductsInDB, getProductsFromId } = require("./service.js");

async function createProducts(req,res){
  try{

    const {name,description,price,stock,sku,family,imageUrl} = req.body
    const product = await createProductsFromDB(name,description,price,stock,sku,family,imageUrl);
    res.json(product)

  }catch(err){
      res.status(500).json({ message: "Error fetching product by ID" });
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

module.exports = { createProducts ,getSearchProducts,getIdProduct};

