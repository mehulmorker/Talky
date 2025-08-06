import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

// Import database connection
import connectDB from "./config/database.js";

// Import routes
import authRoutes from "./routes/auth.js";
import chatRoutes, { setIO } from "./routes/chat.js";
import userRoutes from "./routes/users.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);

// Pass io instance to chat routes
setIO(io);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a conversation room
  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });

  // Leave a conversation room
  socket.on("leave_conversation", (conversationId) => {
    socket.leave(conversationId);
    console.log(`User ${socket.id} left conversation ${conversationId}`);
  });

  // Handle new message
  socket.on("send_message", (data) => {
    // Broadcast the message to all users in the conversation room
    socket.to(data.conversationId).emit("receive_message", data);
    console.log(
      `Message sent in conversation ${data.conversationId}:`,
      data.content
    );
  });

  // Handle typing indicators
  socket.on("typing_start", (data) => {
    socket.to(data.conversationId).emit("user_typing", {
      userId: data.userId,
      userName: data.userName,
      conversationId: data.conversationId,
    });
  });

  socket.on("typing_stop", (data) => {
    socket.to(data.conversationId).emit("user_stop_typing", {
      userId: data.userId,
      conversationId: data.conversationId,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
