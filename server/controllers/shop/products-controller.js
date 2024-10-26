const Product = require("../../models/product");

const getFilteredProducts = async (req, res) => {
  try {
    const { Category = "", Brand = "", sortBy = "price-lowtohigh" } = req.query;
    let filters = {};

    // Set up category filter if category is provided
    if (Category.length) {
      filters.category = { $in: Category.split(",") };
    }

    // Set up brand filter if brand is provided
    if (Brand.length) {
      filters.brand = { $in: Brand.split(",") };
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
    const products = await Product.find(filters).sort(sort);

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

module.exports = { getFilteredProducts };
