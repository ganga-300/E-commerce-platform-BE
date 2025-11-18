const express = require("express");


const { validateLogin, validateSignup } = require("./middleware");
const { registerUser, loginUser } = require("./controller");

const router = express.Router();

router.post("/api/auth/register", validateSignup, registerUser);
router.post("/login", validateLogin, loginUser);

module.exports = router;