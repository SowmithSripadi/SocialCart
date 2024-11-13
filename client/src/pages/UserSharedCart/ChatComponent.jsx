// ChatComponent.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

const socket = io("http://localhost:8000"); // Adjust the backend URL

const ChatComponent = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (sessionId) {
      socket.emit("join_session", sessionId);

      socket.on("receive_message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      socket.emit("leave_session", sessionId);
      socket.off("receive_message");
    };
  }, [sessionId]);

  const sendMessage = () => {
    if (input.trim()) {
      const message = {
        sessionId,
        senderId: user.id,
        senderName: user.name,
        type: "text",
        content: input,
        timestamp: new Date(),
      };
      socket.emit("send_message", message);
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput("");
    }
  };

  const handleProductShare = (product) => {
    const message = {
      sessionId,
      senderId: user.id,
      senderName: user.name,
      type: "product",
      content: product, // Product object or ID
      timestamp: new Date(),
    };
    socket.emit("send_message", message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <div className="chat-component flex flex-col h-full">
      <div className="messages flex-1 overflow-auto">
        {messages.map((msg, index) => (
          <div key={index} className="message mb-2">
            <span>
              <strong>{msg.senderName}:</strong>{" "}
              {msg.type === "text" ? (
                msg.content
              ) : (
                <div>
                  <p>Shared a product:</p>
                  {/* Render product details */}
                </div>
              )}
            </span>
            <small className="text-gray-500 ml-2">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </small>
          </div>
        ))}
      </div>
      <div className="input-area mt-2 flex">
        <input
          className="flex-1 border rounded p-2"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <Button onClick={sendMessage} className="ml-2">
          Send
        </Button>
      </div>
      {/* Future product sharing UI */}
      {/* <Button onClick={() => handleProductShare(selectedProduct)}>Share Product</Button> */}
    </div>
  );
};

export default ChatComponent;
