const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function AddProductToCart(userId,productId,quantity){
    const newProduct = await prisma.cart.create({
        data : {
            userId,productId,quantity
        }
    })

    return newProduct
}

async function deleteProductFromCart(){
    const deletedProduct = await prisma.cart.delete({
       where: { cart_id: Number(cartId) }
    })

    return deletedProduct
}

async function updateQuantityInCart(cartId, quantity){
    const updatedProduct = await prisma.cart.update({
        where: { cart_id: Number(cartId) },
        data: { quantity }
    });
    return updatedProduct;
}


async function viewCartByUserId(userId){
    const viewCart = await prisma.cart.findMany({ 
        where: { userId: Number(userId) },
        include: { product: true }
    });
    return viewCart;
}




module.exports = { viewCartByUserId ,updateQuantityInCart,deleteProductFromCart,AddProductToCart};