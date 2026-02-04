const { getAnalyticsFromDB, getSellerOrdersFromDB, updateOrderStatusBySeller } = require('./service');

async function getSellerAnalytics(req, res) {
    try {
        const analytics = await getAnalyticsFromDB(req.userId);
        res.json(analytics);
    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({
            message: "Error fetching analytics",
            error: error.message
        });
    }
}

async function getSellerOrders(req, res) {
    try {
        const orders = await getSellerOrdersFromDB(req.userId);
        res.json(orders);
    } catch (error) {
        console.error("Seller Orders Error:", error);
        res.status(500).json({
            message: "Error fetching seller orders",
            error: error.message
        });
    }
}

async function updateOrderStatus(req, res) {
    try {
        const { orderId } = req.params;
        const { status, notes } = req.body;
        const result = await updateOrderStatusBySeller(orderId, req.userId, status, notes);
        res.json({ message: "Order status updated successfully", result });
    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(error.message.includes("unauthorized") ? 403 : 500).json({
            message: "Error updating order status",
            error: error.message
        });
    }
}

module.exports = { getSellerAnalytics, getSellerOrders, updateOrderStatus };
