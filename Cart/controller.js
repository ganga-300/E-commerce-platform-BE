const { Prisma } = require("@prisma/client");
const {viewCartbyUserId,updateQuantityInCart,deleteProductFromCart,AddProductToCart} = require('./service.js');
const { use } = require("react");


async function AddProduct(req,res){
    const {userId,productId,quantity} = req.body
    try{
        const newProduct = await AddProductToCart(userId,productId,quantity)
        res.status(201).json(newProduct);

    } catch(error){
        console.log(error)
        res.status(500).json({ message: "Failed to add product to cart" });
    }

}

async function deleteProduct(req,res){
    const {cartId} = req.params
    try{
        const deleted = await deleteProductFromCart(cartId)
        res.json(deleted);

    } catch(error){
        console.log(error)
        res.status(500).json({ message: "Failed to delete product from cart" });
    }
}

async function viewUserCart(req,res){
    const {userId} = req.params
    try{
        const userCart = viewCartbyUserId(userId);
        res.json(userCart);

    } catch(error){
        console.log(error)
         res.status(500).json({ message: "Failed to fetch user cart" });
    }
}


async function updateQuantity(req,res){
    const {cartId} = req.params
    const {quantity} = req.body
    try{

        const updated = updateQuantityInCart(cartId,quantity);
        res.json(updated);


    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Failed to update quantity" });
    }
}

module.exports = { updateQuantity ,viewUserCart,deleteProduct,AddProduct};

// cart_id → identifies a specific row/item in the cart
// userId → identifies all items in that user’s cart