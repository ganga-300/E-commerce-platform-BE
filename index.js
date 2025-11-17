const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const userRouter = require("./user/route");
const authRouter = require("./auth/route");
const { verifyToken } = require("./shared/middlewares/verifyToken");

const PORT = process.env.PORT || 8000;

app.use("/api/users", verifyToken, userRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

