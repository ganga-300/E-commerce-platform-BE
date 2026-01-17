const express = require("express");
const router = express.Router();

const {
    createUserData,
    findAllUserData,
    updateUserData,
    deleteUserData,
    getProfile,
    addUserAddress,
    getUserAddresses,
    removeUserAddress
} = require("./controller");

const {
    validateUser,
    validateUpdateUser
} = require("./middleware");
const { verifyToken } = require("../shared/middlewares/verifyToken");

router.post("/", validateUser, createUserData);

router.get("/", findAllUserData);

router.put("/:id", validateUpdateUser, updateUserData);

router.delete("/:id", deleteUserData);

router.get("/profile", verifyToken, getProfile);
router.post("/address", verifyToken, addUserAddress);
router.get("/address", verifyToken, getUserAddresses);
router.delete("/address/:id", verifyToken, removeUserAddress);

module.exports = router;
