const { Server } = require("socket.io");
const { saveMessage } = require("../controllers/message.controller");

const initSocket = (server) => {

  const allowedOrigins = [
  "http://localhost:5173",
  "https://linkup-f4145.web.app", // Firebase frontend
];

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  const onlineUsers = {};

  io.on("connection", (socket) => {
    // console.log("User connected via services: 👤", socket.id);

    // 3 user online offline status update feature
    //3.1 when user connect, add user to online users list
    socket.on("addUserOnline", (userId) => {
      if (userId) {
        onlineUsers[userId] = socket.id;
        // console.log(`User ${userId} is now online.`);

        // 3.2 when user connect, send all online users to the client
        io.emit("getOnlineUsers", Object.keys(onlineUsers));
      }
    });

    // 1. Create room for individual
    socket.on("joinRoom", async ({ senderId, receiverId }) => {
      // create id of this room
      const roomId = [senderId, receiverId].sort().join("-");

      // socket go the this room
      socket.join(roomId);
      // console.log(`User ${socket.id} joined room: 🔑 ${roomId}`);
    });

    // 2.Room wise message sending event
    socket.on("sendMessage", async (data) => {
      try {
        const { sender, receiver } = data;
        const roomId = [sender, receiver].sort().join("-");
        // console.log(data);
        // message save to the DB
        const saveMsg = await saveMessage(data);
        io.to(roomId).emit("receiveMessage", saveMsg);
        // console.log(saveMsg);
      } catch (err) {
        socket.emit("error", "message send failed");
      }
    });

    //4. Typing indicator feature
    socket.on("typing", ({ roomId, senderId }) => {
      socket.to(roomId).emit("partnerTyping", { isTyping: true, senderId });
    });

    socket.on("stopTyping", ({ roomId, senderId }) => {
      socket.to(roomId).emit("partnerTyping", { isTyping: false, senderId });
    });

    socket.on("disconnect", () => {
      // console.log("User disconnected ❌");

      // 3.3 when user disconnect, remove user from online users list
      for (const userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          // console.log(`User ${userId} went offline.`);
          break;
        }
      }

      // 3.4 when user disconnect, send all online users to the client
      io.emit("getOnlineUsers", Object.keys(onlineUsers));
    });
  });

  return io;
};

module.exports = initSocket;
