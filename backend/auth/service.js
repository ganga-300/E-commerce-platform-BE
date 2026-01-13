const bcrypt = require("bcryptjs");
const { createUser, findUserByEmail } = require("../user/service");
const { generateToken } = require("./helper");

const handleSignup = async ({ userName, email, password, role }) => {
  const user = await findUserByEmail(email);
  if (user) {
    const err = new Error("User exists");
    err.status = 400;
    throw err;
  }
  const normalizedRole = role ? String(role).toUpperCase() : "BUYER";
  const allowedRoles = ["BUYER", "SELLER", "ADMIN"];
  if (!allowedRoles.includes(normalizedRole)) {
    const err = new Error("Invalid role");
    err.status = 400;
    throw err;
  }
  const hashedPass = await bcrypt.hash(password, 10);
  return createUser({ userName, email, password: hashedPass, role: normalizedRole })
}

const handleLogin = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) {
    const err = new Error("User does not exist");
    err.status = 400;
    throw err;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid password");
    err.status = 400;
    throw err;
  }
  const accessToken = generateToken(user)
  return { accessToken, user }
}


module.exports = { handleSignup, handleLogin }