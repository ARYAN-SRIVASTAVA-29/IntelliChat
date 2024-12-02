// import React, { useState, useEffect, useRef } from 'react';
// import ReactMarkdown from 'react-markdown';

// const { Prism: SyntaxHighlighter } = require('react-syntax-highlighter');
// const { atomDark } = require('react-syntax-highlighter/dist/cjs/styles/prism');

// const API_URL = 'https://api.openai.com/v1/chat/completions';
// import API_KEY from '../../apiKey';

// const ChatUI = () => {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const [typingMessage, setTypingMessage] = useState('');
//   const chatRef = useRef(null); // Reference for scrolling

//   const handleTypingEffect = (text) => {
//     let index = 0;
//     setTypingMessage('');

//     const typingInterval = setInterval(() => {
//       if (index < text.length) {
//         setTypingMessage((prev) => prev + text[index]);
//         index++;
//         scrollToBottom(); // Scroll during typing
//       } else {
//         clearInterval(typingInterval);
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           { role: 'assistant', content: text },
//         ]);
//         setTypingMessage('');
//         scrollToBottom(); // Scroll after typing completes
//       }
//     }, 50);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newMessages = [...messages, { role: 'user', content: message }];
//     setMessages(newMessages);
//     setMessage('');
//     scrollToBottom(); // Scroll after adding user message

//     const lowercaseMessage = message.toLowerCase();

//     if (
//       lowercaseMessage.includes('who are you') ||
//       lowercaseMessage.includes('what is your name') ||
//       lowercaseMessage.includes('tell me about yourself')
//     ) {
//       const predefinedResponse =
//         "I am IntelliChat, an AI assistant developed by Aryan. How can I assist you today?";
//       handleTypingEffect(predefinedResponse);
//       return;
//     }

//     try {
//       const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${API_KEY}`,
//         },
//         body: JSON.stringify({
//           model: 'gpt-4o-mini',
//           messages: [
//             { role: 'system', content: 'You are a helpful assistant.' },
//             ...newMessages,
//           ],
//         }),
//       });

//       const data = await response.json();
//       const assistantMessage = data.choices[0].message.content;

//       if (!typingMessage) {
//         handleTypingEffect(assistantMessage);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const scrollToBottom = () => {
//     if (chatRef.current) {
//       chatRef.current.scrollTop = chatRef.current.scrollHeight;
//     }
//   };

//   useEffect(() => {
//     const initialMessage = 'Hello, I am IntelliChat made by Aryan. How can I assist you today?';
//     setMessages([{ role: 'assistant', content: initialMessage }]);
//     scrollToBottom();
//   }, []);

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       {/* Header with Logo */}
//       <div className="sticky top-0 z-10 bg-white shadow-md p-4 border-b border-gray-300 flex items-center">
//         <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
//         <h1 className="text-lg font-bold">IntelliChat</h1>
//       </div>

//       {/* Chat History */}
//       <div
//         ref={chatRef}
//         className="flex-grow p-4 overflow-y-auto scroll-auto"
//       >
//         <div className="space-y-6">
//           {messages.map(({ role, content }, index) => (
//             <div
//               key={index}
//               className="mx-auto w-[80%] text-left"
//             >
//               <div className="text-lg text-gray-900 font-medium">
//                 <div className="flex items-center mb-2">
//                   {role === 'assistant' && (
//                     <img
//                       src="/logo.png"
//                       alt="IntelliChat Logo"
//                       className="h-5 w-5 mr-2"
//                     />
//                   )}
//                   <span className="font-bold">
//                     {role === 'user' ? 'YOU:' : 'IntelliChat:'}
//                   </span>
//                 </div>
//                 {role === 'assistant' ? (
//                   <ReactMarkdown
//                     components={{
//                       code({ inline, className, children, ...props }) {
//                         const match = /language-(\w+)/.exec(className || '');
//                         return !inline && match ? (
//                           <SyntaxHighlighter
//                             style={atomDark}
//                             language={match[1]}
//                             PreTag="div"
//                             {...props}
//                           >
//                             {String(children).replace(/\n$/, '')}
//                           </SyntaxHighlighter>
//                         ) : (
//                           <code className={className} {...props}>
//                             {children}
//                           </code>
//                         );
//                       },
//                     }}
//                   >
//                     {content}
//                   </ReactMarkdown>
//                 ) : (
//                   <p>{content}</p>
//                 )}
//               </div>
//             </div>
//           ))}
//           {typingMessage && (
//             <div className="mx-auto w-[80%] text-left">
//               <div className="text-lg text-gray-900 font-medium">
//                 <div className="flex items-center mb-2">
//                   <img
//                     src="/logo.png"
//                     alt="IntelliChat Logo"
//                     className="h-5 w-5 mr-2"
//                   />
//                   <span className="font-bold">IntelliChat:</span>
//                 </div>
//                 <ReactMarkdown
//                   components={{
//                     code({ inline, className, children, ...props }) {
//                       const match = /language-(\w+)/.exec(className || '');
//                       return !inline && match ? (
//                         <SyntaxHighlighter
//                           style={atomDark}
//                           language={match[1]}
//                           PreTag="div"
//                           {...props}
//                         >
//                           {String(children).replace(/\n$/, '')}
//                         </SyntaxHighlighter>
//                       ) : (
//                         <code className={className} {...props}>
//                           {children}
//                         </code>
//                       );
//                     },
//                   }}
//                 >
//                   {typingMessage}
//                 </ReactMarkdown>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Input Section */}
//       <div className="border-t border-gray-300 p-4 bg-white">
//         <form className="flex" onSubmit={handleSubmit}>
//           <input
//             type="text"
//             className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Type your message..."
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none"
//           >
//             Send
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatUI;


import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const { Prism: SyntaxHighlighter } = require('react-syntax-highlighter');
const { atomDark } = require('react-syntax-highlighter/dist/cjs/styles/prism');

const API_URL = 'https://api.openai.com/v1/chat/completions';
import API_KEY from '../../apiKey';

const ChatUI = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [typingMessage, setTypingMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false); // Track typing state
  const typingIntervalRef = useRef(null); // Ref to hold the typing interval
  const chatRef = useRef(null); // Reference for scrolling

  const handleTypingEffect = (text) => {
    let index = 0;
    setTypingMessage('');
    setIsTyping(true); // Set typing state to true

    typingIntervalRef.current = setInterval(() => {
      if (index < text.length) {
        setTypingMessage((prev) => prev + text[index]);
        index++;
        scrollToBottom(); // Scroll during typing
      } else {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        setIsTyping(false); // Typing is complete
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'assistant', content: text },
        ]);
        setTypingMessage('');
        scrollToBottom(); // Scroll after typing completes
      }
    }, 50);
  };

  const handleStopTyping = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;

      // Save the partially typed message
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: typingMessage },
      ]);

      setTypingMessage(''); // Clear the typing message
      setIsTyping(false); // Reset typing state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMessages = [...messages, { role: 'user', content: message }];
    setMessages(newMessages);
    setMessage('');
    scrollToBottom(); // Scroll after adding user message

    const lowercaseMessage = message.toLowerCase();

    if (
      lowercaseMessage.includes('who are you') ||
      lowercaseMessage.includes('what is your name') ||
      lowercaseMessage.includes('tell me about yourself')
    ) {
      const predefinedResponse =
        "I am IntelliChat, an AI assistant developed by Aryan. How can I assist you today?";
      handleTypingEffect(predefinedResponse);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            ...newMessages,
          ],
        }),
      });

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;

      if (!typingMessage) {
        handleTypingEffect(assistantMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const initialMessage =
      'Hello, I am IntelliChat made by Aryan. How can I assist you today?';
    setMessages([{ role: 'assistant', content: initialMessage }]);
    scrollToBottom();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header with Logo */}
      <div className="sticky top-0 z-10 bg-white shadow-md p-4 border-b border-gray-300 flex items-center">
        <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
        <h1 className="text-lg font-bold">IntelliChat</h1>
      </div>

      {/* Chat History */}
      <div ref={chatRef} className="flex-grow p-4 overflow-y-auto scroll-auto">
        <div className="space-y-6">
          {messages.map(({ role, content }, index) => (
            <div key={index} className="mx-auto w-[80%] text-left">
              <div className="text-lg text-gray-900 font-medium">
                <div className="flex items-center mb-2">
                  {role === 'assistant' && (
                    <img
                      src="/logo.png"
                      alt="IntelliChat Logo"
                      className="h-5 w-5 mr-2"
                    />
                  )}
                  <span className="font-bold">
                    {role === 'user' ? 'YOU:' : 'IntelliChat:'}
                  </span>
                </div>
                {role === 'assistant' ? (
                  <ReactMarkdown
                    components={{
                      code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={atomDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                ) : (
                  <p>{content}</p>
                )}
              </div>
            </div>
          ))}
          {typingMessage && (
            <div className="mx-auto w-[80%] text-left">
              <div className="text-lg text-gray-900 font-medium">
                <div className="flex items-center mb-2">
                  <img
                    src="/logo.png"
                    alt="IntelliChat Logo"
                    className="h-5 w-5 mr-2"
                  />
                  <span className="font-bold">IntelliChat:</span>
                </div>
                <ReactMarkdown
                  components={{
                    code({ inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={atomDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {typingMessage}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-300 p-4 bg-white flex">
        <form className="flex-grow flex" onSubmit={handleSubmit}>
          <input
            type="text"
            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none"
          >
            Send
          </button>
        </form>
        {isTyping && (
          <button
            onClick={handleStopTyping}
            className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatUI;



