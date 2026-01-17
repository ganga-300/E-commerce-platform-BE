const { createCategory, getAllCategories, getCategoryBySlug } = require("./service");

// Create category (admin only)
async function addCategory(req, res) {
    try {
        const { name, slug, description, imageUrl } = req.body;
        const category = await createCategory({ name, slug, description, imageUrl });
        res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error creating category",
            error: error.message,
            stack: error.stack,
            code: error.code
        });
    }
}

// Get all categories
async function getCategories(req, res) {
    try {
        const categories = await getAllCategories();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching categories",
            error: error.message,
            stack: error.stack,
            code: error.code
        });
    }
}

// Get category by slug
async function getCategory(req, res) {
    try {
        const { slug } = req.params;
        const category = await getCategoryBySlug(slug);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching category",
            error: error.message,
            stack: error.stack,
            code: error.code
        });
    }
}

module.exports = {
    addCategory,
    getCategories,
    getCategory
};
