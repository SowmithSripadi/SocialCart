const product = require("../../models/product");
const Product = require("../../models/product");

const getFilteredProducts = async (req, res) => {
  try {
    // Support both lowercase (new) and uppercase (legacy) query keys
    const categoryParam = req.query.category || req.query.Category || "";
    const brandParam = req.query.brand || req.query.Brand || "";
    const { sortBy = "price-lowtohigh" } = req.query;
    const featuredParam = req.query.featured;
    const limitParam = req.query.limit ? parseInt(req.query.limit, 10) : null;
    let filters = {};

    // Set up category filter if category is provided
    if (categoryParam && categoryParam.length) {
      filters.category = { $in: String(categoryParam).split(",") };
    }

    // Set up brand filter if brand is provided
    if (brandParam && brandParam.length) {
      filters.brand = { $in: String(brandParam).split(",") };
    }

    // Featured filter
    if (typeof featuredParam !== "undefined" && featuredParam !== "") {
      const isFeatured = String(featuredParam).toLowerCase() === "true";
      filters.isFeatured = isFeatured;
    }

    // Sorting logic based on sortBy parameter
    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
        break;
    }

    // Fetch products from database based on filters and sort order
    let query = Product.find(filters).sort(sort);
    if (Number.isInteger(limitParam) && limitParam > 0) {
      query = query.limit(limitParam);
    }
    const products = await query;

    // Send response with product data
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "product not found!",
      });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
