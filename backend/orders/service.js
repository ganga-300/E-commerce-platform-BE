const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


async function placeOrder(userId, items) {
  let orderItemsData = [];

  if (items && items.length > 0) {
    // If items are sent directly from frontend (simpler for interview)
    const order = await prisma.order.create({ data: { userId, status: "Pending" } });
    orderItemsData = items.map(item => ({
      orderId: order.id,
      productId: item.id || item.productId,
      quantity: item.qty || item.quantity,
      price: item.price,
    }));
    await prisma.orderItem.createMany({ data: orderItemsData });
    return order;
  } else {
    // Existing logic for DB-level cart items
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) throw new Error("Cart is empty");

    const order = await prisma.order.create({ data: { userId, status: "Pending" } });
    orderItemsData = cartItems.map(item => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    await prisma.orderItem.createMany({ data: orderItemsData });
    await prisma.cart.deleteMany({ where: { userId } });
    return order;
  }
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
  // AddProductToCart,
  // viewCartByUserId,
  // updateQuantityInCart,
  // deleteProductFromCart,
  placeOrder,
  viewOrdersByUserId,
};




