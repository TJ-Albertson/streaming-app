import React from 'react';

const StreamVideo = () => {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.src = 'http://localhost:8000'; // Replace with the URL of your video stream
      video.play();
    }
  }, []);

  return (
    <video ref={videoRef} controls />
  );
};

export default StreamVideo;