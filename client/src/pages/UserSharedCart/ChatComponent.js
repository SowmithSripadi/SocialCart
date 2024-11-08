
// frontend/pages/ChatComponent.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with server URL if needed

const ChatComponent = ({ sessionId, userId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('join_session', sessionId);

    socket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  const sendMessage = () => {
    if (message.trim()) {
      const messageData = { sessionId, senderId: userId, messageContent: message };
      socket.emit('send_message', messageData);
      setMessages((prevMessages) => [
        ...prevMessages, { senderId: userId, messageContent: message, timestamp: new Date() }
      ]);
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.senderId === userId ? 'my-message' : 'other-message'}>
            <span>{msg.messageContent}</span>
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;
