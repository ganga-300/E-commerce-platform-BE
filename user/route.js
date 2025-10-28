//internal orchestrations
const express = require("express");
const {
  createUserData,
  findAllUserData,
  updateUserData,
  deleteUserData
} = require("./controller"); 

const router = express.Router();

// Create user
router.post("/", createUserData);

// Get all users
router.get("/", findAllUserData);

// Update user
router.put("/", updateUserData);

// Delete user
router.delete("/", deleteUserData);

module.exports = router;
