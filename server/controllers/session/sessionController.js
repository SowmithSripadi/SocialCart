const Session = require("../../models/session");
const Cart = require("../../models/cart");
const mongoose = require("mongoose");
const { getIO } = require("../../socketHandler");

// Controller to create or reuse a session
const createSession = async (req, res) => {
  try {
    const { userId } = req.body;
    const userIdObj = new mongoose.Types.ObjectId(userId);

    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours expiration

    let session = await Session.findOne({
      host_user_id: userIdObj,
    });

    if (session) {
      // If an active session exists, return its details
      res.status(200).json({
        message: "Session already exists",
        sessionLink: session.session_link,
        sessionId: session.session_id,
      });
      return;
    }

    const sessionId = new mongoose.Types.ObjectId(); // Generate a new ObjectId for session_id

    // Create or update the cart with the new session ID
    let cart = await Cart.findOne({ userId: userIdObj });
    if (!cart) {
      cart = await Cart.create({
        userId: userIdObj,
        items: [],
        session_id: sessionId,
      });
    } else {
      cart.session_id = sessionId;
      await cart.save();
    }

    const frontendHosts = process.env.FRONTEND_HOSTS || process.env.FRONTEND_HOST || "";
    const defaultFrontend = frontendHosts.split(",").map((s) => s.trim()).filter(Boolean)[0] || "http://localhost:5173";
    const requestOrigin = req.headers.origin;
    const originToUse = requestOrigin && frontendHosts.includes(requestOrigin) ? requestOrigin : defaultFrontend;
    const sessionLink = `${originToUse}/shop/session/join/${sessionId}`;

    session = await Session.create({
      session_id: sessionId,
      host_user_id: userIdObj,
      cart_id: cart._id,
      expires_at: expiresAt,
      session_link: sessionLink,
    });

    res.status(201).json({
      message: "Session created successfully",
      sessionLink: session.session_link,
      sessionId: session.session_id,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ message: "Failed to create session", error });
  }
};

// Controller for a guest user to join an active session
const joinSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { guestUserId } = req.body;

    const sessionIdObj = new mongoose.Types.ObjectId(sessionId);
    const guestUserIdObj = new mongoose.Types.ObjectId(guestUserId);

    console.log(sessionIdObj, "session");
    console.log(guestUserIdObj, "guest");

    const session = await Session.findOne({
      session_id: sessionIdObj,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found or expired" });
    }

    session.guest_user_id = guestUserIdObj;
    await session.save();

    res.status(200).json({
      message: "Joined session successfully",
      sessionDetails: session,
    });
  } catch (error) {
    console.error("Error joining session:", error);
    res.status(500).json({ message: "Failed to join session", error });
  }
};

// Controller to fetch an existing session by user ID
const fetchSession = async (req, res) => {
  try {
    const { userId } = req.query;
    const userIdObj = new mongoose.Types.ObjectId(userId);

    // console.log(userIdObj, "userIdobject");

    const session = await Session.findOne({
      $or: [{ host_user_id: userIdObj }, { guest_user_id: userIdObj }],
    });

    // console.log(session, "session");

    if (!session) {
      return res.status(200).json({
        message: "No active session found",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Session details",
      data: session,
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    return res.status(500).json({ message: "Failed to fetch session", error });
  }
};

module.exports = { createSession, joinSession, fetchSession };

// End a collaborative session (host only)
const endSession = async (req, res) => {
  try {
    const { userId } = req.body; // host id
    const hostUserId = new mongoose.Types.ObjectId(userId);

    const session = await Session.findOne({ host_user_id: hostUserId });
    if (!session)
      return res.status(404).json({ message: "Active session not found" });

    // Clear session_id from the host cart
    const cart = await Cart.findById(session.cart_id);
    if (cart) {
      cart.session_id = null;
      await cart.save();
    }

    const sessionId = session.session_id;
    await Session.deleteOne({ _id: session._id });

    // Notify clients in the room that session has ended
    try {
      const io = getIO();
      io.to(sessionId.toString()).emit("session_ended", {});
    } catch (e) {
      // socket not initialized, ignore
    }

    return res.status(200).json({ message: "Session ended" });
  } catch (error) {
    console.error("Error ending session:", error);
    return res.status(500).json({ message: "Failed to end session", error });
  }
};

// Leave a collaborative session (guest leaves)
const leaveSession = async (req, res) => {
  try {
    const { userId } = req.body; // guest id
    const guestId = new mongoose.Types.ObjectId(userId);

    const session = await Session.findOne({ guest_user_id: guestId });
    if (!session)
      return res.status(404).json({ message: "No session joined by user" });

    session.guest_user_id = null;
    await session.save();

    // Broadcast updated user count via socket by emitting leave from server
    try {
      const io = getIO();
      const roomId = session.session_id.toString();
      io.to(roomId).emit("user_count_updated", { userCount: 1 });
    } catch (e) {}

    return res.status(200).json({ message: "Left session" });
  } catch (error) {
    console.error("Error leaving session:", error);
    return res.status(500).json({ message: "Failed to leave session", error });
  }
};

module.exports.endSession = endSession;
module.exports.leaveSession = leaveSession;
