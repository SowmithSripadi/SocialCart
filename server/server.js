import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
const PORT = process.env.PORT || 8000;

mongoose
  .connect(
    "mongodb+srv://sripadisowmith067:Mzlapq%40321@cluster0.gdo3j.mongodb.net/"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => {
    console.log(error);
  });

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5175/",
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

app.listen(PORT, () => console.log(`Server started - ${PORT}`));
