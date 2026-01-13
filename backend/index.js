const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const userRouter = require("./user/route");
const authRouter = require("./auth/route");
const { verifyToken } = require("./shared/middlewares/verifyToken");
const productRouter = require("./products/route");
const ordersRouter = require("./orders/route");

const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

app.use("/api/users", verifyToken, userRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", ordersRouter);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

