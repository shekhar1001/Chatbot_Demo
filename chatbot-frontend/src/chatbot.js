import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Toggle chatbot popup

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Header text that disappears when chatbot opens and reappears after closing */}
      {!isOpen && <div className="chatbot-header">Want to know more?</div>}

      {/* Animated Chatbot Robot */}
      <div className="robot" onClick={toggleChatbot}>
        <div className="face">
          <div className="eye"></div>
          <div className="eye"></div>
        </div>
        <div className="mouth"></div>
        <div className="arms left-arm"></div>
        <div className="arms right-arm"></div>
        <div className="legs left-leg"></div>
        <div className="legs right-leg"></div>
      </div>

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
              onKeyDown={handleKeyDown}
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
