import React, { useState, useEffect } from 'react';

const ChatUI = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you?', sender: 'bot' }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (e) => {
    e.preventDefault();

    if (newMessage.trim() === '') {
      return;
    }

    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user'
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');

    setIsTyping(true);
    setTimeout(() => {
      simulateBotResponse('Thank you for your message!');
    }, 1000);
  };

  const simulateBotResponse = (responseText) => {
    let index = 0;
    let typingInterval = setInterval(() => {
      if (index < responseText.length) {
        setMessages((prevMessages) => {
          const botMessage = {
            id: prevMessages.length + 1,
            text: responseText.slice(0, index + 1),
            sender: 'bot'
          };
          return [...prevMessages.slice(0, -1), botMessage];
        });
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 50);
  };

  useEffect(() => {
    if (isTyping) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: '...', sender: 'bot' }
      ]);
    }
  }, [isTyping]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-10 bg-white shadow-md p-4 border-b border-gray-300">
        <h1 className="text-lg font-bold">Chat Application</h1>
      </div>

      {/* Chat History */}
      <div className="flex-grow p-4 overflow-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`p-4 rounded-lg shadow-md max-w-xs ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-300 text-gray-800 rounded-bl-none'
                }`}
              >
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-300 p-4 bg-white">
        <form className="flex" onSubmit={sendMessage}>
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatUI;



