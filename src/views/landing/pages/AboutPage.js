import React from 'react'

const AboutPage = () => {
  return (
    <div>
      <section className="landing-page-header">
        <div className="landing-container">
          <h1>About PackWorkX</h1>
          <p>Revolutionizing manufacturing operations since 2015</p>
        </div>
      </section>

      <section className="landing-container" style={{padding: '4rem 0'}}>
        <div className="landing-contact-content">
          <div style={{background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'}}>
            <h3>Our Mission</h3>
            <p style={{marginBottom: '2rem'}}>At PackWorkX, we're dedicated to empowering corrugated box manufacturers with cutting-edge CRM technology that streamlines operations, enhances customer relationships, and drives business growth.</p>
            
            <h3>Our Story</h3>
            <p style={{marginBottom: '2rem'}}>Founded in 2015 by industry veterans who understood the unique challenges facing packaging manufacturers, PackWorkX was born from the need for a specialized CRM solution that truly understands the manufacturing process.</p>

            <h3>Why Choose PackWorkX?</h3>
            <ul style={{marginLeft: '2rem', marginBottom: '2rem'}}>
              <li style={{marginBottom: '0.5rem'}}>Industry-specific features designed by manufacturing experts</li>
              <li style={{marginBottom: '0.5rem'}}>Proven track record with 500+ successful implementations</li>
              <li style={{marginBottom: '0.5rem'}}>Dedicated support team with manufacturing experience</li>
              <li style={{marginBottom: '0.5rem'}}>Continuous innovation based on customer feedback</li>
            </ul>
          </div>

          <div style={{background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'}}>
            <h3>Company Stats</h3>
            <div style={{textAlign: 'center', margin: '2rem 0'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem'}}>
                <div>
                  <div style={{fontSize: '3rem', color: '#e67e22', fontWeight: 'bold'}}>500+</div>
                  <div>Active Clients</div>
                </div>
                <div>
                  <div style={{fontSize: '3rem', color: '#e67e22', fontWeight: 'bold'}}>10M+</div>
                  <div>Orders Processed</div>
                </div>
                <div>
                  <div style={{fontSize: '3rem', color: '#e67e22', fontWeight: 'bold'}}>99.9%</div>
                  <div>Uptime Guarantee</div>
                </div>
                <div>
                  <div style={{fontSize: '3rem', color: '#e67e22', fontWeight: 'bold'}}>24/7</div>
                  <div>Customer Support</div>
                </div>
              </div>
            </div>

            <h3>Our Team</h3>
            <p>Our team combines deep manufacturing industry knowledge with cutting-edge technology expertise to deliver solutions that truly understand your business needs.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
