const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API routes (to be added)
app.get("/", (req, res) => res.send("API is running"));

// Create HTTP server + Socket.io setup
const server = http.createServer(app);
const io = socketio(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);

  socket.on("joinChat", (chatId) => socket.join(chatId));

  socket.on("sendMessage", (data) => {
    io.to(data.chatId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
