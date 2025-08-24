// Prefer helpers/cloudinary; fallback to config for backward compat
let imageUploadUtil;
try {
  ({ imageUploadUtil } = require("../../helpers/cloudinary"));
} catch (e) {
  try {
    ({ imageUploadUtility: imageUploadUtil } = require("../../config/cloudinary"));
  } catch (err) {}
}
const Product = require("../../models/product");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

// Helper to coerce various truthy/falsey inputs to boolean
function toBoolean(val) {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") return val.toLowerCase() === "true";
  return false;
}

//adding a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      isFeatured,
    } = req.body;
    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      isFeatured: toBoolean(isFeatured),
    });

    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      message: "Product created",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};
//fetch all products
const fetchProducts = async (req, res) => {
  try {
    const allProductsList = await Product.find({});
    res.status(200).json({
      success: true,
      data: allProductsList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//edit a product

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      isFeatured,
    } = req.body;

    const productToBeEdited = await Product.findById(id);
    if (!productToBeEdited)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    productToBeEdited.image = image || productToBeEdited.image;
    productToBeEdited.title = title || productToBeEdited.title;
    productToBeEdited.description = description || productToBeEdited.description;
    productToBeEdited.category = category || productToBeEdited.category;
    productToBeEdited.brand = brand || productToBeEdited.brand;
    productToBeEdited.price =
      price === "" ? 0 : price || productToBeEdited.price;
    productToBeEdited.salePrice =
      salePrice === "" ? 0 : salePrice || productToBeEdited.salePrice;
    productToBeEdited.totalStock = totalStock || productToBeEdited.totalStock;
    if (typeof isFeatured !== "undefined") {
      productToBeEdited.isFeatured = toBoolean(isFeatured);
    }

    await productToBeEdited.save();
    res.status(200).json({
      success: true,
      data: productToBeEdited,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete a product
const deleteProdcut = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found ",
      });
    res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchProducts,
  editProduct,
  deleteProdcut,
};
