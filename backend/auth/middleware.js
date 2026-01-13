const validateSignup = (req, res, next) => {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
        return res.status(400).json({ message: "userName, email and password are required" });
    }
    next();
}

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "email and password are required" });
    }
    next();
}

module.exports = { validateLogin, validateSignup }