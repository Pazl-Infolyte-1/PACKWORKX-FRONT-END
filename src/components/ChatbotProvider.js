import React from 'react'
import { SupportChatbot } from './chatbot'

/**
 * ChatbotProvider - Global chatbot component for the entire application
 * Add this component to your main layout to have chatbot available everywhere
 */
const ChatbotProvider = ({ children, enableChatbot = true, position = 'bottom-right' }) => {
  if (!enableChatbot) {
    return children
  }

  return (
    <>
      {children}
      <SupportChatbot position={position} />
    </>
  )
}

export default ChatbotProvider
