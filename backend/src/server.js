import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { server, app } from "./lib/socket.js";
import { ENV } from "./lib/env.js";

dotenv.config();

const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: "5mb" }));
app.use(cors({
    origin: ENV.CLIENT_URL,
    credentials: true
}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    connectDB();
});
