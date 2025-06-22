import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSend, FiDroplet, FiHome, FiInfo, FiClock, FiTrash2 } from 'react-icons/fi';
import waterAnimation from './water-animation.mp4';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'AI',
      text: "💧 Hi! I'm AquaGuard, your water conservation assistant. Ask me how to save water or get personalized tips!"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const quickActions = [
    { text: "💧 Water saving tips", action: () => navigate('/tips') },
    { text: "📊 Calculate my usage", action: () => navigate('/usage') },
    { text: "🚰 Report a leak", action: () => handleSendMessage("How do I report a water leak?") },
    { text: "🍂 Seasonal advice", action: () => handleSendMessage("What seasonal water saving tips do you have?") },
    { text: "🏠 Appliance recommendations", action: () => handleSendMessage("What water efficient appliances do you recommend?") }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    setMessages(prev => [...prev, { sender: 'You', text: message }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      if (response.ok && data.response) {
        setMessages(prev => [...prev, { sender: 'AI', text: data.response }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { sender: 'AI', text: `⚠️ ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { sender: 'AI', text: "⚠️ Unexpected response from server." }]);
      }
    } catch (error) {
      console.error('API error:', error);
      setMessages(prev => [...prev, {
        sender: 'AI',
        text: "⚠️ Sorry, I'm having trouble connecting to the server. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: 'AI',
        text: "💧 Hi! I'm AquaGuard, your water conservation assistant. Ask me how to save water or get personalized tips!"
      }
    ]);
  };

  return (
    <div style={styles.container}>
      <div style={styles.waterAnimation}>
        <video autoPlay loop muted style={styles.video}>
          <source src={waterAnimation} type="video/mp4" />
        </video>
      </div>

      <div style={styles.header}>
        <div style={styles.logo}>
          <FiDroplet size={32} />
          <h1 style={styles.title}>AquaGuard</h1>
        </div>
        <p style={styles.subtitle}>Your Water Conservation Assistant</p>
      </div>

      <div style={styles.navTabs}>
        <button style={{ ...styles.tabButton, ...styles.activeTab }}><FiHome /> Chat</button>
        <button style={styles.tabButton} onClick={() => navigate('/usage')}><FiInfo /> Usage</button>
        <button style={styles.tabButton} onClick={() => navigate('/tips')}><FiClock /> Tips</button>
      </div>

      <div style={styles.chatContainer}>
        <div style={styles.messages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                ...(msg.sender === 'You' ? styles.userMessage : styles.aiMessage)
              }}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.quickActions}>
          <div style={styles.quickActionsHeader}>
            <h3 style={styles.quickActionsTitle}>💧 Quick actions:</h3>
            <button style={styles.clearButton} onClick={handleClearChat}>
              <FiTrash2 /> Clear Chat
            </button>
          </div>
          <div style={styles.quickActionsGrid}>
            {quickActions.map((qa, index) => (
              <button key={index} onClick={qa.action} style={styles.quickActionButton}>{qa.text}</button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.inputContainer}>
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about saving water..."
            style={styles.input}
            disabled={isLoading}
          />
          <button type="submit" style={styles.sendButton} disabled={isLoading}>
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    overflow: 'hidden',
    fontFamily: 'Segoe UI, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  },
  waterAnimation: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    opacity: 0.15,
    filter: 'blur(2px)',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  header: {
    textAlign: 'center',
    padding: '20px',
    background: 'linear-gradient(to right, #0077b6, #00b4d8)',
    color: 'white',
    zIndex: 1,
    position: 'relative',
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
  },
  title: {
    fontSize: '2rem',
    margin: 0,
  },
  subtitle: {
    marginTop: '5px',
    fontSize: '1rem',
  },
  navTabs: {
    display: 'flex',
    justifyContent: 'center',
    background: '#00b4d8',
    zIndex: 1,
    padding: '10px 0',
  },
  tabButton: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '1rem',
    margin: '0 10px',
    cursor: 'pointer',
    padding: '10px 20px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  activeTab: {
    background: 'rgba(255,255,255,0.2)',
  },
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    zIndex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    background: 'rgba(255,255,255,0.95)',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 0 8px rgba(0,0,0,0.1)',
    marginBottom: '15px',
  },
  message: {
    padding: '10px 15px',
    borderRadius: '10px',
    marginBottom: '10px',
    whiteSpace: 'pre-line',
    maxWidth: '70%',
  },
  userMessage: {
    backgroundColor: '#e0f7fa',
    alignSelf: 'flex-end',
    marginLeft: 'auto',
    color: '#006064',
  },
  aiMessage: {
    backgroundColor: '#f1f8e9',
    alignSelf: 'flex-start',
    marginRight: 'auto',
    color: '#33691e',
  },
  inputContainer: {
    display: 'flex',
    background: 'white',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 0 5px rgba(0,0,0,0.1)',
  },
  input: {
    flex: 1,
    border: '1px solid #ccc',
    borderRadius: '6px',
    padding: '10px',
    fontSize: '1rem',
    outline: 'none',
  },
  sendButton: {
    marginLeft: '10px',
    background: '#00b4d8',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  quickActions: {
    background: 'rgba(255,255,255,0.9)',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '15px',
  },
  quickActionsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickActionsTitle: {
    marginBottom: '10px',
    color: '#00796b',
    fontWeight: 'bold',
  },
  clearButton: {
    background: '#ef5350',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  quickActionsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px',
  },
  quickActionButton: {
    flex: '1 1 180px',
    background: 'linear-gradient(to right, #0077b6, #00b4d8)',
    color: 'white',
    padding: '10px 12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

export default Chat;
