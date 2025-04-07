import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
dotenv.config();

const httpServer = http.createServer();
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
    }
});

const activeGuards = new Map(); 

io.on("connection", (socket) => {
    console.log("Security guard connected:", socket.id);

    // Listen for guard location updates
    socket.on("guardLocation", ({ guardId, lat, lng }) => {
        activeGuards.set(guardId, { lat, lng });
        io.emit("updateLocation", { guardId, lat, lng }); 
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        console.log("Guard disconnected:", socket.id);
        activeGuards.forEach((value, key) => {
            if (value.socketId === socket.id) {
                activeGuards.delete(key);
            }
        });
    });
});

httpServer.listen(6000, () => {
    console.log("WebSocket Server running on port 6000");
});

export default io;
