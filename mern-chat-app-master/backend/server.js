import express from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors"; 
import { Server } from "socket.io"; 
import http from "http"; 

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config(); 

const app = express(); 

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000', // Your client URL
    methods: ["GET", "POST"],
    credentials: true, 
};
const __dirname = path.resolve();
// Middleware
app.use(cors(corsOptions)); 
app.use(express.json());
app.use(cookieParser());

// Routes

app.get("/api/test", (req, res) => {
    res.status(200).json({ message: "Success!" });
});
app.get("/api",(req,res)=>{
 res.status.json({message:"Success"})   
})
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Success route for the root path
app.get("/", (req, res) => {
    res.status(200).json({ message: "Success!" });
});
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Redirect all unknown routes to the frontend's index.html
app.get("*", (_, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"), (err) => {
        if (err) {
            console.error("Error serving index.html:", err);
            res.status(err.status).end();
        }
    });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");

        // Create the HTTP server
        const server = http.createServer(app);
        
        // Initialize Socket.IO with the HTTP server
        const io = new Server(server, {
            cors: corsOptions,
        });

        // Socket.IO event handling
        io.on("connection", (socket) => {
            console.log("A user connected");
            socket.on("message", (msg) => {
                console.log("Message received:", msg);
                io.emit("message", msg);
            });

            socket.on("disconnect", () => {
                console.log("User disconnected");
            });
        });

        // Start the server
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error.message);
    });

// No longer exporting the app instance
