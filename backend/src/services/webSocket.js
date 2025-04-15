import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

const PORT = 4000;

const activeGuards = new Map();

io.on("connection", (socket) => {
  console.log("Security guard connected:", socket.id);

  socket.on("guardLocation", ({ guardId, lat, lng }) => {
    activeGuards.set(guardId, { lat, lng, socketId: socket.id });
    io.emit("getLocation", { guardId, lat, lng });
  });

  socket.on("disconnect", () => {
    console.log("Guard disconnected:", socket.id);
    activeGuards.forEach((value, key) => {
      if (value.socketId === socket.id) {
        activeGuards.delete(key);
      }
    });
  });
});

httpServer.listen(PORT, () => {
  console.log(`WebSocket server listening on port ${PORT}`);
});
