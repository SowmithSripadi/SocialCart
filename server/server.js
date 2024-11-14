// server.js
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Import routes
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/productsRoutes");
const shopProductsRouter = require("./routes/shop/products-routes");
const cartRouter = require("./routes/shop/cart-routes");
const sessionRouter = require("./routes/session/sessionRoutes");

// Import the Socket.IO handler
const socketHandler = require("./socketHandler");

const PORT = process.env.PORT || 8000;

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://sripadisowmith067:Mzlapq%40321@cluster0.gdo3j.mongodb.net/"
  )
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
    origin: "http://localhost:5173",
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
app.use("/api/session", sessionRouter);

server.listen(PORT, () => console.log(`Server started - ${PORT}`));
