const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create category
async function createCategory({ name, slug, description, imageUrl }) {
    const category = await prisma.category.create({
        data: { name, slug, description, imageUrl }
    });
    return category;
}

// Get all categories
async function getAllCategories() {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: {
                    products: true
                }
            }
        },
        orderBy: {
            name: 'asc'
        }
    });
    return categories;
}

// Get category by slug
async function getCategoryBySlug(slug) {
    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            products: {
                include: {
                    reviews: {
                        select: {
                            rating: true
                        }
                    }
                }
            }
        }
    });
    return category;
}

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryBySlug
};
