const express = require('express');
const fs = require('fs');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const dashMPD = '../videos/output.mpd'

let counter = 0;
let intervalId;

function startCounter() {
  intervalId = setInterval(() => {
    counter++;
    console.log(counter);
  }, 1000);
}

function pauseCounter() {
  clearInterval(intervalId);
}

function resetCounter() {
  counter = 0;
  console.log(counter);
}
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/stream.mpd', (req, res) => {

  res.header('Content-Type', 'application/dash+xml');
  fs.createReadStream(dashMPD).pipe(res);

});

app.get('/chunk-stream:chunk-:part.m4s', (req, res) => {

  const chunkPath = `../videos/chunk-stream${req.params.chunk}-${req.params.part}.m4s`;

  res.header('Content-Type', 'video/iso.segment');
  fs.createReadStream(chunkPath).pipe(res);

});

app.get('/init-stream:number.m4s', (req, res) => {

  const initPath = `../videos/init-stream${req.params.number}.m4s`;
  
  res.header('Content-Type', 'video/iso.segment');
  fs.createReadStream(initPath).pipe(res);
});


// socket
const videoSocket = io.of("/video");

videoSocket.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Handle play event
  socket.on('play', () => {
    console.log('Play event received from:', socket.id);
    // Broadcast play event to all other clients
    startCounter()
    videoSocket.emit('play', counter);
  });
  
  // Handle pause event
  socket.on('pause', () => {
    console.log('Pause event received from:', socket.id);
    // Broadcast pause event to all other clients
    pauseCounter()
    videoSocket.emit('pause');
  });

  socket.on('video end', () => {
    console.log('video end event received from:', socket.id);
    // Broadcast pause event to all other clients
    pauseCounter()
    resetCounter()
  });
  
  // Handle seek event
  socket.on('seek', () => {
    console.log('Seek event received from:', socket.id, 'time:', counter);
    // Broadcast seek event to all other clients
    videoSocket.emit('seek', counter);
  });
});








server.listen(3000, () => {
  console.log('Server started on port 3000');
});
