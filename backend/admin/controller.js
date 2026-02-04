const {
    getPlatformStats,
    getSalesData,
    getRecentOrders,
    getTopProducts,
    getAllUsers,
    getAllOrders,
    getAllProductsForAdmin,
    deleteProductAdmin,
    getPendingSellers,
    updateSellerStatus,
    globalSearchInDB,
    getUserByIdAdmin
} = require("./service");

// Get dashboard stats
async function getDashboardStats(req, res) {
    try {
        const stats = await getPlatformStats();
        const salesData = await getSalesData();
        const recentOrders = await getRecentOrders(10);
        const topProducts = await getTopProducts(5);

        res.json({
            stats,
            salesData,
            recentOrders,
            topProducts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching dashboard stats" });
    }
}

// Get all users
async function getUsers(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await getAllUsers(page, limit);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching users" });
    }
}

// Get all orders
async function getOrders(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await getAllOrders(page, limit);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching orders" });
    }
}

// Get all products
async function getProducts(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const result = await getAllProductsForAdmin(page, limit);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching products" });
    }
}

// Delete product
async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        await deleteProductAdmin(id);
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting product" });
    }
}

// Get pending sellers
async function getPendingSellersByAdmin(req, res) {
    try {
        const sellers = await getPendingSellers();
        res.json(sellers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching pending sellers" });
    }
}

// Approve seller
async function approveSeller(req, res) {
    try {
        const { id } = req.params;
        const { isApproved } = req.body;
        await updateSellerStatus(id, isApproved);
        res.json({ message: `Seller ${isApproved ? 'approved' : 'rejected'} successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating seller status" });
    }
}

// Global search
async function globalSearch(req, res) {
    try {
        const { query } = req.query;
        if (!query) return res.json({ users: [], products: [], orders: [] });
        const results = await globalSearchInDB(query);
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error performing search" });
    }
}

// Get user details
async function getUserDetails(req, res) {
    try {
        const { id } = req.params;
        const user = await getUserByIdAdmin(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching user details" });
    }
}

module.exports = {
    getDashboardStats,
    getUsers,
    getOrders,
    getProducts,
    deleteProduct,
    getPendingSellersByAdmin,
    approveSeller,
    globalSearch,
    getUserDetails
};
