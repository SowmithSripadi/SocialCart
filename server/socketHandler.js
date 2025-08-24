// socketHandler.js
const socketIo = require("socket.io");
const FRONTEND_HOST = process.env.FRONTEND_HOST;
const FRONTEND_HOSTS = process.env.FRONTEND_HOSTS;
const allowedOrigins = (FRONTEND_HOSTS || FRONTEND_HOST || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

let ioInstance;

// Removed username tracking per user: we only track user counts now

const getNumberOfClientsInRoom = (roomId) => {
  const room = ioInstance.sockets.adapter.rooms.get(roomId);
  return room ? room.size : 0;
};

function init(server) {
  ioInstance = socketIo(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join_session", (payload) => {
      const sessionId =
        typeof payload === "string" ? payload : payload?.sessionId;

      socket.join(sessionId);
      socket.data.sessionId = sessionId;
      console.log(`User joined session: ${sessionId}`);

      // Now, sessionId is defined, so we can use it here
      const numClients = getNumberOfClientsInRoom(sessionId);
      console.log(`Number of clients in session ${sessionId}: ${numClients}`);

      // Emit the updated count to the room
      ioInstance
        .to(sessionId)
        .emit("user_count_updated", { userCount: numClients });
      // removed usernames event
    });

    socket.on("send_message", (data) => {
      const { sessionId, senderId, senderName, type, content, timestamp } =
        data;
      ioInstance.to(sessionId).emit("receive_message", {
        senderId,
        senderName,
        type,
        content,
        timestamp,
      });
    });

    // removed get_user_list handler

    // Allow clients to explicitly leave a session room
    socket.on("leave_session", (sessionId) => {
      try {
        socket.leave(sessionId);
        const numClients = getNumberOfClientsInRoom(sessionId);
        ioInstance
          .to(sessionId)
          .emit("user_count_updated", { userCount: numClients });
      } catch (e) {}
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);

      socket.rooms.forEach((sessionId) => {
        if (sessionId !== socket.id) {
          // Get the updated number of clients in the room
          const numClients = getNumberOfClientsInRoom(sessionId);
          console.log(
            `Number of clients in session ${sessionId}: ${numClients}`
          );

          // Emit the updated count to the room
          ioInstance
            .to(sessionId)
            .emit("user_count_updated", { userCount: numClients });

          // no usernames event
        }
      });
    });
  });
}

function getIO() {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized!");
  }
  return ioInstance;
}

module.exports = {
  init,
  getIO,
};
