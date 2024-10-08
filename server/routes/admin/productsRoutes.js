const express = require("express");

const {
  handleImageUpload,
} = require("../../controllers/admin/products-controller");

const { uploads } = require("../../config/cloudinary");

const router = express.Router();

router.post(
  "/uploadImage",
  (req, res, next) => {
    console.log("POST request received at /uploadImage");
    next(); // Pass control to multer for file handling
  },
  uploads.single("myFile"),
  (req, res) => {
    console.log("File upload processed by multer.");
    handleImageUpload(req, res); // Call the actual handler after multer processes the file
  }
);

module.exports = router;
