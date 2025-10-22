const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


async function placeOrder(userId) {
  const cartItems = await prisma.cart.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) throw new Error("Cart is empty");


  const order = await prisma.order.create({ data: { userId, status: "Pending" } });
    const orderItemsData = cartItems.map(item => ({
    orderId: order.id,
    productId: item.productId,
    quantity: item.quantity,
    price: item.product.price,
  }));

  await prisma.orderItem.createMany({ data: orderItemsData });
  await prisma.cart.deleteMany({ where: { userId } });
  return order;
}


async function viewOrdersByUserId(userId) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          product: {
            select: { id: true, name: true, price: true, imageUrl: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

module.exports = {
  AddProductToCart,
  viewCartByUserId,
  updateQuantityInCart,
  deleteProductFromCart,
  placeOrder,
  viewOrdersByUserId,
};




