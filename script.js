const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

// Fullscreen canvas
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.8;

let drawing = false;

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
canvas.addEventListener("mousemove", draw);

function startDrawing(e) {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function draw(e) {
  if (!drawing) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.strokeStyle = "#000"; // black lines
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.stroke();
}

function stopDrawing() {
  drawing = false;
  ctx.closePath();
}
const socket = io();
const stickyContainer = document.getElementById("sticky-container");
const addStickyBtn = document.getElementById("add-sticky");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

// Add new sticky
addStickyBtn.addEventListener("click", () => {
  const stickyData = {
    id: Date.now(), // unique ID
    x: 50,
    y: 50,
    text: "New note",
  };
  createSticky(stickyData);
  socket.emit("add-sticky", stickyData);
});

function createSticky(data) {
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

// Receive stickies from other clients
socket.on("add-sticky", (data) => {
  createSticky(data);
});

socket.on("move-sticky", (data) => {
  const sticky = document.querySelector(`.sticky[data-id="${data.id}"]`);
  if (sticky) {
    sticky.style.left = data.x + "px";
    sticky.style.top = data.y + "px";
  }
});

// Chat input
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && chatInput.value.trim() !== "") {
    socket.emit("chat-message", chatInput.value.trim());
    chatInput.value = "";
  }
});

// Chat messages
socket.on("chat-message", (msg) => {
  const msgElem = document.createElement("div");
  msgElem.textContent = msg;
  chatMessages.appendChild(msgElem);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
// Handle drawing events
socket.on("draw", (data) => {
  ctx.lineTo(data.x, data.y);
  ctx.strokeStyle = "#000"; // black lines
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.stroke();
});