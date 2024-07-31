const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve the HTML files and static assets
app.use(express.static('public'));

// Serve status.html at the root URL
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/status.html')));

// Serve video1.html and video2.html
app.get('/video1.html', (req, res) => res.sendFile(path.join(__dirname, 'public/video1.html')));
app.get('/video2.html', (req, res) => res.sendFile(path.join(__dirname, 'public/video2.html')));
app.get('/video3.html', (req, res) => res.sendFile(path.join(__dirname, 'public/video3.html')));

// WebSocket server logic
wss.on('connection', (ws) => {
    console.log('Client connected');
    

    ws.on('message', (message) => {
        if (Buffer.isBuffer(message)) {
            message = message.toString();
        }

        console.log('Received:', message);

        // Broadcast the message to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Start the HTTP server on port 3000 and bind to all available IP addresses
const PORT = 8080;
const IP_ADDRESS = '0.0.0.0'; // Bind to all available IP addresses

server.listen(PORT, IP_ADDRESS, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
