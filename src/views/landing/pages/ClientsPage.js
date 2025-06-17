import React from 'react'

const ClientsPage = () => {
  return (
    <div>
      <section className="landing-page-header">
        <div className="landing-container">
          <h1>Trusted by Industry Leaders</h1>
          <p>Join hundreds of corrugated box manufacturers who trust PackWorkX</p>
        </div>
      </section>

      <section className="landing-container">
        <div className="landing-clients-grid">
          <div className="landing-client-card">
            <div className="landing-client-logo">AB</div>
            <h3>Atlantic Box Co.</h3>
            <p>"PackWorkX increased our efficiency by 40% and reduced order processing time significantly."</p>
            <small>- John Smith, Operations Manager</small>
          </div>
          <div className="landing-client-card">
            <div className="landing-client-logo">PM</div>
            <h3>Premier Manufacturing</h3>
            <p>"The best investment we've made. Customer management has never been easier."</p>
            <small>- Sarah Johnson, CEO</small>
          </div>
          <div className="landing-client-card">
            <div className="landing-client-logo">CC</div>
            <h3>Coastal Corrugated</h3>
            <p>"Production planning module helped us optimize our manufacturing process completely."</p>
            <small>- Mike Davis, Production Head</small>
          </div>
          <div className="landing-client-card">
            <div className="landing-client-logo">IP</div>
            <h3>Industrial Packaging</h3>
            <p>"ROI was visible within the first quarter. Highly recommended for growing businesses."</p>
            <small>- Lisa Chen, CFO</small>
          </div>
          <div className="landing-client-card">
            <div className="landing-client-logo">BS</div>
            <h3>BoxSmart Solutions</h3>
            <p>"Customer support is exceptional and the system is incredibly user-friendly."</p>
            <small>- Robert Wilson, IT Director</small>
          </div>
          <div className="landing-client-card">
            <div className="landing-client-logo">EP</div>
            <h3>Elite Packaging</h3>
            <p>"Inventory management features saved us thousands in material costs."</p>
            <small>- Amanda Rodriguez, Inventory Manager</small>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ClientsPage
