const Cart = require("../../models/cart");
const Session = require("../../models/session");
const Product = require("../../models/product");
const { getIO } = require("../../socketHandler");

// Add or Update Item in Cart
const addToCart = async (req, res) => {
  let { sessionId, userId, productId, quantity } = req.body;

  if ((!userId && !sessionId) || !productId || quantity <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid data provided!" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Determine the query method (sessionId or userId)
    let cart = sessionId
      ? await Cart.findOne({ session_id: sessionId })
      : await Cart.findOne({ userId });

    // Create a new cart if none exists
    if (!cart) {
      cart = sessionId
        ? new Cart({ session_id: sessionId, items: [] })
        : new Cart({ userId, items: [] });
    }

    // **Session Existence Check**
    if (cart.session_id) {
      const sessionExists = await Session.exists({
        session_id: cart.session_id,
      });

      if (!sessionExists) {
        // Session has expired; remove session_id from cart
        cart.session_id = null;
        await cart.save();

        // **Inform the user that the session has expired**
        return res.status(200).json({
          success: true,
          message:
            "The collaborative session has expired. You are now viewing your personal cart.",
          data: cart,
        });
      }
    }

    // Proceed to add the item to the cart
    // Find if the product already exists in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();

    // Populate product details
    await cart.populate("items.productId", "image title price salePrice");

    const cartItemsWithDetails = cart.items.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    // Emit update if it's a session cart
    if (sessionId) {
      const io = getIO();
      io.to(sessionId).emit("cart_updated", { items: cartItemsWithDetails });
    }

    res
      .status(200)
      .json({ success: true, data: { items: cartItemsWithDetails } });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add item to cart" });
  }
};

// Fetch Cart Items
const fetchCartItems = async (req, res) => {
  const { sessionId, userId } = req.params;

  if (!userId && !sessionId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID or Session ID is required" });
  }

  try {
    let cart = sessionId
      ? await Cart.findOne({ session_id: sessionId })
      : await Cart.findOne({ userId });

    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    // **Session Existence Check**
    if (cart.session_id) {
      const sessionExists = await Session.exists({
        session_id: cart.session_id,
      });

      if (!sessionExists) {
        cart.session_id = null;
        await cart.save();

        // **Inform the user that the session has expired**
        return res.status(200).json({
          success: true,
          message:
            "The collaborative session has expired. You are now viewing your personal cart.",
          data: cart,
        });
      }
    }

    // Proceed to fetch cart items
    await cart.populate("items.productId", "image title price salePrice");

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId?._id,
      image: item.productId?.image,
      title: item.productId?.title,
      price: item.productId?.price,
      salePrice: item.productId?.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: { ...cart._doc, items: populateCartItems },
    });
  } catch (err) {
    console.error("Error fetching cart items:", err);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// Delete Item from Cart
const deleteCartItems = async (req, res) => {
  const { sessionId, userId, productId } = req.params;

  if (!userId && !sessionId) {
    return res
      .status(400)
      .json({ success: false, message: "User ID or Session ID is required" });
  }

  try {
    let cart = sessionId
      ? await Cart.findOne({ session_id: sessionId })
      : await Cart.findOne({ userId });

    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    // **Session Existence Check**
    if (cart.session_id) {
      const sessionExists = await Session.exists({
        session_id: cart.session_id,
      });

      if (!sessionExists) {
        cart.session_id = null;
        await cart.save();

        // **Inform the user that the session has expired**
        return res.status(200).json({
          success: true,
          message:
            "The collaborative session has expired. You are now viewing your personal cart.",
          data: cart,
        });
      }
    }

    // Proceed to delete item from cart
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();

    // Populate product details
    await cart.populate("items.productId");

    const cartItemsWithDetails = cart.items.map((item) => {
      const product = item.productId;
      return {
        productId: product._id,
        quantity: item.quantity,
        title: product.title,
        price: product.price,
        salePrice: product.salePrice,
        image: product.image,
      };
    });

    if (sessionId) {
      const io = getIO();
      io.to(sessionId).emit("cart_updated", { items: cartItemsWithDetails });
    }

    res
      .status(200)
      .json({ success: true, data: { items: cartItemsWithDetails } });
  } catch (err) {
    console.error("Error deleting item from cart:", err);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// Update Cart Item Quantity
const updateCartItems = async (req, res) => {
  let { sessionId, userId, productId, quantity } = req.body;

  if ((!userId && !sessionId) || !productId || quantity <= 0) {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }

  try {
    let cart = sessionId
      ? await Cart.findOne({ session_id: sessionId })
      : await Cart.findOne({ userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // **Session Existence Check**
    if (cart.session_id) {
      const sessionExists = await Session.exists({
        session_id: cart.session_id,
      });

      if (!sessionExists) {
        cart.session_id = null;
        await cart.save();

        // **Inform the user that the session has expired**
        return res.status(200).json({
          success: true,
          message:
            "The collaborative session has expired. You are now viewing your personal cart.",
          data: cart,
        });
      }
    }

    // Proceed to update item quantity
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Populate product details
    await cart.populate("items.productId");

    const cartItemsWithDetails = cart.items.map((item) => {
      const product = item.productId;
      return {
        productId: product._id,
        quantity: item.quantity,
        title: product.title,
        price: product.price,
        salePrice: product.salePrice,
        image: product.image,
      };
    });

    if (sessionId) {
      const io = getIO();
      io.to(sessionId).emit("cart_updated", { items: cartItemsWithDetails });
    }

    res
      .status(200)
      .json({ success: true, data: { items: cartItemsWithDetails } });
  } catch (err) {
    console.error("Error updating cart item:", err);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  deleteCartItems,
  updateCartItems,
};
