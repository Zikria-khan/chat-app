import express from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors"; 

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import { app } from "./socket/socket.js"; // Adjust this import based on your socket setup

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const app = express(); // Create an instance of Express

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // CORS configuration
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Success route for the root path
app.get("/", (req, res) => {
    res.status(200).json({ message: "Success!" });
});

// Serve static files
const __dirname = path.dirname(new URL(import.meta.url).pathname); // Resolve current directory
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Connect to MongoDB and start the server
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error.message);
    });

// Export the app for Vercel
export default app;
