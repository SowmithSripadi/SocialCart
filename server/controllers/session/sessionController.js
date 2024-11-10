// controllers/sessionController.js
const Session = require("../../models/session");
const Cart = require("../../models/cart"); // Updated to use the unified Cart model
// const crypto = require("crypto");
const mongoose = require("mongoose");
const generateSessionId = () => new mongoose.Types.ObjectId();

const createSession = async (req, res) => {
  try {
    const { userId } = req.body;

    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    let cart = await Cart.findOne({ userId });

    // If a cartId is provided, use the existing cart; otherwise, create a new one linked to this session
    if (!cart) {
      cart = await Cart.create({ userId, session_id: sessionId, items: [] });
    } else {
      cart.session_id = sessionId;
      await cart.save();
    }

    // Create the session with the cart reference
    const session = await Session.create({
      session_id: sessionId,
      host_user_id: userId,
      cart_id: cart._id, // Associate the cart with the session
      expires_at: expiresAt,
      status: "active",
    });

    const frontendHost = process.env.FRONTEND_HOST || "http://localhost:5173";
    const sessionLink = `${frontendHost}/shop/session/join/${session._id}`;

    res.status(201).json({
      message: "Session created successfully",
      sessionLink: sessionLink,
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

const fetchSession = async (req, res) => {
  const { userId } = req.body;
  const session = await Session.findOne({ host_user_id: userId });
  if (!session) return res.status(404).json({ message: "No session found" });

  return res.status(200).json({
    message: "Session details",
    data: session,
  });
};

module.exports = { createSession, joinSession, fetchSession };
