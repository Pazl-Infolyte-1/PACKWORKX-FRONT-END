import React, { useState, useRef, useEffect } from 'react'
import './SupportChatbot.css'

const SupportChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your PackWorkX assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    company: ''
  })
  const [showContactForm, setShowContactForm] = useState(false)
  const [currentFlow, setCurrentFlow] = useState('main')
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Knowledge base for automated responses
  const knowledgeBase = {
    greetings: {
      keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
      responses: [
        "Hello! Welcome to PackWorkX support. How can I assist you today?",
        "Hi there! I'm here to help with any questions about PackWorkX.",
        "Hello! Thanks for reaching out. What can I help you with?"
      ]
    },
    pricing: {
      keywords: ['price', 'cost', 'pricing', 'plan', 'subscription', 'fee', 'expensive', 'cheap'],
      responses: [
        "Our pricing starts at $99/month for the Starter plan. We also have Professional ($299/month) and Enterprise ($699/month) plans. Would you like me to show you the detailed pricing page?",
        "We offer flexible pricing plans starting from $99/month. Each plan includes different features. Would you like to schedule a demo to discuss which plan fits your needs?"
      ]
    },
    features: {
      keywords: ['feature', 'functionality', 'what does', 'can it', 'capabilities', 'modules'],
      responses: [
        "PackWorkX includes Customer Management, Order Processing, Production Planning, Quote Management, Analytics, and Inventory Control. Which specific feature are you interested in?",
        "Our system offers comprehensive CRM features designed for corrugated box manufacturers. Would you like me to explain any specific module in detail?"
      ]
    },
    demo: {
      keywords: ['demo', 'trial', 'test', 'try', 'preview', 'show me'],
      responses: [
        "I'd be happy to help you schedule a free demo! Our demos are personalized to show you exactly how PackWorkX can help your business. Would you like me to connect you with our sales team?",
        "Great! We offer free personalized demos. I can help you schedule one right now. What's the best time for you?"
      ]
    },
    support: {
      keywords: ['help', 'support', 'problem', 'issue', 'bug', 'error', 'not working'],
      responses: [
        "I'm here to help! Can you tell me more about the specific issue you're experiencing?",
        "Our support team is available 24/7. Could you provide more details about what you need help with?"
      ]
    },
    integration: {
      keywords: ['integrate', 'api', 'connect', 'import', 'export', 'sync'],
      responses: [
        "PackWorkX offers robust API integration capabilities. We can connect with your existing accounting, ERP, and other business systems. Would you like to speak with our technical team?",
        "Yes, we support various integrations including accounting software, ERP systems, and custom APIs. What system are you looking to integrate with?"
      ]
    },
    contact: {
      keywords: ['contact', 'call', 'phone', 'email', 'reach', 'speak to someone'],
      responses: [
        "You can reach our team at +1 (555) 123-4567 or sales@packworkx.com. Would you prefer I connect you with someone right now?",
        "I can help you get in touch with the right person. Are you looking for sales, support, or technical assistance?"
      ]
    }
  }

  const quickReplies = [
    { text: "Pricing Plans", action: "pricing" },
    { text: "Schedule Demo", action: "demo" },
    { text: "Features", action: "features" },
    { text: "Contact Sales", action: "contact" },
    { text: "Technical Support", action: "support" }
  ]

  const findBestResponse = (message) => {
    const lowerMessage = message.toLowerCase()
    
    for (const [category, data] of Object.entries(knowledgeBase)) {
      const match = data.keywords.some(keyword => lowerMessage.includes(keyword))
      if (match) {
        const responses = data.responses
        return responses[Math.floor(Math.random() * responses.length)]
      }
    }
    
    // Default response if no match found
    return "I understand you're asking about something specific. Let me connect you with one of our specialists who can provide detailed assistance. Would you like me to arrange that?"
  }

  const addMessage = (text, sender = 'user', options = {}) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date(),
      ...options
    }
    setMessages(prev => [...prev, newMessage])
  }

  const simulateTyping = () => {
    setIsTyping(true)
    return new Promise(resolve => {
      setTimeout(() => {
        setIsTyping(false)
        resolve()
      }, 1000 + Math.random() * 1000) // 1-2 seconds
    })
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage = currentMessage.trim()
    setCurrentMessage('')
    
    // Add user message
    addMessage(userMessage, 'user')
    
    // Simulate bot typing
    await simulateTyping()
    
    // Generate and add bot response
    const botResponse = findBestResponse(userMessage)
    addMessage(botResponse, 'bot')
    
    // Add quick replies after certain responses
    if (botResponse.includes('demo') || botResponse.includes('schedule')) {
      setTimeout(() => {
        addMessage("", 'bot', { quickReplies: ['Schedule Now', 'Learn More', 'Contact Sales'] })
      }, 500)
    }
  }

  const handleQuickReply = async (reply) => {
    addMessage(reply, 'user')
    await simulateTyping()
    
    switch (reply.toLowerCase()) {
      case 'pricing plans':
        addMessage("Here are our pricing plans:\n\n💼 Starter - $99/month\n• Customer Management\n• Basic Order Processing\n• 5 Users\n\n🚀 Professional - $299/month\n• All Starter features\n• Production Planning\n• 15 Users\n\n🏢 Enterprise - $699/month\n• All Professional features\n• Multi-location support\n• Unlimited users\n\nWould you like to schedule a demo to see which plan fits your needs?", 'bot')
        break
      case 'schedule demo':
      case 'schedule now':
        addMessage("Perfect! I'd love to schedule a demo for you. I'll need a few details to set this up. What's your name?", 'bot')
        setCurrentFlow('demo-name')
        break
      case 'features':
        addMessage("PackWorkX includes these powerful features:\n\n📦 Order Management\n👥 Customer Relationship Management\n🏭 Production Planning & Scheduling\n💰 Quote & Pricing Management\n📊 Business Intelligence & Analytics\n📦 Inventory & Raw Material Management\n\nWhich feature would you like to know more about?", 'bot')
        break
      case 'contact sales':
        addMessage("I'll connect you with our sales team right away! You can reach them at:\n\n📞 Phone: +1 (555) 123-4567\n📧 Email: sales@packworkx.com\n\nOr I can collect your information and have someone call you back. What would you prefer?", 'bot')
        break
      case 'technical support':
        addMessage("For technical support, you can:\n\n🎯 Submit a ticket through our support portal\n📞 Call our 24/7 support line: +1 (555) 123-4567\n📧 Email: support@packworkx.com\n\nWhat kind of technical issue are you experiencing?", 'bot')
        break
      default:
        addMessage("Thanks for that information. How else can I help you today?", 'bot')
    }
  }

  const handleDemoFlow = async (message) => {
    switch (currentFlow) {
      case 'demo-name':
        setUserInfo(prev => ({ ...prev, name: message }))
        addMessage(`Nice to meet you, ${message}! What's your email address?`, 'bot')
        setCurrentFlow('demo-email')
        break
      case 'demo-email':
        setUserInfo(prev => ({ ...prev, email: message }))
        addMessage("Great! And what's your company name?", 'bot')
        setCurrentFlow('demo-company')
        break
      case 'demo-company':
        setUserInfo(prev => ({ ...prev, company: message }))
        addMessage(`Perfect! I have your details:\n\n👤 Name: ${userInfo.name}\n📧 Email: ${userInfo.email}\n🏢 Company: ${message}\n\nOur sales team will contact you within 24 hours to schedule your personalized demo. Is there anything specific you'd like them to focus on during the demo?`, 'bot')
        setCurrentFlow('main')
        break
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (currentFlow !== 'main') {
        handleDemoFlow(currentMessage)
        setCurrentMessage('')
      } else {
        handleSendMessage()
      }
    }
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <div 
        className={`chat-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {!isOpen && (
          <div className="chat-notification">
            <span>Need help?</span>
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <span>PX</span>
              </div>
              <div>
                <h3>PackWorkX Support</h3>
                <span className="chat-status">
                  <span className="status-dot"></span>
                  Online
                </span>
              </div>
            </div>
            <button 
              className="chat-close"
              onClick={() => setIsOpen(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-content">
                  <p>{message.text}</p>
                  {message.quickReplies && (
                    <div className="quick-replies">
                      {message.quickReplies.map((reply, index) => (
                        <button
                          key={index}
                          className="quick-reply-btn"
                          onClick={() => handleQuickReply(reply)}
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="quick-replies-container">
              <p>Quick options:</p>
              <div className="quick-replies">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    className="quick-reply-btn"
                    onClick={() => handleQuickReply(reply.text)}
                  >
                    {reply.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="chat-input-container">
            <div className="chat-input">
              <input
                ref={inputRef}
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isTyping}
              />
              <button 
                onClick={currentFlow !== 'main' ? () => {
                  handleDemoFlow(currentMessage)
                  setCurrentMessage('')
                } : handleSendMessage}
                disabled={isTyping || !currentMessage.trim()}
                className="send-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 12L22 2L13 21L11 13L2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <p className="chat-footer">
              Powered by PackWorkX • We typically reply in a few minutes
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default SupportChatbot
