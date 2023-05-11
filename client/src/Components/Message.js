import React, { useState } from "react";

function Message() {
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    const response = await fetch("/api/message");
    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div>
      <button onClick={handleClick}>Get Message</button>
      <p>{message}</p>
    </div>
  );
}

export default Message;
