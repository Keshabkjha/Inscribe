const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const socket = io();
const colorPicker = document.getElementById('color');
const brushSlider = document.getElementById('size');
const toolSelect = document.getElementById('tool');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const resizeButton = document.getElementById('resizeCanvas');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const messages = document.getElementById('messages');
const downloadButton = document.getElementById('download');
const backgroundSelect = document.getElementById('background');
const themeToggle = document.getElementById('theme-toggle');
const resizeOption = document.getElementById('resizeOption');
const increaseButton = document.getElementById('increase');
const decreaseButton = document.getElementById('decrease');
const eraserButton = document.getElementById('eraser');
const modeToggle = document.getElementById('mode-toggle');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let drawing = false;
let erasing = false;
let brushSize = 5;
let color = '#000000';
let tool = 'pen';
let previousTool = 'pen';
let eraseMode = 'single';
let startX, startY;
let drawingHistory = [];
let undoneHistory = [];
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});
resizeButton.addEventListener('click', resizeCanvasToNewDimensions);
backgroundSelect.addEventListener('change', applyBackgroundStyle);
increaseButton.addEventListener('click', () => resizeCanvas('increase'));
decreaseButton.addEventListener('click', () => resizeCanvas('decrease'));
downloadButton.addEventListener('click', downloadCanvasImage);
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', endDrawing);
canvas.addEventListener('mousemove', draw);
document.addEventListener('keydown', handleUndoRedo);
window.addEventListener('resize', resizeCanvasToFit);
sendButton.addEventListener('click', sendMessage);
eraserButton.addEventListener('click', () => {tool = 'eraser';});
brushSlider.addEventListener('input', (e) => {
    brushSize = e.target.value;
    ctx.lineWidth = brushSize;
});
modeToggle.addEventListener('click', () => {
    erasing = !erasing; 
    ctx.strokeStyle = erasing ? '#FFFFFF' : color;
    modeToggle.textContent = erasing ? 'Switch to Drawing' : 'Switch to Erasing';
});
let lastX = 0, lastY = 0;
function startDrawing(e) {
    drawing = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    if (tool === 'pen') {
        ctx.moveTo(startX, startY);
    }
}
function endDrawing() {
    drawing = false;
    saveCanvasState();
    ctx.closePath();
    undoneHistory = [];
}
function draw(e) {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineWidth = brushSize; 
    ctx.strokeStyle = erasing ? '#FFFFFF' : color; 
    if (erasing) {
        ctx.globalCompositeOperation = 'destination-out'; 
        ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI); 
        ctx.fill(); 
    } else { 
        ctx.globalCompositeOperation = 'source-over'; 
        ctx.lineTo(x, y); 
        ctx.stroke(); 
        ctx.beginPath(); 
        ctx.moveTo(x, y); 
    } 
    socket.emit('drawing', { x, y, color: ctx.strokeStyle, size: ctx.lineWidth, tool });
}
canvas.addEventListener('mouseup', () => {
    ctx.globalCompositeOperation = 'source-over';
    if (tool === 'eraser') {
        tool = previousTool;
    }
});
function drawShape(x, y) {
    ctx.beginPath();
    if (tool === 'line') {
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.stroke();
    } else if (tool === 'rectangle') {
        ctx.strokeRect(startX, startY, x - startX, y - startY);
    } else if (tool === 'circle') {
        const radius = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
    ctx.closePath();
}
function saveCanvasState() {
    drawingHistory.push(canvas.toDataURL());
    if (drawingHistory.length > 100) drawingHistory.shift(); 
}
function restoreCanvas(state) {
    const img = new Image();
    img.src = state || '';
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
}
function handleUndoRedo(e) {
    if (e.ctrlKey && e.key === 'z') undo();
    else if (e.ctrlKey && e.key === 'y') redo();
}
function undo() {
    if (drawingHistory.length === 0) return;
    undoneHistory.push(drawingHistory.pop());
    restoreCanvas(drawingHistory[drawingHistory.length - 1] || '');
}
function redo() {
    if (undoneHistory.length === 0) return;
    const imgData = undoneHistory.pop();
    drawingHistory.push(imgData);
    restoreCanvas(imgData);
}
function resizeCanvasToNewDimensions() {
    const newWidth = parseInt(widthInput.value, 10);
    const newHeight = parseInt(heightInput.value, 10);
    if (newWidth < 100 || newHeight < 100) return;
    const savedImage = canvas.toDataURL();
    canvas.width = newWidth;
    canvas.height = newHeight;
    restoreSavedImage(savedImage);
}
function updateCanvasSizeDisplay() {
    widthInput.value = canvas.width;
    heightInput.value = canvas.height;
}
function resizeCanvas(option) {
    const change = option === 'increase' ? 5 : -5;
    const newWidth = canvas.width + (resizeOption.value === 'width' ? change : 0);
    const newHeight = canvas.height + (resizeOption.value === 'height' ? change : 0);
    if (newWidth < 100 || newHeight < 100) return;
    const savedImage = canvas.toDataURL();
    canvas.width = newWidth;
    canvas.height = newHeight;
    restoreSavedImage(savedImage);
    updateCanvasSizeDisplay();
}
function restoreSavedImage(savedImage) {
    const img = new Image();
    img.src = savedImage;
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        applyBackgroundStyle();
    };
}
function applyBackgroundStyle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    switch (backgroundSelect.value) {
        case 'white':
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            break;
        case 'grid':
            drawGrid();
            break;
        case 'dots':
            drawDots();
            break;
        case 'lined':
            drawLines();
            break;
    }
}
function drawGrid() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}
function drawDots() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#333';
    for (let x = 10; x < canvas.width; x += 20) {
        for (let y = 10; y < canvas.height; y += 20) {
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}
function drawLines() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;

    for (let y = 20; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}
function downloadCanvasImage() {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
}
function resizeCanvasToFit() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    applyBackgroundStyle();
}
resizeCanvasToFit();
window.addEventListener('resize', resizeCanvasToFit);
function sendMessage() {
    const msg = messageInput.value.trim();
    if (msg) {
        socket.emit('chat message', { username, msg });
        messageInput.value = '';
    }
}
socket.on('drawing', ({ x, y, color, size }) => {
    ctx.lineWidth = size;
    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
});
let username = prompt("Enter your name:", "Guest");
if (!username || username.trim() === "Guest") {
    username = `Guest${Math.floor(Math.random() * 10000)}`;
}
socket.emit('user joined', username);
const displayMessage = (data) => {
    const li = document.createElement('li');
    li.className = data.username === username ? 'sender' : 'receiver'; 
    li.innerHTML = `<span class="username">${data.username}:</span> ${data.msg}`;
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight; 
};
socket.on('chat message', (data) => {
    displayMessage(data);
});
socket.on('update user count', (count) => {
    document.getElementById('online-count').textContent = `People online: ${count}`;
});
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('chat message', { username, msg: message });
        messageInput.value = ''; 
    }
});
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});