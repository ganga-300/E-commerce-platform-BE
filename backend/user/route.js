const express = require("express");
const router = express.Router();

const {
    createUserData,
    findAllUserData,
    updateUserData,
    deleteUserData,
    getProfile
} = require("./controller");

const {
    validateUser,
    validateUpdateUser
} = require("./middleware");

router.post("/", validateUser, createUserData);

router.get("/", findAllUserData);

router.put("/:id", validateUpdateUser, updateUserData);

router.delete("/:id", deleteUserData);

router.get("/profile", getProfile);

module.exports = router;
