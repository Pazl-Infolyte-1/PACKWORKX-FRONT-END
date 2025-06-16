import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'
import { AdvancedSupportChatbot } from '../../components/chatbot'

// Import individual page components
import Header from './components/Header'
import HomePage from './pages/HomePage'
import FeaturesPage from './pages/FeaturesPage'
import ProductsPage from './pages/ProductsPage'
import PricingPage from './pages/PricingPage'
import IndustriesPage from './pages/IndustriesPage'
import ClientsPage from './pages/ClientsPage'
import ResourcesPage from './pages/ResourcesPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import DemoPage from './pages/DemoPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import Footer from './components/Footer'

const LandingPage = () => {
  const [activePage, setActivePage] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const showPage = (pageId) => {
    setActivePage(pageId)
    window.scrollTo(0, 0)
    setMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleFormSubmit = (e, message = 'Thank you! Your submission has been received. We will contact you soon.') => {
    e.preventDefault()
    alert(message)
  }

  const handleSignIn = (e) => {
    e.preventDefault()
    // Redirect to your existing login page
    navigate('/login')
  }

  const renderActivePage = () => {
    const pageProps = { showPage, handleFormSubmit, handleSignIn }
    
    switch (activePage) {
      case 'home':
        return <HomePage {...pageProps} />
      case 'features':
        return <FeaturesPage {...pageProps} />
      case 'products':
        return <ProductsPage {...pageProps} />
      case 'pricing':
        return <PricingPage {...pageProps} />
      case 'industries':
        return <IndustriesPage {...pageProps} />
      case 'clients':
        return <ClientsPage {...pageProps} />
      case 'resources':
        return <ResourcesPage {...pageProps} />
      case 'about':
        return <AboutPage {...pageProps} />
      case 'contact':
        return <ContactPage {...pageProps} />
      case 'demo':
        return <DemoPage {...pageProps} />
      case 'signin':
        return <SignInPage {...pageProps} />
      case 'signup':
        return <SignUpPage {...pageProps} />
      default:
        return <HomePage {...pageProps} />
    }
  }

  return (
    <div className="landing-page">
      <Header 
        showPage={showPage} 
        mobileMenuOpen={mobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu} 
      />
      
      <main className="landing-content">
        {renderActivePage()}
      </main>
      
      <Footer />
      
      {/* Support Chatbot */}
      <AdvancedSupportChatbot />
    </div>
  )
}

export default LandingPage
