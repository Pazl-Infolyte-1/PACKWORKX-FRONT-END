import React, { useState, useRef, useEffect } from 'react'
import './AdvancedSupportChatbot.css'
import './ChatbotPositionOverride.css'

const AdvancedSupportChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your PackWorkX AI assistant. I can help you with:\n\n• Product information\n• Pricing questions\n• Demo scheduling\n• Technical support\n• Account assistance\n\nHow can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'welcome'
    }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [userSession, setUserSession] = useState({
    id: Date.now(),
    name: '',
    email: '',
    company: '',
    isAuthenticated: false
  })
  const [conversationFlow, setConversationFlow] = useState('main')
  const [attachments, setAttachments] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [satisfaction, setSatisfaction] = useState(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Update unread count when minimized
  useEffect(() => {
    if (isMinimized && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.sender === 'bot') {
        setUnreadCount(prev => prev + 1)
      }
    } else {
      setUnreadCount(0)
    }
  }, [isMinimized, messages])

  // Enhanced knowledge base with intent classification
  const knowledgeBase = {
    greetings: {
      keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'start', 'begin'],
      responses: [
        "Hello! 👋 Welcome to PackWorkX support. I'm here to help you with anything related to our CRM system.",
        "Hi there! 🙂 Thanks for reaching out. What can I assist you with today?",
        "Hello! I'm your PackWorkX assistant. How can I make your day better?"
      ],
      followUp: ["What would you like to know about PackWorkX?", "Are you looking for information about our features, pricing, or support?"]
    },
    pricing: {
      keywords: ['price', 'cost', 'pricing', 'plan', 'subscription', 'fee', 'expensive', 'cheap', 'money', 'budget'],
      responses: [
        "💰 Our pricing is designed to scale with your business:\n\n🟢 **Starter** - $99/month\n• Perfect for small businesses\n• Up to 5 users\n• Core CRM features\n\n🔵 **Professional** - $299/month\n• Growing businesses\n• Up to 15 users\n• Advanced features + API\n\n🟡 **Enterprise** - $699/month\n• Large operations\n• Unlimited users\n• Custom integrations\n\nWould you like a detailed comparison or a personalized quote?",
        "Let me help you find the right plan! 📊 Our pricing starts at $99/month and scales with your needs. What size is your team?"
      ],
      followUp: ["Would you like to schedule a demo to see which plan works best?", "Do you have specific feature requirements I can help match to a plan?"]
    },
    features: {
      keywords: ['feature', 'functionality', 'what does', 'can it', 'capabilities', 'modules', 'function'],
      responses: [
        "🚀 PackWorkX offers comprehensive features for corrugated box manufacturers:\n\n📦 **Order Management**\n• Complete lifecycle tracking\n• Real-time status updates\n\n👥 **Customer Management**\n• 360° customer profiles\n• Communication history\n\n🏭 **Production Planning**\n• Advanced scheduling\n• Capacity optimization\n\n💰 **Quote Management**\n• Automated calculations\n• Approval workflows\n\n📊 **Analytics & Reports**\n• Real-time dashboards\n• Custom reporting\n\n📦 **Inventory Control**\n• Raw material tracking\n• Automated reordering\n\nWhich area interests you most?"
      ],
      followUp: ["Would you like me to explain any specific feature in detail?", "Are you looking to solve a particular business challenge?"]
    },
    demo: {
      keywords: ['demo', 'trial', 'test', 'try', 'preview', 'show me', 'see it', 'demonstration'],
      responses: [
        "🎯 I'd love to set up a personalized demo for you! Our demos are tailored to show exactly how PackWorkX can help your specific business needs.",
        "Great choice! 🌟 Our live demos typically last 30-45 minutes and cover your specific use cases. Let me gather some details to make it perfect for you."
      ],
      followUp: ["What's the best way to reach you for scheduling?", "What specific areas of your business are you looking to improve?"]
    },
    support: {
      keywords: ['help', 'support', 'problem', 'issue', 'bug', 'error', 'not working', 'broken', 'fix'],
      responses: [
        "🛠️ I'm here to help! Can you describe the specific issue you're experiencing? The more details you provide, the better I can assist you.",
        "Let me help you resolve that! 🔧 Our support team is available 24/7. What specific problem are you encountering?"
      ],
      followUp: ["Can you provide any error messages or screenshots?", "Would you prefer to continue here or connect with our technical team directly?"]
    },
    integration: {
      keywords: ['integrate', 'api', 'connect', 'import', 'export', 'sync', 'third party', 'software'],
      responses: [
        "🔗 PackWorkX offers robust integration capabilities! We can connect with:\n\n• Accounting software (QuickBooks, Xero, etc.)\n• ERP systems\n• E-commerce platforms\n• Email marketing tools\n• Custom APIs\n\nWhat system are you looking to integrate with?"
      ],
      followUp: ["Do you need help with a specific integration?", "Would you like to speak with our technical team about custom integrations?"]
    },
    contact: {
      keywords: ['contact', 'call', 'phone', 'email', 'reach', 'speak to someone', 'human', 'agent'],
      responses: [
        "📞 Here are the best ways to reach our team:\n\n**Sales**: +1 (555) 123-4567\n**Support**: support@packworkx.com\n**General**: info@packworkx.com\n\nI can also connect you with the right person right now! What type of assistance do you need?"
      ],
      followUp: ["Would you like me to schedule a callback?", "Should I transfer you to a specialist?"]
    },
    account: {
      keywords: ['account', 'login', 'password', 'access', 'user', 'profile', 'settings'],
      responses: [
        "🔐 For account-related issues, I can help with:\n\n• Password resets\n• User management\n• Account settings\n• Billing questions\n• Access permissions\n\nWhat specifically do you need help with?"
      ],
      followUp: ["Are you having trouble accessing your account?", "Do you need help with user permissions or billing?"]
    }
  }

  const emojis = ['👍', '👎', '😊', '😕', '❤️', '🎉', '🚀', '💡', '⚡', '🔥']

  const findBestResponse = (message) => {
    const lowerMessage = message.toLowerCase()
    let bestMatch = null
    let maxMatches = 0
    
    // Find the category with the most keyword matches
    for (const [category, data] of Object.entries(knowledgeBase)) {
      const matches = data.keywords.filter(keyword => lowerMessage.includes(keyword)).length
      if (matches > maxMatches) {
        maxMatches = matches
        bestMatch = { category, data }
      }
    }
    
    if (bestMatch && maxMatches > 0) {
      const responses = bestMatch.data.responses
      const followUps = bestMatch.data.followUp || []
      const response = responses[Math.floor(Math.random() * responses.length)]
      const followUp = followUps[Math.floor(Math.random() * followUps.length)]
      
      return { response, followUp, category: bestMatch.category }
    }
    
    // Default responses for unrecognized input
    const defaultResponses = [
      "I want to make sure I understand correctly. Could you provide a bit more detail about what you're looking for?",
      "That's an interesting question! Let me connect you with one of our specialists who can provide the best answer.",
      "I'd love to help you with that! Could you tell me a bit more about your specific situation?"
    ]
    
    return { 
      response: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
      followUp: "In the meantime, would you like to explore our pricing, schedule a demo, or speak with our support team?",
      category: 'general'
    }
  }

  const addMessage = (text, sender = 'user', options = {}) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      text,
      sender,
      timestamp: new Date(),
      ...options
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage
  }

  const simulateTyping = (duration = null) => {
    setIsTyping(true)
    const typingTime = duration || (500 + Math.random() * 1500) // 0.5-2 seconds
    return new Promise(resolve => {
      setTimeout(() => {
        setIsTyping(false)
        resolve()
      }, typingTime)
    })
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage = currentMessage.trim()
    setCurrentMessage('')
    
    // Add user message
    addMessage(userMessage, 'user')
    
    // Handle conversation flows
    if (conversationFlow !== 'main') {
      await handleConversationFlow(userMessage)
      return
    }
    
    // Simulate bot typing
    await simulateTyping()
    
    // Generate intelligent response
    const { response, followUp, category } = findBestResponse(userMessage)
    
    // Add bot response
    addMessage(response, 'bot', { category })
    
    // Add follow-up after a short delay
    if (followUp) {
      setTimeout(async () => {
        await simulateTyping(800)
        addMessage(followUp, 'bot', { type: 'followup' })
        
        // Add relevant quick actions
        setTimeout(() => {
          addMessage("", 'bot', { 
            quickActions: getQuickActionsForCategory(category)
          })
        }, 500)
      }, 1000)
    }
  }

  const getQuickActionsForCategory = (category) => {
    const actions = {
      pricing: ['View Pricing Details', 'Schedule Demo', 'Contact Sales'],
      demo: ['Schedule Now', 'Learn More Features', 'View Pricing'],
      features: ['Schedule Demo', 'View Pricing', 'Technical Questions'],
      support: ['Submit Ticket', 'Call Support', 'Live Chat'],
      integration: ['Technical Consultation', 'View API Docs', 'Contact Integration Team'],
      contact: ['Schedule Callback', 'Email Support', 'Live Transfer'],
      account: ['Reset Password', 'Contact Account Manager', 'Billing Support'],
      general: ['View Features', 'Pricing Info', 'Schedule Demo', 'Contact Support']
    }
    
    return actions[category] || actions.general
  }

  const handleQuickAction = async (action) => {
    addMessage(action, 'user')
    await simulateTyping()
    
    const actionResponses = {
      'View Pricing Details': "I'll show you our detailed pricing breakdown. Each plan is designed for different business sizes and needs.",
      'Schedule Demo': "Perfect! Let me help you schedule a personalized demo. What's your name?",
      'Contact Sales': "I'll connect you with our sales team right away. They can provide detailed quotes and answer specific questions.",
      'Schedule Now': "Great! I'll help you book a demo slot. What's your preferred time of day?",
      'Learn More Features': "I'd love to show you more features! Which area of your business needs the most attention?",
      'Technical Questions': "I can help with technical questions or connect you with our technical team. What would you like to know?",
      'Submit Ticket': "I'll help you submit a support ticket. Can you describe the issue you're experiencing?",
      'Call Support': "Our support number is +1 (555) 123-4567. They're available 24/7. Would you like me to arrange a callback instead?",
      'Live Chat': "You're already chatting with me! 😊 How can I help resolve your issue?",
      'Reset Password': "I can help you reset your password. Please provide your email address and I'll send you reset instructions.",
      'Contact Account Manager': "I'll connect you with your account manager. What's your company name?",
      'Billing Support': "For billing questions, I can help or transfer you to our billing team. What's your question about?"
    }
    
    const response = actionResponses[action] || "Let me help you with that! Can you provide more details?"
    addMessage(response, 'bot')
    
    // Set conversation flow based on action
    if (action.includes('Schedule')) {
      setConversationFlow('demo-scheduling')
    } else if (action.includes('Reset Password')) {
      setConversationFlow('password-reset')
    } else if (action.includes('Submit Ticket')) {
      setConversationFlow('ticket-creation')
    }
  }

  const handleConversationFlow = async (message) => {
    switch (conversationFlow) {
      case 'demo-scheduling':
        await handleDemoScheduling(message)
        break
      case 'password-reset':
        await handlePasswordReset(message)
        break
      case 'ticket-creation':
        await handleTicketCreation(message)
        break
    }
  }

  const handleDemoScheduling = async (message) => {
    if (!userSession.name) {
      setUserSession(prev => ({ ...prev, name: message }))
      await simulateTyping()
      addMessage(`Nice to meet you, ${message}! 👋 What's your email address?`, 'bot')
    } else if (!userSession.email) {
      setUserSession(prev => ({ ...prev, email: message }))
      await simulateTyping()
      addMessage("Great! And what's your company name?", 'bot')
    } else if (!userSession.company) {
      setUserSession(prev => ({ ...prev, company: message }))
      await simulateTyping()
      addMessage(`Perfect! Here's what I have:\n\n👤 **Name**: ${userSession.name}\n📧 **Email**: ${userSession.email}\n🏢 **Company**: ${message}\n\nOur sales team will contact you within 24 hours to schedule your personalized demo. Is there anything specific you'd like them to focus on?`, 'bot')
      
      setTimeout(() => {
        addMessage("", 'bot', {
          quickActions: ['Production Planning', 'Order Management', 'Customer Relations', 'Analytics & Reports', 'All Features']
        })
      }, 1000)
    } else {
      await simulateTyping()
      addMessage(`Thank you! I've noted that you're particularly interested in: **${message}**\n\n✅ Your demo request has been submitted!\n\nYou'll receive a confirmation email shortly, and our team will reach out to schedule the perfect time for your demo.\n\nIs there anything else I can help you with today?`, 'bot')
      setConversationFlow('main')
    }
  }

  const handlePasswordReset = async (message) => {
    if (message.includes('@')) {
      await simulateTyping()
      addMessage(`✅ Password reset instructions have been sent to **${message}**\n\nIf you don't see the email in a few minutes, please check your spam folder. The reset link will be valid for 24 hours.\n\nIs there anything else I can help you with?`, 'bot')
      setConversationFlow('main')
    } else {
      await simulateTyping()
      addMessage("Please provide a valid email address so I can send you the password reset instructions.", 'bot')
    }
  }

  const handleTicketCreation = async (message) => {
    await simulateTyping()
    addMessage(`📝 I've created support ticket **#${Date.now().toString().slice(-6)}** with the following details:\n\n**Issue**: ${message}\n**Priority**: Normal\n**Status**: Open\n\nOur support team will review this and respond within 2 hours during business hours.\n\nYou'll receive email updates at your registered email address. Is there anything else I can help you with?`, 'bot')
    setConversationFlow('main')
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }))
    
    setAttachments(prev => [...prev, ...newAttachments])
    addMessage(`📎 Uploaded: ${files.map(f => f.name).join(', ')}`, 'user', { attachments: newAttachments })
  }

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id))
  }

  const handleSatisfaction = async (rating) => {
    setSatisfaction(rating)
    await simulateTyping()
    if (rating >= 4) {
      addMessage("🎉 Thank you for the positive feedback! We're glad we could help. Is there anything else you need assistance with?", 'bot')
    } else {
      addMessage("😔 I'm sorry we didn't meet your expectations. Let me connect you with a human agent who can provide better assistance.", 'bot')
      setTimeout(() => {
        addMessage("", 'bot', {
          quickActions: ['Speak to Agent', 'Leave Feedback', 'Try Again']
        })
      }, 1000)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleChatbot = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
    setUnreadCount(0)
  }

  const minimizeChat = () => {
    setIsMinimized(true)
  }

  const maximizeChat = () => {
    setIsMinimized(false)
    setUnreadCount(0)
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <div 
        className={`advanced-chat-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleChatbot}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {unreadCount > 0 && (
              <div className="unread-badge">{unreadCount}</div>
            )}
          </>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className={`advanced-chat-window ${isMinimized ? 'minimized' : ''}`}>
          {/* Header */}
          <div className="advanced-chat-header">
            <div className="chat-header-info">
              <div className="advanced-chat-avatar">
                <span>AI</span>
              </div>
              <div>
                <h3>PackWorkX Assistant</h3>
                <span className="advanced-chat-status">
                  <span className="status-dot"></span>
                  Online • AI Powered
                </span>
              </div>
            </div>
            <div className="header-actions">
              <button 
                className="minimize-btn"
                onClick={minimizeChat}
                title="Minimize"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12L18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button 
                className="close-btn"
                onClick={toggleChatbot}
                title="Close"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Minimized View */}
          {isMinimized ? (
            <div className="minimized-content" onClick={maximizeChat}>
              <div className="minimized-text">
                <span>💬 Chat minimized</span>
                {unreadCount > 0 && <span className="unread-text">{unreadCount} new message{unreadCount > 1 ? 's' : ''}</span>}
              </div>
              <div className="expand-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="advanced-chat-messages">
                {messages.map((message) => (
                  <div key={message.id} className={`advanced-message ${message.sender}`}>
                    <div className="message-content">
                      <p>{message.text}</p>
                      
                      {message.attachments && (
                        <div className="message-attachments">
                          {message.attachments.map(att => (
                            <div key={att.id} className="attachment-item">
                              <span>📎 {att.name}</span>
                              <small>{formatFileSize(att.size)}</small>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {message.quickActions && (
                        <div className="quick-actions">
                          {message.quickActions.map((action, index) => (
                            <button
                              key={index}
                              className="quick-action-btn"
                              onClick={() => handleQuickAction(action)}
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="message-meta">
                      <span className="message-time">{formatTime(message.timestamp)}</span>
                      {message.sender === 'bot' && !satisfaction && messages.indexOf(message) === messages.length - 1 && (
                        <div className="satisfaction-rating">
                          <span>Was this helpful?</span>
                          <div className="rating-buttons">
                            {[1, 2, 3, 4, 5].map(rating => (
                              <button
                                key={rating}
                                onClick={() => handleSatisfaction(rating)}
                                className="rating-btn"
                                title={`${rating} star${rating > 1 ? 's' : ''}`}
                              >
                                ⭐
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="advanced-message bot">
                    <div className="message-content">
                      <div className="advanced-typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Attachments Preview */}
              {attachments.length > 0 && (
                <div className="attachments-preview">
                  {attachments.map(att => (
                    <div key={att.id} className="attachment-preview">
                      <span>📎 {att.name}</span>
                      <button onClick={() => removeAttachment(att.id)}>×</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="advanced-chat-input-container">
                <div className="input-toolbar">
                  <button 
                    className="toolbar-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach file"
                  >
                    📎
                  </button>
                  <button 
                    className="toolbar-btn"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    title="Add emoji"
                  >
                    😊
                  </button>
                  {showEmojiPicker && (
                    <div className="emoji-picker">
                      {emojis.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => {
                            setCurrentMessage(prev => prev + emoji)
                            setShowEmojiPicker(false)
                          }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="advanced-chat-input">
                  <textarea
                    ref={inputRef}
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isTyping}
                    rows="1"
                    style={{
                      resize: 'none',
                      minHeight: '20px',
                      maxHeight: '100px',
                      height: 'auto'
                    }}
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={isTyping || !currentMessage.trim()}
                    className="advanced-send-btn"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 12L22 2L13 21L11 13L2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                />
                
                <p className="advanced-chat-footer">
                  🔒 Secure & Private • Powered by PackWorkX AI
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default AdvancedSupportChatbot
