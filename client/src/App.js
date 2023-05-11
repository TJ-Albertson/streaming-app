import logo from './logo.svg';
import './App.css';
import Message from './Components/Message';


import { useState } from 'react';
import VideoPlayer from './Components/VideoPlayer';


function App() {

  const [videoId, setVideoId] = useState(null)

  function playVideo(e, videoId){
    e.preventDefault()
    setVideoId(videoId)
  }

  return (
    <div className="App">
      {videoId && <VideoPlayer videoId={videoId}></VideoPlayer>} <br />
      <button onClick={(e)=>{playVideo(e, 'video01')}}>Play Video 1</button>
      <button onClick={(e)=>{playVideo(e, 'video02')}}>Play Video 2</button>
      <Message/>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
