import React, { useState, useEffect } from 'react';

import io from 'socket.io-client';
import SocketVideo from './Components/SocketVideo';

const socket = io('http://localhost:5000/chat');


function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages([...messages, msg]);
    });
  }, [messages]);


  const handleSubmit = (event) => {
    event.preventDefault();
    socket.emit('chat message', inputValue);
    setInputValue('');
  };

  return (
    <div>
      <SocketVideo/>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
    </div>
  );
}

export default App;
