const express = require("express");
const range = require('range-parser');
const app = require("express")();
const path = require('path');
const cors = require("cors");
const fs = require('fs');
const http = require('http').Server(app);;
const http2 = require('http');
const socketIO = require('socket.io');
const io = require('socket.io')(http);
const { spawn } = require('child_process');

const { createReadStream } = require('fs');

const ffmpeg = require('fluent-ffmpeg');
//ffmpeg.setFfmpegPath('//wsl.localhost/Ubuntu/usr/bin/ffmpeg');
//ffmpeg.setFfprobePath("/usr/bin/ffprobe");

const videoPath = 'videos/video2.mp4';

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the React application on all routes except API endpoints
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


const streamPort = 8000;

const videoSize = fs.statSync(videoPath).size;

const server = http2.createServer();
server.listen(streamPort, () => {
  console.log(`Server is listening on port ${streamPort}`);
});

server.on('request', (req, res) => {
  const rangeHeader = req.headers.range || 'bytes=0-';
  const ranges = range(rangeHeader, videoSize);

  const videoStream = fs.createReadStream(videoPath, { start: ranges[0].start, end: ranges[0].end });
  videoStream.pipe(res);

  res.statusCode = 206;
  res.setHeader('Content-Range', `bytes ${ranges[0].start}-${ranges[0].end}/${videoSize}`);
  res.setHeader('Content-Length', ranges[0].end - ranges[0].start + 1);
  res.setHeader('Content-Type', 'video/mp4');
});





const chatSocket = io.of('/chat');
chatSocket.on('connection', (socket) => {
  console.log('New Chat client connected');

  socket.on('chat message', msg => {
    console.log("Chat: " + msg);
    socket.emit('chat message', msg);
  });
});





app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from the server!" });
});


//










const videoFileMap={
  'video01':'videos/video1.mp4',
  'video02':'videos/video2.mp4'  
}

app.get('/api/videos/:filename', (req, res)=>{
  const fileName = req.params.filename;
  const filePath = videoFileMap[fileName];
  if(!filePath){
      return res.status(404).send('File not found')
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if(range){
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, {start, end});
      const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4'
      };
      res.writeHead(206, head);
      file.pipe(res);
  }
  else{
      const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4'
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res)
  }
})

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
