const bcrypt = require("bcryptjs");
const { createUser, findUserByEmail } = require("../user/service");
const { generateToken } = require("./helper");

const handleSignup = async ({ userName, email, password, role }) => {
  const user = await findUserByEmail(email);
  if (user) {
    throw new Error({ status: 400, message: "User exists" });
  }
  const hashedPass = await bcrypt.hash(password, 10);
  return createUser({ userName, email, password: hashedPass, role })
}

const handleLogin = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error({ status: 400, message: "User does not exists" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error({ status: 400, message: "Invalid password" });
  }
  const accesToken = generateToken(user)
  return { accesToken, user }
}


module.exports = { handleSignup, handleLogin }