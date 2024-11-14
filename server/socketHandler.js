// socketHandler.js
const socketIo = require("socket.io");

let ioInstance;

const getNumberOfClientsInRoom = (roomId) => {
  const room = ioInstance.sockets.adapter.rooms.get(roomId);
  return room ? room.size : 0;
};

function init(server) {
  ioInstance = socketIo(server, {
    cors: {
      origin: "http://localhost:5173", // Replace with your frontend URL
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join_session", (sessionId) => {
      socket.join(sessionId);
      console.log(`User joined session: ${sessionId}`);

      // Now, sessionId is defined, so we can use it here
      const numClients = getNumberOfClientsInRoom(sessionId);
      console.log(`Number of clients in session ${sessionId}: ${numClients}`);

      // Emit the updated count to the room
      ioInstance
        .to(sessionId)
        .emit("user_count_updated", { userCount: numClients });
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
