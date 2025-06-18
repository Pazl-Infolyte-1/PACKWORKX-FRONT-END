import React from 'react'

const Header = ({ showPage, mobileMenuOpen, toggleMobileMenu ,setPackageName}) => {
  return (
    <header className="landing-header">
      <nav className="landing-nav">
        <div className="landing-logo">PackWorkX</div>
        <ul className={`landing-nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <li><a onClick={() => showPage('home')}>Home</a></li>
          <li><a onClick={() => showPage('features')}>Features</a></li>
          <li><a onClick={() => showPage('products')}>Products</a></li>
          <li><a onClick={() => showPage('pricing')}>Pricing</a></li>
          <li><a onClick={() => showPage('industries')}>Industries</a></li>
          <li><a onClick={() => showPage('clients')}>Clients</a></li>
          <li><a onClick={() => showPage('resources')}>Resources</a></li>
          <li><a onClick={() => showPage('about')}>About</a></li>
          <li><a onClick={() => showPage('contact')}>Contact</a></li>
        </ul>
        <div className="landing-auth-buttons">
          <a href="#" className="landing-btn landing-btn-secondary" onClick={() => showPage('demo')}>Free Demo</a>
          <a href="#" className="landing-btn landing-btn-secondary" onClick={() => showPage('signin')}>Sign In</a>
          <a href="#" className="landing-btn landing-btn-primary" onClick={() => {showPage('signup')
            setPackageName("Free")
          }}>Start Free Trial</a>
        </div>
        <button className="landing-mobile-menu-toggle" onClick={toggleMobileMenu}>☰</button>
      </nav>
    </header>
  )
}

export default Header
