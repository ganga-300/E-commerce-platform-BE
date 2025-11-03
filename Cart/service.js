const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function AddProductToCart({ userId, productId, quantity }) {
    const newProduct = await prisma.cart.create({
        data: {
            userId: userId,
            productId: productId,
            quantity: quantity
        }
    })

    return newProduct
}

async function deleteProductFromCart(cartId) {
    const deletedProduct = await prisma.cart.delete({
        where: { cart_id: cartId }
    })

    return deletedProduct
}

async function updateQuantityInCart({cartId, quantity}) {
    const updatedProduct = await prisma.cart.update({
        where: { cart_id: cartId },
        data: { quantity: quantity }
    });
    return updatedProduct;
}


async function viewCartByUserId(userId) {
    const viewCart = await prisma.cart.findMany({
        where: { userId: userId },
        include: { product: true }
    });
    return viewCart;
}




module.exports = { viewCartByUserId, updateQuantityInCart, deleteProductFromCart, AddProductToCart };