//client interaction

const { createUser, getUser, updateUser, deleteUser } = require('./service');

// Create user
const createUserData = async (req, res) => {

    try {
         const { userName, email,password ,role} = req.body;
        const user = await createUser(userName, email,password,role);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Find all users
const findAllUserData = async (req, res) => {
    try {
        const users = await getUser();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete user by email
const deleteUserData = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }
    try {
        const user = await deleteUser(email);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user by email
const updateUserData = async (req, res) => {
    const { email, name } = req.body;
    if (!email || !name) {
        return res.status(400).json({ error: "Email and Name are required." });
    }
    try {
        const user = await updateUser(name, email);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createUserData, deleteUserData, findAllUserData, updateUserData };
