import React, { useState, useEffect } from 'react';

import VideoPlayer from './Components/VideoPlayer';
import videoplayer2 from './Components/videoplayer2';

import io from 'socket.io-client';

const socket = io('http://localhost:5000');


function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [videoId, setVideoId] = useState(null)

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages([...messages, msg]);
    });
  }, [messages]);

  function playVideo(e, videoId){
    e.preventDefault()
    setVideoId(videoId)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    socket.emit('chat message', inputValue);
    setInputValue('');
  };

  return (
    <div>
      <videoplayer2/>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
