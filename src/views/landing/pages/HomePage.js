import React from 'react'

const HomePage = ({ showPage }) => {
  return (
    <div>
      <section className="landing-hero">
        <div className="landing-container">
          <h1>Revolutionize Your Corrugated Box Manufacturing</h1>
          <p>Complete CRM solution designed specifically for corrugated box manufacturers. Streamline operations, manage customers, and boost productivity.</p>
          <button className="landing-cta-button landing-btn" onClick={() => showPage('signup')}>Start Free Trial</button>
        </div>
      </section>

      <section className="landing-features">
        <div className="landing-container">
          <h2>Powerful Features for Your Business</h2>
          <div className="landing-features-grid">
            <div className="landing-feature-card">
              <div className="landing-feature-icon">📦</div>
              <h3>Order Management</h3>
              <p>Complete order lifecycle management from inquiry to delivery with real-time tracking and status updates.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-icon">👥</div>
              <h3>Customer Management</h3>
              <p>Comprehensive customer profiles, communication history, and relationship management tools.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-icon">📊</div>
              <h3>Production Planning</h3>
              <p>Advanced production scheduling, capacity planning, and resource optimization.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-icon">💰</div>
              <h3>Quote Management</h3>
              <p>Automated quote generation with pricing calculations and approval workflows.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-icon">📈</div>
              <h3>Analytics & Reports</h3>
              <p>Real-time dashboards and detailed reports for informed decision making.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-icon">🔄</div>
              <h3>Inventory Control</h3>
              <p>Raw material tracking, stock management, and automated reorder points.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
