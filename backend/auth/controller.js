const {
  handleSignup,
  handleLogin,
} = require("./service");



const registerUser = async (req, res) => {
  const { userName, email, password, role, phoneNumber, profilePicture } = req.body;

  try {
    const user = await handleSignup({ userName, email, password, role, phoneNumber, profilePicture })
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        role: user.role
      },
    });
  } catch (error) {
    console.log(error);
    if (error.status) {
      return res.status(error.status).json({ message: error.message })
    }
    return res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { accessToken, user } = await handleLogin({ email, password })
    console.log("BACKEND LOGIN SUCCESS - User Role:", user.role);

    return res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        role: user.role
      },
    });
  } catch (error) {
    console.log(error)
    if (error.status) {
      return res.status(error.status).json({ message: error.message })
    }
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser }