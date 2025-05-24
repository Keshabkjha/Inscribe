// DOM Elements
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const socket = io({
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000
});

// UI Elements
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
const loadingIndicator = document.createElement('div');
loadingIndicator.className = 'loading';
loadingIndicator.textContent = 'Connecting...';
document.body.appendChild(loadingIndicator);

// State Management
// State Management
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
let isConnected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Initialize canvas size
updateCanvasSizeDisplay();
// Set initial canvas size with safe defaults
const initialWidth = Math.min(1200, window.innerWidth * 0.9);
const initialHeight = Math.min(800, window.innerHeight * 0.8);
canvas.width = initialWidth;
canvas.height = initialHeight;
widthInput.value = Math.round(initialWidth);
heightInput.value = Math.round(initialHeight);
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
colorPicker.addEventListener('input', (e) => {
    color = e.target.value;
    if (!erasing) {
        ctx.strokeStyle = color; 
    }
});

let lastX = 0, lastY = 0;
function startDrawing(e) {
    drawing = true;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    startX = (e.clientX - rect.left) * scaleX;
    startY = (e.clientY - rect.top) * scaleY;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    if (tool === 'pen') {
        ctx.moveTo(startX, startY);
    }
}
function endDrawing() {
    if (!drawing) return;
    drawing = false;
    saveCanvasState();
    ctx.closePath();
    undoneHistory = [];
    socket.emit('drawing', { x: null, y: null, color: null, size: null, start: true });
}
function draw(e) {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left)*scaleX;
    const y = (e.clientY - rect.top)*scaleY;
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
    socket.emit('drawing', { x, y, color: ctx.strokeStyle, size: ctx.lineWidth, tool, start: false});
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
    const savedImage = canvas.toDataURL();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    restoreSavedImage(savedImage);
    ctx.beginPath(); 
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
// Connection status handlers
const updateConnectionStatus = (status) => {
  const statusElement = document.getElementById('connection-status') || (() => {
    const el = document.createElement('div');
    el.id = 'connection-status';
    el.style.position = 'fixed';
    el.style.bottom = '10px';
    el.style.right = '10px';
    el.style.padding = '5px 10px';
    el.style.borderRadius = '3px';
    el.style.fontSize = '12px';
    document.body.appendChild(el);
    return el;
  })();
  
  statusElement.textContent = status.message;
  statusElement.style.backgroundColor = status.isError ? '#ffebee' : '#e8f5e9';
  statusElement.style.color = status.isError ? '#c62828' : '#2e7d32';
  
  if (status.isError) {
    console.error('Connection Error:', status.message);
  } else {
    console.log('Connection Status:', status.message);
  }
};

// Socket.IO event handlers
socket.on('connect', () => {
  isConnected = true;
  reconnectAttempts = 0;
  loadingIndicator.style.display = 'none';
  updateConnectionStatus({ message: 'Connected', isError: false });
});

socket.on('disconnect', () => {
  isConnected = false;
  loadingIndicator.style.display = 'block';
  loadingIndicator.textContent = 'Reconnecting...';
  updateConnectionStatus({ message: 'Disconnected. Reconnecting...', isError: true });
});

socket.on('connect_error', (error) => {
  reconnectAttempts++;
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    loadingIndicator.textContent = 'Connection failed. Please refresh the page.';
    updateConnectionStatus({ 
      message: 'Connection failed. Please refresh the page.', 
      isError: true 
    });
  } else {
    loadingIndicator.textContent = `Reconnecting (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`;
  }
  console.error('Connection Error:', error);
});

// Drawing event handlers
socket.on('drawing', (data) => {
  if (!data) {
    console.error('Received invalid drawing data');
    return;
  }
  ctx.lineWidth = data.size;
  ctx.strokeStyle = data.color;
  if (data.start) {
      ctx.beginPath();
      if (data.x !== null && data.y !== null) {
          ctx.moveTo(data.x, data.y); // Move to the start position
      }
  } else {
      if (data.x !== null && data.y !== null) {
          ctx.lineTo(data.x, data.y);
          ctx.stroke();
          ctx.beginPath(); // Prepare for the next segment
          ctx.moveTo(data.x, data.y);
      }
  }
});
let username = prompt("Enter your name:", "Guest");
if (!username || username.trim() === "Guest") {
    username = `Guest${Math.floor(Math.random() * 10000)}`;
}
socket.emit('user joined', username);
function displayMessage(data) {
  try {
    const messageElement = document.createElement('div');
    messageElement.id = data.id || '';
    messageElement.className = 'message';
    
    if (data.isError) {
      messageElement.classList.add('error');
    } else if (data.isSending) {
      messageElement.classList.add('sending');
    }
    
    const time = new Date(data.timestamp).toLocaleTimeString();
    messageElement.innerHTML = `
      <span class="username">${escapeHtml(data.username)}</span>
      <span class="time">${time}</span>
      <div class="message-content">${escapeHtml(data.message)}</div>
    `;
    
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
    
    // Auto-hide system messages after 5 seconds
    if (data.username === 'System' && !data.isError) {
      setTimeout(() => {
        messageElement.style.opacity = '0.7';
      }, 3000);
    }
  } catch (error) {
    console.error('Error displaying message:', error);
  }
}

// Helper function to escape HTML
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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