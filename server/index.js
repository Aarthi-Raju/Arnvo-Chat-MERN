import express, { json } from "express";
import { mongoDbUrl, PORT } from "./config.js";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/userRoute.js";
import messageRouter from "./routes/messageRoute.js";
import { Server } from "socket.io"; // Correct ES Module import for socket.io
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

// CORS middleware
app.use(cors());
app.use(json());

// Paths
app.get("/", (req, res) => {
    res.json({ message: "Welcome to chatApp backend" });
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to MongoDB and start server
mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoCluster");
        httpServer.listen(PORT, () => {
            console.log(`Backend is running at http://localhost:${PORT}/`);
        });

        const io = new Server(httpServer, {
            cors: {
                origin: "http://localhost:3000", // Ensure this matches the front-end URL
                credentials: true,
            },
        });

        global.onlineUsers = new Map();

        io.on("connection", (socket) => {            
            // Get userId from connection query
            const userId = socket.handshake.query.userId;
            if (userId) {
                global.onlineUsers.set(userId, socket.id);
            }
            socket.on("add-user", (userId) => {
                global.onlineUsers.set(userId, socket.id);
            });

            // Handle sending a message
            socket.on("send-msg", (data) => {                
                const sendUserSocket = global.onlineUsers.get(data.to);
                if (sendUserSocket) {
                    io.to(sendUserSocket).emit("msg-receive", {
                        from: data.from,
                        message: data.message
                    });
                } else {
                    console.log("Available users:", Array.from(global.onlineUsers.keys()));
                }
            });

            socket.on("disconnect", () => {
                // Remove user from onlineUsers when they disconnect
                for (const [userId, socketId] of global.onlineUsers.entries()) {
                    if (socketId === socket.id) {
                        global.onlineUsers.delete(userId);
                        break;
                    }
                }
            });
        });


    })
    .catch((err) => {
        console.log(`Error connecting to MongoDB: ${err}`);
    });
