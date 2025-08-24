const Order = require("../../models/order");
const Cart = require("../../models/cart");
const Product = require("../../models/product");
const paypal = require("../../helpers/paypal");

// Create order from user's personal cart (or session cart if provided and valid)
// 


const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/paypal-cancel",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "description",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log(error);

        return res.status(500).json({
          success: false,
          message: "Error while creating paypal payment",
        });
      } else {
        // Map incoming fields to the current Order schema
        const newlyCreatedOrder = new Order({
          userId,
          // session_id can be added here if you pass it from client
          items: Array.isArray(cartItems)
            ? cartItems.map((item) => ({
                productId: item.productId,
                title: item.title,
                image: item.image,
                // Store both price and salePrice if provided
                price: typeof item.price === "number" ? item.price : Number(item.price) || 0,
                salePrice:
                  typeof item.salePrice === "number"
                    ? item.salePrice
                    : Number(item.salePrice) || 0,
                quantity: item.quantity,
              }))
            : [],
          address: {
            address: addressInfo?.address,
            city: addressInfo?.city,
            pincode: addressInfo?.pincode,
            phone: addressInfo?.phone,
            notes: addressInfo?.notes,
          },
          subtotal: typeof totalAmount === "number" ? totalAmount : Number(totalAmount) || 0,
          total: typeof totalAmount === "number" ? totalAmount : Number(totalAmount) || 0,
          status: orderStatus || "pending",
        });

        await newlyCreatedOrder.save();

        const approvalURL = paymentInfo.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(201).json({
          success: true,
          approvalURL,
          orderId: newlyCreatedOrder._id,
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const listOrders = async (req, res) => {
  try {
    // Support both /list/:userId and /list?userId=...
    const userId = req.params.userId || req.query.userId;
    const orders = await Order.find({ userId });
    return res.status(200).json({
      success: true,
      data: orders || [],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};



const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    return res.status(200).json({ success: true, data: order });
  } catch (e) {
    console.error("Error fetching order details:", e);
    return res.status(500).json({ success: false, message: "Failed" });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    // Update order fields to reflect successful payment using current schema
    order.status = "confirmed";

    for (let item of order.items) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found while updating stock`,
        });
      }

      product.totalStock = Math.max(0, (product.totalStock || 0) - item.quantity);

      await product.save();
    }

    // Clear user's cart after successful payment
    await Cart.findOneAndDelete({ userId: order.userId });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = { createOrder, listOrders, getOrderDetails, capturePayment };



