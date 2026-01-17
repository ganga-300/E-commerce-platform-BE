const { createUser, getUser: getUsers, updateUser, deleteUser, getUserById, addAddress, getAddresses, deleteAddress } = require("./service");

const addUserAddress = async (req, res) => {
    try {
        const address = await addAddress(req.userId, req.body);
        res.status(201).json(address);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserAddresses = async (req, res) => {
    try {
        const addresses = await getAddresses(req.userId);
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeUserAddress = async (req, res) => {
    try {
        await deleteAddress(req.userId, req.params.id);
        res.json({ message: "Address deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUserData = async (req, res) => {
    const { userName, email, password, role } = req.body;
    console.log(req.body, "this is body");
    try {
        const user = await createUser({ userName, email, password, role });
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


module.exports = { createUserData, findAllUserData, updateUserData, deleteUserData, getProfile, addUserAddress, getUserAddresses, removeUserAddress };
