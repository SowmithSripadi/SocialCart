// controllers/sessionController.js
const Session = require("../../models/session");
const Cart = require("../../models/cart"); // Updated to use the unified Cart model
const crypto = require("crypto");

const generateSessionId = () => crypto.randomBytes(16).toString("hex");

const createSession = async (req, res) => {
  try {
    const { userId, cartId } = req.body;
    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    let cart;

    // If a cartId is provided, use the existing cart; otherwise, create a new one linked to this session
    if (cartId) {
      cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
    } else {
      cart = await Cart.create({ userId, session_id: sessionId, items: [] });
    }

    // Create the session with the cart reference
    const session = await Session.create({
      session_id: sessionId,
      host_user_id: userId,
      cart_id: cart._id, // Associate the cart with the session
      expires_at: expiresAt,
      status: "active",
    });

    res.status(201).json({
      message: "Session created successfully",
      sessionLink: `${req.protocol}://${req.get(
        "host"
      )}/api/session/join/${sessionId}`,
      sessionId: sessionId,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ message: "Failed to create session", error });
  }
};

const joinSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { guestUserId } = req.body;

    // Find an active session by session ID
    const session = await Session.findOne({
      session_id: sessionId,
      status: "active",
    });
    if (!session) {
      return res.status(404).json({ message: "Session not found or expired" });
    }

    // Assign guest user to the session if not already assigned
    if (!session.guest_user_id) {
      session.guest_user_id = guestUserId;
      await session.save();
    }

    res.status(200).json({
      message: "Joined session successfully",
      sessionDetails: session,
    });
  } catch (error) {
    console.error("Error joining session:", error);
    res.status(500).json({ message: "Failed to join session", error });
  }
};

module.exports = { createSession, joinSession };
