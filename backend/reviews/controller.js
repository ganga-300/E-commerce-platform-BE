const {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    markHelpful
} = require("./service");

// Create review
async function addReview(req, res) {
    try {
        const { productId, rating, title, comment } = req.body;
        const userId = req.userId;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const review = await createReview({ productId, userId, rating, title, comment });
        res.status(201).json({ message: "Review added successfully", review });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Error adding review" });
    }
}

// Get product reviews
async function getReviews(req, res) {
    try {
        const { productId } = req.params;
        const reviews = await getProductReviews(productId);
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching reviews" });
    }
}

// Update review
async function editReview(req, res) {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { rating, title, comment } = req.body;

        const review = await updateReview(id, userId, { rating, title, comment });
        res.json({ message: "Review updated successfully", review });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Error updating review" });
    }
}

// Delete review
async function removeReview(req, res) {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const result = await deleteReview(id, userId);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || "Error deleting review" });
    }
}

// Mark review as helpful
async function markReviewHelpful(req, res) {
    try {
        const { id } = req.params;
        const review = await markHelpful(id);
        res.json({ message: "Marked as helpful", review });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error marking review as helpful" });
    }
}

module.exports = {
    addReview,
    getReviews,
    editReview,
    removeReview,
    markReviewHelpful
};
