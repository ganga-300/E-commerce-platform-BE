const { getAnalyticsFromDB } = require('./service');

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

module.exports = { getSellerAnalytics };
