import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import videojs from 'video.js';

const socket = io();

const VideoPlayer = () => {
  const [player, setPlayer] = useState(null);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    socket.on('metadata', (data) => {
      setMetadata(data);
    });

    socket.on('data', (chunk) => {
      if (player) {
        player.src({ type: 'video/mp4', src: URL.createObjectURL(new Blob([chunk])) });
      }
    });

    socket.on('end', () => {
      if (player) {
        player.dispose();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [player]);

  useEffect(() => {
    if (metadata) {
      const vjsPlayer = videojs('video-player', {
        controls: true,
        autoplay: true,
        preload: 'auto',
        sources: [{ type: 'video/mp4', src: '' }]
      });

      setPlayer(vjsPlayer);
    }
  }, [metadata]);

  return (
    <div>
      {metadata && (
        <div>
          <video id="video-player" className="video-js" />
          <p>Duration: {metadata.duration}</p>
          <p>Size: {metadata.size}</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
