import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { getGroqChatCompletion } from '../../lib/groqClient';
import ReactMarkdown from 'react-markdown';
import './Chatbot.css';
import './typing.css';

export default function Chatbot() {
  const [sessionId] = useState(() => crypto.randomUUID());
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! I'm Harsh. Feel free to ask me anything about my projects, skills, or experience!", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [isShrunk, setIsShrunk] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // As the user scrolls down, squeeze the bar into a circular icon
  useEffect(() => {
    const onScroll = () => {
      const threshold = 160; // px from top before shrinking starts
      setIsShrunk(window.scrollY > threshold);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message immediately
    const userText = inputValue;
    const newUserMsg = { id: Date.now(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // Call Groq API with the full messages array and session ID for continuity/history tracking
    const botResponseText = await getGroqChatCompletion([...messages, newUserMsg], sessionId);
    
    // Add bot response
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      text: botResponseText,
      sender: 'bot'
    }]);
    setIsTyping(false);
  };

  return (
    <div
      ref={containerRef}
      className={`chatbot-container ${isShrunk ? 'chatbot-container--shrunk' : ''}`}
    >
      {/* Premium search-style bar at top center */}
      <button
        type="button"
        className="chat-search-shell"
        onClick={() => setIsOpen(true)}
        aria-label="Open chat with Harsh"
      >
        <div className="chat-search-icon">
          <MessageSquare size={18} />
        </div>
        <span className="chat-search-placeholder">
          Hii Harsh here .. lets interact
        </span>
      </button>

      {/* The Chat Interface (Glassmorphism) */}
      <div className={`chatbot-window glass-panel ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <div className="header-info">
            <div className="status-dot"></div>
            <h3>Harsh</h3>
          </div>
          <button 
            className="close-btn" 
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
              <div className="message-content">
                <ReactMarkdown
                  components={{
                    strong: ({children}) => (
                      <span style={{ color: "#6bdcff", fontWeight: 600 }}>
                        {children}
                      </span>
                    ),
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message-wrapper bot">
              <div className="message-content typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="chat-input glass-input"
          />
          <button 
            type="submit" 
            className="send-btn"
            disabled={!inputValue.trim()}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
