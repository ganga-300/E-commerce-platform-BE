const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


async function placeOrder(userId, items, shippingDetails = {}, paymentDetails = {}) {
  let orderItemsData = [];
  const { address, city, state, zip, phone } = shippingDetails;
  const { razorpayOrderId, razorpayPaymentId } = paymentDetails;

  if (items && items.length > 0) {
    const total = items.reduce((sum, item) => sum + (item.price * (item.qty || item.quantity)), 0);
    const order = await prisma.order.create({
      data: {
        userId,
        status: "Paid", // Marking as Paid since this is called after verification
        shippingAddress: address,
        city,
        state,
        zip,
        phoneNumber: phone,
        totalAmount: total,
        razorpayOrderId,
        razorpayPaymentId
      }
    });
    orderItemsData = items.map(item => ({
      orderId: order.id,
      productId: item.id || item.productId,
      quantity: item.qty || item.quantity,
      price: item.price,
    }));
    await prisma.orderItem.createMany({ data: orderItemsData });

    // Decrease stock
    for (const item of orderItemsData) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    return order;
  } else {
    // Existing logic for DB-level cart items
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) throw new Error("Cart is empty");

    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    const order = await prisma.order.create({
      data: {
        userId,
        status: "Pending",
        shippingAddress: address,
        city,
        state,
        zip,
        phoneNumber: phone,
        totalAmount: total
      }
    });
    orderItemsData = cartItems.map(item => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    await prisma.orderItem.createMany({ data: orderItemsData });

    // Decrease stock
    for (const item of orderItemsData) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

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




