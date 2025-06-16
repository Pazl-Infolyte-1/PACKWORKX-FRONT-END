import React from 'react'

const IndustriesPage = () => {
  return (
    <div>
      <section className="landing-page-header">
        <div className="landing-container">
          <h1>Industries We Serve</h1>
          <p>Specialized solutions for different manufacturing segments</p>
        </div>
      </section>

      <section className="landing-container">
        <div className="landing-clients-grid">
          <div className="landing-client-card">
            <div className="landing-client-logo">📦</div>
            <h3>Corrugated Box Manufacturing</h3>
            <p>Complete CRM solution designed specifically for corrugated box manufacturers with industry-specific workflows and templates.</p>
          </div>
          <div className="landing-client-card">
            <div className="landing-client-logo">📋</div>
            <h3>Cardboard Packaging</h3>
            <p>Streamlined processes for cardboard packaging companies with custom order management and production planning tools.</p>
          </div>
          <div className="landing-client-card">
            <div className="landing-client-logo">🏭</div>
            <h3>Paper Converting</h3>
            <p>Specialized features for paper converting operations including roll management, waste tracking, and quality control.</p>
          </div>
          <div className="landing-client-card">
            <div className="landing-client-logo">📄</div>
            <h3>Folding Carton</h3>
            <p>Advanced tools for folding carton manufacturers with die management, setup optimization, and run efficiency tracking.</p>
          </div>
          <div className="landing-client-card">
            <div className="landing-client-logo">🎁</div>
            <h3>Custom Packaging</h3>
            <p>Flexible solutions for custom packaging providers with design management, prototype tracking, and client collaboration tools.</p>
          </div>
          <div className="landing-client-card">
            <div className="landing-client-logo">♻️</div>
            <h3>Sustainable Packaging</h3>
            <p>Green manufacturing features with sustainability tracking, material sourcing, and environmental compliance reporting.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default IndustriesPage
