const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

const userRouter = require("./user/route");
const authRouter = require("./auth/route");
const { verifyToken } = require("./shared/middlewares/verifyToken");
const productRouter = require("./products/route");
const ordersRouter = require("./orders/route");
const wishlistRouter = require("./wishlist/route");
const adminRouter = require("./admin/route");
const reviewsRouter = require("./reviews/route");
const categoriesRouter = require("./categories/route");
const paymentRouter = require("./payment/route");

const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

app.use("/api/users", verifyToken, userRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/admin", adminRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/seller", require("./seller/route"));

// 404 Handler
app.use((req, res) => {
  console.log(`404 NOT FOUND: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {}
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

