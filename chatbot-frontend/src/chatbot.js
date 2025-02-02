import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);  // To manage the popup visibility

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { sender: 'user', text: input };
      setMessages([...messages, userMessage]);

      try {
        const response = await axios.post('http://localhost:5000/api/chat', { message: input });
        const botMessage = { sender: 'bot', text: response.data.reply };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error('Error fetching chatbot reply:', error);
        setMessages((prev) => [...prev, { sender: 'bot', text: "Error communicating with the server." }]);
      }

      setInput('');
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Button to toggle chatbot */}
      {!isOpen && (
        <button className="chat-toggle-button" onClick={toggleChatbot}>
          Chat with us
        </button>
      )}

      {/* Chatbot Popup */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbox">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me something..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
          <button className="close-chat" onClick={toggleChatbot}>X</button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;