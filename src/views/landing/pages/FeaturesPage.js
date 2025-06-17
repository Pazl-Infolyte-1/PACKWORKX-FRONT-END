import React from 'react'

const FeaturesPage = () => {
  return (
    <div>
      <section className="landing-page-header">
        <div className="landing-container">
          <h1>Comprehensive Features</h1>
          <p>Everything you need to manage your corrugated box manufacturing business</p>
        </div>
      </section>

      <section className="landing-container">
        <div className="landing-features-grid">
          <div className="landing-feature-card">
            <div className="landing-feature-icon">📋</div>
            <h3>Customer Relationship Management</h3>
            <p>Complete customer profiles, communication history, contact management, and relationship tracking with detailed interaction logs.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">📦</div>
            <h3>Order & Sales Management</h3>
            <p>End-to-end order processing from inquiry to delivery with automated workflows, status tracking, and delivery confirmations.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">🏭</div>
            <h3>Production Planning & Scheduling</h3>
            <p>Advanced production scheduling, capacity planning, machine allocation, and resource optimization for maximum efficiency.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">💰</div>
            <h3>Quote & Pricing Management</h3>
            <p>Automated quote generation with dynamic pricing, cost calculations, margin analysis, and approval workflows.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">📊</div>
            <h3>Business Intelligence & Analytics</h3>
            <p>Real-time dashboards, KPI tracking, sales reports, production analytics, and predictive insights for better decisions.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">📦</div>
            <h3>Inventory & Raw Material Management</h3>
            <p>Complete inventory control, raw material tracking, stock level monitoring, and automated reorder point management.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">🚚</div>
            <h3>Supply Chain Management</h3>
            <p>Supplier management, procurement workflows, delivery tracking, and vendor performance monitoring.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">💳</div>
            <h3>Financial Management</h3>
            <p>Invoicing, payment tracking, financial reporting, cost analysis, and integration with accounting systems.</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-icon">🔧</div>
            <h3>Quality Control & Compliance</h3>
            <p>Quality management workflows, compliance tracking, inspection records, and certification management.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FeaturesPage
