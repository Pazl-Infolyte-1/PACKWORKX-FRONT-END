import React from 'react'

const PricingPage = ({ showPage }) => {
  return (
    <div>
      <section className="landing-page-header">
        <div className="landing-container">
          <h1>Choose Your Plan</h1>
          <p>Flexible pricing options designed to grow with your business</p>
        </div>
      </section>

      <section className="landing-container">
        <div className="landing-pricing-grid">
          <div className="landing-pricing-card">
            <h3>Starter</h3>
            <div className="landing-price">$99<span style={{fontSize: '1rem'}}>/month</span></div>
            <ul className="landing-features-list">
              <li>Customer Management</li>
              <li>Basic Order Processing</li>
              <li>Quote Generation</li>
              <li>5 Users</li>
              <li>Email Support</li>
              <li>Basic Reports</li>
            </ul>
            <button className="landing-btn landing-btn-primary" onClick={() => showPage('signup')}>Get Started</button>
          </div>

          <div className="landing-pricing-card featured">
            <h3>Professional</h3>
            <div className="landing-price">$299<span style={{fontSize: '1rem'}}>/month</span></div>
            <ul className="landing-features-list">
              <li>All Starter Features</li>
              <li>Production Planning</li>
              <li>Inventory Management</li>
              <li>Advanced Analytics</li>
              <li>15 Users</li>
              <li>Priority Support</li>
              <li>API Access</li>
              <li>Custom Workflows</li>
            </ul>
            <button className="landing-btn landing-btn-primary" onClick={() => showPage('signup')}>Most Popular</button>
          </div>

          <div className="landing-pricing-card">
            <h3>Enterprise</h3>
            <div className="landing-price">$699<span style={{fontSize: '1rem'}}>/month</span></div>
            <ul className="landing-features-list">
              <li>All Professional Features</li>
              <li>Multi-Location Support</li>
              <li>Advanced Integrations</li>
              <li>Custom Reports</li>
              <li>Unlimited Users</li>
              <li>24/7 Phone Support</li>
              <li>Dedicated Account Manager</li>
              <li>Custom Development</li>
            </ul>
            <button className="landing-btn landing-btn-primary" onClick={() => showPage('contact')}>Contact Sales</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PricingPage
