const validateUser = (req, res, next) => {
    const { userName, email, password, role } = req.body;

    if (!userName || !email || !password || !role) {
        return res.status(400).json({ error: "All fields are required: userName, email, password, role" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const allowedRoles = ["Admin", "Buyer", "Seller"];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role value" });
    }

    next();
};

const validateUpdateUser = (req, res, next) => {
    const { userName } = req.body;
    if (!userName) {
        return res.status(400).json({ error: "userName is required" });
    }
    next();
};

module.exports = { validateUser, validateUpdateUser };
