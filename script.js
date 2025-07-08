const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files (index.html, script.js, style.css, etc.)
app.use(express.static(path.join(__dirname, ".")));

// Redirect root / to a new unique board
app.get("/", (req, res) => {
  res.redirect(`/board/${uuidv4()}`);
});

// Redirect /board (with no ID) to a new unique board
app.get("/board", (req, res) => {
  res.redirect(`/board/${uuidv4()}`);
});

// Serve index.html for /board/:sessionId
app.get("/board/:sessionId", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 404 handler for any other routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "404.html"));
});

// Socket.IO real-time logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  let currentSession = null;

  socket.on("join-session", (sessionId) => {
    socket.join(sessionId);
    currentSession = sessionId;
    console.log(`Socket ${socket.id} joined session ${sessionId}`);
  });

  socket.on("draw", (data) => {
    if (currentSession) {
      socket.to(currentSession).emit("draw", data);
    }
  });

  socket.on("add-sticky", (data) => {
    if (currentSession) {
      socket.to(currentSession).emit("add-sticky", data);
    }
  });

  socket.on("move-sticky", (data) => {
    if (currentSession) {
      socket.to(currentSession).emit("move-sticky", data);
    }
  });
  socket.on("delete-sticky", (data) => {
    if (currentSession) {
      socket.to(currentSession).emit("delete-sticky", data);
    }
  });

  socket.on("clear-board", () => {
    if (currentSession) {
      socket.to(currentSession).emit("clear-board");
    }
  });

  socket.on("chat-message", (msg) => {
    if (currentSession) {
      socket.to(currentSession).emit("chat-message", msg);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
// This is the end of the file.
// <!-- --- IGNORE --- -->