import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Button } from "@/components/ui/button";

const socket = io("http://localhost:8000"); // Adjust for your backend

const ChatComponent = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (sessionId) {
      // Join the session's chat room
      socket.emit("join_session", sessionId);

      // Listen for incoming messages
      socket.on("receive_message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    // Clean up on unmount
    return () => {
      socket.emit("leave_session", sessionId);
      socket.off("receive_message");
    };
  }, [sessionId]);

  const sendMessage = () => {
    if (input.trim()) {
      const message = { sessionId, content: input, timestamp: new Date() };
      socket.emit("send_message", message);
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput("");
    }
  };

  return (
    <div className="chat-component">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <span>{msg.content}</span>
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
      />
      <Button onClick={sendMessage}>Send</Button>
    </div>
  );
};

export default ChatComponent;
