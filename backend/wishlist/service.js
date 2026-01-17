const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function toggleWishlistInDB({ userId, productId }) {
    // Check if item exists in wishlist
    const existing = await prisma.wishlist.findUnique({
        where: {
            userId_productId: {
                userId,
                productId
            }
        }
    });

    if (existing) {
        // Remove it
        await prisma.wishlist.delete({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        });
        return { status: "removed" };
    } else {
        // Add it
        await prisma.wishlist.create({
            data: {
                userId,
                productId
            }
        });
        return { status: "added" };
    }
}

async function getWishlistFromDB(userId) {
    const wishlistItems = await prisma.wishlist.findMany({
        where: { userId },
        include: {
            product: true
        }
    });
    // Flatten the response to return an array of products
    return wishlistItems.map(item => item.product);
}

module.exports = { toggleWishlistInDB, getWishlistFromDB };
