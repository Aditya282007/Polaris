import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server as SocketServer } from "socket.io";
import dotenv from "dotenv";
import missionRoutes from "./routes/missionRoutes";
import cargoRoutes from "./routes/cargoRoutes";
import inventoryRoutes from "./routes/inventoryRoutes";
import personnelRoutes from "./routes/personnelRoutes";
import incidentRoutes from "./routes/incidentRoutes";
import IncidentModel from "./models/Incident";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new SocketServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.use("/api/missions", missionRoutes);
app.use("/api/cargo", cargoRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/personnel", personnelRoutes);
app.use("/api/incidents", incidentRoutes);

io.on("connection", (socket) => {
  console.log(`Socket.IO client connected: ${socket.id}`);
  // Join action feed room
  socket.join("action-feed");
  
  // Get current action feed
  socket.on("get-action-feed", () => {
    // In production, would fetch from Redis/DB
    socket.emit("action-feed-updated", []);
  });

  // Get incidents sorted by severity
  socket.on("get-incidents", async () => {
    const incidents = await IncidentModel.find().sort({ createdAt: -1 });
    socket.emit("incidents-updated", incidents);
  });

  socket.on("disconnect", () => {
    console.log(`Socket.IO client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

export { io, app, server };