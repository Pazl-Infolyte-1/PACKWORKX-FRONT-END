import React from 'react'

const ProductsPage = ({ showPage }) => {
  return (
    <div>
      <section className="landing-page-header">
        <div className="landing-container">
          <h1>PackWorkX Product Suite</h1>
          <p>Modular solutions designed for every aspect of your manufacturing business</p>
        </div>
      </section>

      <section className="landing-container">
        <div className="landing-pricing-grid">
          <div className="landing-pricing-card">
            <h3>PackWorkX CRM</h3>
            <div className="landing-price">Core Module</div>
            <ul className="landing-features-list">
              <li>Customer Management</li>
              <li>Lead Tracking</li>
              <li>Communication History</li>
              <li>Contact Management</li>
              <li>Sales Pipeline</li>
              <li>Task Management</li>
            </ul>
            <button className="landing-btn landing-btn-primary" onClick={() => showPage('demo')}>Learn More</button>
          </div>

          <div className="landing-pricing-card">
            <h3>PackWorkX Production</h3>
            <div className="landing-price">Manufacturing</div>
            <ul className="landing-features-list">
              <li>Production Scheduling</li>
              <li>Machine Management</li>
              <li>Capacity Planning</li>
              <li>Work Order Management</li>
              <li>Quality Control</li>
              <li>Performance Tracking</li>
            </ul>
            <button className="landing-btn landing-btn-primary" onClick={() => showPage('demo')}>Learn More</button>
          </div>

          <div className="landing-pricing-card">
            <h3>PackWorkX Inventory</h3>
            <div className="landing-price">Supply Chain</div>
            <ul className="landing-features-list">
              <li>Raw Material Tracking</li>
              <li>Stock Management</li>
              <li>Supplier Management</li>
              <li>Purchase Orders</li>
              <li>Warehouse Management</li>
              <li>Reorder Automation</li>
            </ul>
            <button className="landing-btn landing-btn-primary" onClick={() => showPage('demo')}>Learn More</button>
          </div>

          <div className="landing-pricing-card">
            <h3>PackWorkX Analytics</h3>
            <div className="landing-price">Business Intelligence</div>
            <ul className="landing-features-list">
              <li>Real-time Dashboards</li>
              <li>Custom Reports</li>
              <li>KPI Tracking</li>
              <li>Predictive Analytics</li>
              <li>Performance Metrics</li>
              <li>Export & Integration</li>
            </ul>
            <button className="landing-btn landing-btn-primary" onClick={() => showPage('demo')}>Learn More</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductsPage
