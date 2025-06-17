import React from 'react'

const ResourcesPage = () => {
  return (
    <div>
      <section className="landing-page-header">
        <div className="landing-container">
          <h1>Resources & Support</h1>
          <p>Everything you need to succeed with PackWorkX</p>
        </div>
      </section>

      <section className="landing-container">
        <div className="landing-features-grid">
          <div className="landing-feature-card">
            <div className="landing-feature-icon">📚</div>
            <h3>Knowledge Base</h3>
            <p>Comprehensive documentation, user guides, and step-by-step tutorials to help you get the most out of PackWorkX.</p>
            <button className="landing-btn landing-btn-primary" style={{marginTop: '1rem'}}>Browse Articles</button>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">🎓</div>
            <h3>Training & Webinars</h3>
            <p>Live training sessions, recorded webinars, and certification programs to master the platform.</p>
            <button className="landing-btn landing-btn-primary" style={{marginTop: '1rem'}}>View Schedule</button>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">📊</div>
            <h3>Case Studies</h3>
            <p>Real-world success stories and implementation case studies from manufacturing companies like yours.</p>
            <button className="landing-btn landing-btn-primary" style={{marginTop: '1rem'}}>Read Stories</button>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">🔧</div>
            <h3>API Documentation</h3>
            <p>Complete API reference, integration guides, and developer resources for custom implementations.</p>
            <button className="landing-btn landing-btn-primary" style={{marginTop: '1rem'}}>View Docs</button>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">💬</div>
            <h3>Community Forum</h3>
            <p>Connect with other PackWorkX users, share best practices, and get answers from the community.</p>
            <button className="landing-btn landing-btn-primary" style={{marginTop: '1rem'}}>Join Forum</button>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">📞</div>
            <h3>Support Center</h3>
            <p>24/7 technical support, ticket system, and direct access to our expert support team.</p>
            <button className="landing-btn landing-btn-primary" style={{marginTop: '1rem'}}>Get Support</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ResourcesPage
