const { toggleWishlistInDB, getWishlistFromDB } = require("./service.js");

async function handleToggleWishlist(req, res) {
    try {
        const { userId, productId } = req.body;
        if (!userId || !productId) {
            return res.status(400).json({ message: "userId and productId are required" });
        }

        const result = await toggleWishlistInDB({ userId, productId });
        res.json({ message: `Product ${result.status} wishlist`, status: result.status });
    } catch (err) {
        console.error("Wishlist Toggle Error:", err);
        res.status(500).json({ message: "Error toggling wishlist" });
    }
}

async function handleGetWishlist(req, res) {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const products = await getWishlistFromDB(userId);
        res.json(products);
    } catch (err) {
        console.error("Wishlist fetch error:", err);
        res.status(500).json({ message: "Error fetching wishlist" });
    }
}

module.exports = { handleToggleWishlist, handleGetWishlist };
