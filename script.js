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
