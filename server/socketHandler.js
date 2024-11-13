// socketHandler.js
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join_session", (sessionId) => {
      socket.join(sessionId);
      console.log(`User joined session: ${sessionId}`);
    });

    socket.on("send_message", (data) => {
      const { sessionId, senderId, senderName, type, content, timestamp } =
        data;
      io.to(sessionId).emit("receive_message", {
        senderId,
        senderName,
        type,
        content,
        timestamp,
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
