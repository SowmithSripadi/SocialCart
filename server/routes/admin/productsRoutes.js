const express = require("express");

const {
  handleImageUpload,
  addProduct,
  fetchProducts,
  editProduct,
  deleteProdcut,
} = require("../../controllers/admin/products-controller");

const { uploads } = require("../../config/cloudinary");

const router = express.Router();

router.post("/uploadImage", uploads.single("myFile"), handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProdcut);
router.get("/get", fetchProducts);

module.exports = router;
