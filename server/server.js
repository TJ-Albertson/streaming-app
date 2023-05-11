const express = require("express");
const path = require('path');
const cors = require("cors");
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the React application on all routes except API endpoints
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
