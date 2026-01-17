const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createProductsFromDB({ name, description, price, stock, sku, family, imageUrl, sellerId }) {
  const product = await prisma.product.create({
    data: { name, description, price, stock, sku, family, imageUrl, sellerId }
  })
  return product
}

async function getProductsFromDB(filters = {}) {
  const { category, minPrice, maxPrice, minRating, sort, sellerId } = filters;

  const where = {};

  // Seller filter
  if (sellerId) {
    where.sellerId = sellerId;
  }

  // Category filter
  if (category) {
    where.categoryId = category;
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = parseFloat(minPrice);
    if (maxPrice !== undefined) where.price.lte = parseFloat(maxPrice);
  }

  // Rating filter
  if (minRating) {
    where.averageRating = { gte: parseFloat(minRating) };
  }

  // Sorting
  let orderBy = { createdAt: 'desc' }; // Default: newest first
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };
  if (sort === 'rating') orderBy = { averageRating: 'desc' };
  if (sort === 'popular') orderBy = { reviewCount: 'desc' };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: {
        select: {
          name: true,
          slug: true
        }
      },
      _count: {
        select: {
          reviews: true
        }
      }
    }
  });

  return products;
}


async function getProductsFromId(id) {
  const product = await prisma.product.findUnique({
    where: { id: id }
  });
  return product

}


async function searchProductsInDB(searchTerm) {
  const results = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } }
      ]
    }
  });
  return results;
}

async function updateProductInDB(id, updateData) {
  const product = await prisma.product.update({
    where: { id },
    data: updateData
  });
  return product;
}

async function deleteProductInDB(id) {
  const product = await prisma.product.delete({
    where: { id }
  });
  return product;
}

module.exports = {
  createProductsFromDB,
  getProductsFromDB,
  getProductsFromId,
  searchProductsInDB,
  updateProductInDB,
  deleteProductInDB
};

