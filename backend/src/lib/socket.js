import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  if (process.env.NODE_ENV !== "production") console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (process.env.NODE_ENV !== "production") console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // receive typing events from clients and forward to receiver
  // payload: { to: <receiverId>, isTyping: true|false }
  socket.on("typing", (payload) => {
    try {
      const { to, isTyping } = payload || {};
      if (!to) return;

      const receiverSocketId = userSocketMap[to];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { from: userId, isTyping });
      }
    } catch (err) {
      console.error("Error handling typing event:", err.message);
    }
  });
});

export { io, app, server };
