const { createUser, getUsers, updateUser, deleteUser, getUserById } = require("./service");

const createUserData = async (req, res) => {
    const { userName, email, password, role } = req.body;
    try {
        const user = await createUser(userName, email, password, role);
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const findAllUserData = async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUserData = async (req, res) => {
    const { id } = req.params;
    const { userName } = req.body;

    try {
        const user = await updateUser(id, userName);
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUserData = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await deleteUser(id);
        res.status(200).json({ message: "User deleted successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getProfile = async (req, res) => {
    try {
        const user = await getUserById(req.userId);
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { createUserData, findAllUserData, updateUserData, deleteUserData, getProfile };
