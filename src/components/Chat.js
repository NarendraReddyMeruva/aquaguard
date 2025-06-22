import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSend, FiDroplet, FiHome, FiClock, FiTrash2,
  FiUser, FiChevronDown, FiLogOut
} from 'react-icons/fi';
import waterAnimation from './water-animation.mp4';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'AI',
      text: "💧 Hi! I'm AquaGuard, your water conservation assistant. Ask me how to save water or get personalized tips!"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [user, setUser] = useState(null);

  const messagesEndRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const quickActions = [
    { text: "💧 Water saving tips", action: () => navigate('/tips') },
    { text: "📊 Calculate my usage", action: () => navigate('/usage') },
    { text: "🚰 Report a leak", action: () => handleSendMessage("How do I report a water leak?") },
    { text: "🍂 Seasonal advice", action: () => handleSendMessage("What seasonal water saving tips do you have?") },
    { text: "🏠 Appliance recommendations", action: () => handleSendMessage("What water efficient appliances do you recommend?") }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowProfileDropdown(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.waterAnimation}>
        <video autoPlay loop muted style={styles.video}>
          <source src={waterAnimation} type="video/mp4" />
        </video>
      </div>

      <div style={styles.navBar}>
        <div style={styles.logoContainer}>
          <FiDroplet size={28} style={styles.logoIcon} />
          <h1 style={styles.logoText}>AquaGuard</h1>
        </div>

        <div style={styles.navTabs}>
          <button className="nav-tab" onClick={() => navigate('/chat')}>
            <FiHome size={18} /> Chat
          </button>

          <button className="nav-tab" onClick={() => navigate('/tips')}>
            <FiClock size={18} /> Tips
          </button>
        </div>

        <div style={styles.profileContainer} ref={profileRef}>
          <button
            style={styles.profileButton}
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            aria-haspopup="true"
            aria-expanded={showProfileDropdown}
          >
            <div style={styles.profileIcon}><FiUser size={20} /></div>
            <span style={styles.profileName}>{user?.displayName || user?.email || 'User'}</span>
            <FiChevronDown
              size={16}
              style={{
                transform: showProfileDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            />
          </button>

          {showProfileDropdown && (
            <div style={styles.dropdownMenu} role="menu">
              <div style={styles.dropdownHeader}>
                <div style={styles.dropdownIcon}><FiUser size={18} /></div>
                <span style={styles.dropdownName}>{user?.displayName || user?.email || 'User'}</span>
              </div>
              <button
                style={styles.dropdownSignOut}
                onClick={handleSignOut}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d62828'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#e63946'}
              >
                <FiLogOut size={16} style={{ marginRight: '8px' }} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat UI */}
      <div style={styles.chatArea}>
        <div style={styles.chatContainer}>
          <div style={styles.messagesContainer}>
            <div style={styles.messages}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.message,
                    ...(msg.sender === 'You' ? styles.userMessage : styles.aiMessage)
                  }}
                >
                  <div style={styles.messageSender}>{msg.sender}:</div>
                  <div style={styles.messageText}>{msg.text}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div style={styles.quickActions}>
            <div style={styles.quickActionsHeader}>
              <h3 style={styles.quickActionsTitle}>💧 Quick actions:</h3>
              <button style={styles.clearButton} onClick={handleClearChat}>
                <FiTrash2 size={16} /> Clear Chat
              </button>
            </div>
            <div style={styles.quickActionsGrid}>
              {quickActions.map((qa, index) => (
                <button key={index} onClick={qa.action} style={styles.quickActionButton}>
                  {qa.text}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ ...styles.inputContainer, ...(isLoading ? styles.inputContainerActive : {}) }}>
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about saving water..."
              style={styles.input}
              disabled={isLoading}
            />
            <button
              type="submit"
              style={{ ...styles.sendButton, ...(isLoading ? styles.sendButtonLoading : {}) }}
              disabled={isLoading}
              aria-label="Send message"
            >
              <FiSend size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    overflow: 'hidden',
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f7fa',
  },
  waterAnimation: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    opacity: 0.7,
    filter: 'blur(1px)',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  navBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    height: '72px',
    backgroundColor: '#0077b6',
    color: '#fff',
    boxShadow: '0 2px 15px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
    position: 'relative',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  logoIcon: {
    color: '#ffffff',
    flexShrink: 0,
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: 0,
    color: '#ffffff',
  },
  navTabs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    flex: 1,
    maxWidth: '500px',
  },
  profileContainer: {
    position: 'relative',
  },
  profileButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: '500',
    fontSize: '0.95rem',
  },
  profileIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontWeight: '500',
    fontSize: '0.95rem',
    whiteSpace: 'nowrap',
    maxWidth: '130px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dropdownMenu: {
    position: 'absolute',
    right: 0,
    top: 'calc(100% + 8px)',
    width: '220px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    color: '#333',
    padding: '12px',
    zIndex: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  dropdownHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  dropdownIcon: {
    color: '#0077b6',
  },
  dropdownName: {
    fontWeight: '600',
    fontSize: '1rem',
    flexGrow: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  dropdownSignOut: {
    backgroundColor: '#e63946',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'background-color 0.2s ease',
  },
  navTab: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    borderRadius: '8px',
    transition: 'background-color 0.2s ease',
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    padding: '16px 24px',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 1,
  },
  chatContainer: {
    width: '100%',
    maxWidth: '960px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    position: 'relative',
  },
  messages: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minHeight: '100%',
  },
  message: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '18px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.9)',
    lineHeight: 1.4,
  },
  userMessage: {
    backgroundColor: '#caf0f8',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '4px',
  },
  aiMessage: {
    backgroundColor: '#90e0ef',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '4px',
  },
  messageSender: {
    fontWeight: '700',
    marginBottom: '6px',
    fontSize: '0.9rem',
    color: '#023e8a',
  },
  messageText: {
    whiteSpace: 'pre-wrap',
    fontSize: '1rem',
  },
  quickActions: {
    backgroundColor: 'skyblue',
    padding: '14px',
    borderRadius: '12px',
    margin: '8px 16px 0',
  },
  quickActionsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  quickActionsTitle: {
    margin: 0,
    fontWeight: '600',
    color: '#0077b6',
  },
  clearButton: {
    backgroundColor: '#f94144',
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  quickActionsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  },
  quickActionButton: {
    flex: '1 1 150px',
    backgroundColor: '#0077b6',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  inputContainer: {
    margin: '16px',
    display: 'flex',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
  },
  inputContainerActive: {
    backgroundColor: '#cce7ff',
  },
  input: {
    flex: 1,
    padding: '14px 18px',
    borderRadius: '30px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outline: 'none',
  },
  sendButton: {
    backgroundColor: '#0077b6',
    border: 'none',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
  },
  sendButtonLoading: {
    backgroundColor: '#023e8a',
    cursor: 'not-allowed',
  }
};

export default Chat;