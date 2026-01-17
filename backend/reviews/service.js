const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a review
async function createReview({ productId, userId, rating, title, comment }) {
    // Check if user already reviewed this product
    const existing = await prisma.review.findUnique({
        where: {
            productId_userId: {
                productId,
                userId
            }
        }
    });

    if (existing) {
        throw new Error("You have already reviewed this product");
    }

    const review = await prisma.review.create({
        data: {
            productId,
            userId,
            rating,
            title,
            comment
        },
        include: {
            user: {
                select: {
                    userName: true,
                    profilePicture: true
                }
            }
        }
    });

    // Update product average rating
    await updateProductRating(productId);

    return review;
}

// Get reviews for a product
async function getProductReviews(productId) {
    const reviews = await prisma.review.findMany({
        where: { productId },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            user: {
                select: {
                    userName: true,
                    profilePicture: true
                }
            }
        }
    });

    return reviews;
}

// Update a review
async function updateReview(reviewId, userId, { rating, title, comment }) {
    // Verify ownership
    const review = await prisma.review.findUnique({
        where: { id: reviewId }
    });

    if (!review || review.userId !== userId) {
        throw new Error("Review not found or unauthorized");
    }

    const updated = await prisma.review.update({
        where: { id: reviewId },
        data: { rating, title, comment },
        include: {
            user: {
                select: {
                    userName: true,
                    profilePicture: true
                }
            }
        }
    });

    // Update product average rating
    await updateProductRating(review.productId);

    return updated;
}

// Delete a review
async function deleteReview(reviewId, userId) {
    // Verify ownership
    const review = await prisma.review.findUnique({
        where: { id: reviewId }
    });

    if (!review || review.userId !== userId) {
        throw new Error("Review not found or unauthorized");
    }

    await prisma.review.delete({
        where: { id: reviewId }
    });

    // Update product average rating
    await updateProductRating(review.productId);

    return { message: "Review deleted successfully" };
}

// Mark review as helpful
async function markHelpful(reviewId) {
    const review = await prisma.review.update({
        where: { id: reviewId },
        data: {
            helpful: {
                increment: 1
            }
        }
    });

    return review;
}

// Update product average rating and count
async function updateProductRating(productId) {
    const reviews = await prisma.review.findMany({
        where: { productId },
        select: { rating: true }
    });

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await prisma.product.update({
        where: { id: productId },
        data: {
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
            reviewCount: reviews.length
        }
    });
}

module.exports = {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    markHelpful
};
