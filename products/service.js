const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getProductsFromDB() {
  const products = await prisma.products.findMany();
  return products;
}


async function getProductsFromId(id){
    const product = await prisma.products.findUnique({
        where: {id:id}
    });
        return product
    
}


async function searchProductsInDB(searchTerm) {
  const results = await prisma.products.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } }
      ]
    }
  });
  return results;
}



module.exports = { getProductsFromDB ,getProductsFromId,searchProductsInDB};

