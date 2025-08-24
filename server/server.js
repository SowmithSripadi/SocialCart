// server.js
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/productsRoutes");
const shopProductsRouter = require("./routes/shop/products-routes");
const cartRouter = require("./routes/shop/cart-routes");
const ordersRouter = require("./routes/shop/orders-routes");
const addressRouter = require("./routes/shop/address-routes");
const reviewRouter = require("./routes/shop/review-routes");
const searchRouter = require("./routes/shop/search-routes");
const adminOrdersRouter = require("./routes/admin/ordersRoutes");
const featureRouter = require("./routes/common/feature-routes");
const sessionRouter = require("./routes/session/sessionRoutes");

// Import the Socket.IO handler
const socketHandler = require("./socketHandler");

const PORT = process.env.PORT || 8000;
const mongoURL =
  process.env.MONGODB_CONNECTION_URL || process.env.MONGODB_URI || "";
const FRONTEND_HOST = process.env.FRONTEND_HOST;
const FRONTEND_HOSTS = process.env.FRONTEND_HOSTS;
const allowedOrigins = (FRONTEND_HOSTS || FRONTEND_HOST || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// MongoDB Connection
if (!mongoURL) {
  console.error(
    "Missing MongoDB connection string. Set MONGODB_CONNECTION_URL in server/.env"
  );
  process.exit(1);
}

mongoose
  .connect(mongoURL)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => {
    console.log(error);
  });

const app = express();
const server = http.createServer(app); // Create HTTP server

// Initialize Socket.IO using the server instance
socketHandler.init(server);

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Use your routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", cartRouter);
app.use("/api/shop/orders", ordersRouter);
app.use("/api/shop/address", addressRouter);
app.use("/api/shop/reviews", reviewRouter);
app.use("/api/shop/search", searchRouter);
app.use("/api/admin/orders", adminOrdersRouter);
app.use("/api/common/feature", featureRouter);
app.use("/api/session", sessionRouter);

server.listen(PORT, () => console.log(`Server started - ${PORT}`));
