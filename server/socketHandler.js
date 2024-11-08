// socketHandler.js
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Join a session room for real-time collaboration
    socket.on("join_session", (sessionId) => {
      socket.join(sessionId);
      console.log(`User joined session: ${sessionId}`);
    });

    // Handle sending messages in the chat
    socket.on("send_message", (data) => {
      const { sessionId, senderId, messageContent } = data;
      io.to(sessionId).emit("receive_message", {
        senderId,
        messageContent,
        timestamp: new Date(),
      });
    });

    // Handle item addition in shared cart
    socket.on("add_item_to_cart", (data) => {
      const { sessionId, productId, quantity } = data;
      io.to(sessionId).emit("cart_updated", { productId, quantity });
    });

    // Handle item removal in shared cart
    socket.on("remove_item_from_cart", (data) => {
      const { sessionId, productId } = data;
      io.to(sessionId).emit("cart_updated", { productId, quantity: 0 });
    });

    // Handle client disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
