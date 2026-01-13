const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createProductsFromDB({name,description,price,stock,sku,family,imageUrl}) {
  const product = await prisma.product.create({
    data : {name,description,price,stock,sku,family,imageUrl}
  })
  return product
}

async function getProductsFromDB() {
  const products = await prisma.product.findMany();
  return products;
}


async function getProductsFromId(id){
    const product = await prisma.product.findUnique({
        where: {id:id}
    });
        return product
    
}


async function searchProductsInDB(searchTerm) {
  const results = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm } },
        { description: { contains: searchTerm } }
      ]
    }
  });
  return results;
}



module.exports = { createProductsFromDB,getProductsFromDB ,getProductsFromId,searchProductsInDB};

