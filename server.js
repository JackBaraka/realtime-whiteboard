const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files (your HTML, CSS, JS)
app.use(express.static(path.join(__dirname, ".")));

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data);
  });

  socket.on("add-sticky", (data) => {
    socket.broadcast.emit("add-sticky", data);
  });

  socket.on("move-sticky", (data) => {
    socket.broadcast.emit("move-sticky", data);
  });

  socket.on("chat-message", (msg) => {
    socket.broadcast.emit("chat-message", msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});
// Create a sticky note
function createSticky(data) {       
  const stickyContainer = document.getElementById("sticky-container");
  const sticky = document.createElement("div");
  sticky.className = "sticky";
  sticky.style.left = data.x + "px";
  sticky.style.top = data.y + "px";
  sticky.textContent = data.text;
  sticky.setAttribute("data-id", data.id);

  stickyContainer.appendChild(sticky);

  let offsetX, offsetY, dragging = false;

  sticky.addEventListener("mousedown", (e) => {
    dragging = true;
    offsetX = e.clientX - sticky.offsetLeft;
    offsetY = e.clientY - sticky.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    sticky.style.left = x + "px";
    sticky.style.top = y + "px";
    socket.emit("move-sticky", {
      id: data.id,
      x,
      y,
    });
  });

  document.addEventListener("mouseup", () => dragging = false);
}