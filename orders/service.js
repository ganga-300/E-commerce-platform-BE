const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


async function createOrder(userId, items) {
  return await prisma.order.create({
    data: {
      userId: Number(userId),
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
    },
    include: {
      items: {
        include: { product: true },
      },
    },
  });
}


async function getOrderByUserId(userId) {
  return await prisma.order.findMany({
    where: { userId: Number(userId) },
    include: {
      items: {
        include: { product: true },
      },
    },
  });
}

module.exports = { createOrder, getOrderByUserId };
