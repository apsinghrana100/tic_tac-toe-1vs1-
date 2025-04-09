import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
import http from "http";
import { Server } from "socket.io";
import connectDB from "./utils/connection.js";
import roomRouter from "./src/routes/roomRoute.js";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

// 🔹 Get __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      `${process.env.FRONTEND_URL}`, // For local development
      "https://real-time-tic-toe-game.onrender.com", // Your deployed frontend
    ],
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

// 🔹 Middleware (Order Matters)
app.use(cors());
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`, // Replace with your actual frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from frontend build folder
app.use(express.static(path.join(__dirname, "public")));
// 🔹 API Routes - Must come BEFORE static files
app.use("/api", roomRouter);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// 🔹 WebSocket Setup
const games = {}; // Store game data per room
const userstore = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinroom", ({ roomId, user }) => {
    socket.join(roomId);
    console.log("getting",roomId,user);

    if (!userstore[roomId]) {
      userstore[roomId] = [];
    }

    if (userstore[roomId].length < 2 && !userstore[roomId].includes(user)) {
      userstore[roomId].push(user);
    }

    

    if (!games[roomId]) {
      games[roomId] = {
        board: Array(9).fill(null),
        isXTurn: true,
      };
    }
    
    io.to(roomId).emit("existingUser", userstore[roomId]);
    io.to(roomId).emit("updateGame", games[roomId]);
  });

  socket.on("makeMove", ({ roomId, board, isXTurn }) => {
    if (games[roomId]) {
      games[roomId].board = board;
      games[roomId].isXTurn = isXTurn;
      io.to(roomId).emit("updateGame", games[roomId]);
      socket.to(roomId).emit("updateChance", true);
    }
  });

  socket.on("resetgame", ({ roomId, isXTurn }) => {
    if (games[roomId]) {
      console.log("i am reset");
      games[roomId].board = Array(9).fill(null);
      games[roomId].isXTurn = isXTurn; // ✅ Corrected
      io.to(roomId).emit("updateGame", games[roomId]);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// 🔹 Start Server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Server failed due to DB connection error:", error);
    process.exit(1);
  }
};

startServer();
