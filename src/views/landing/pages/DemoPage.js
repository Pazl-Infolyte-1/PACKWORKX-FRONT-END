import React from 'react'

const DemoPage = ({ createDemo }) => {
  return (
    <div>
      <section className="landing-auth-container">
        <div className="landing-auth-form">
          <h2>Schedule Your Free Demo</h2>
          <p style={{textAlign: 'center', marginBottom: '2rem', color: '#666'}}>See PackWorkX in action with a personalized demonstration</p>
          <form onSubmit={createDemo}>
            <div className="landing-form-group">
              <label htmlFor="demo-company">Company Name</label>
              <input type="text" id="demo-company" name="company" required />
            </div>
            <div className="landing-form-group">
              <label htmlFor="demo-name">Full Name</label>
              <input type="text" id="demo-name" name="name" required />
            </div>
            <div className="landing-form-group">
              <label htmlFor="demo-email">Email Address</label>
              <input type="email" id="demo-email" name="email" required />
            </div>
            <div className="landing-form-group">
  <label htmlFor="demo-phone">Phone Number</label>
  <input 
    type="tel" 
    id="demo-phone" 
    name="phone" 
    pattern="[0-9]{10}" 
    maxLength="10"
    title="Please enter only numbers exactly 10 digits"
    required 
  />
</div>
            <div className="landing-form-group">
              <label htmlFor="demo-role">Your Role</label>
              <select id="demo-role" name="role" required>
                <option value="">Select...</option>
                <option value="Business Owner">Business Owner</option>
                <option value="Operations Manager">Operations Manager</option>
                <option value="Sales Manager">Sales Manager</option>
                <option value="IT Manager">IT Manager</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="landing-form-group">
              <label htmlFor="demo-time">Preferred Demo Time</label>
              <select id="demo-time" name="time" required>
                <option value="">Select...</option>
                <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                <option value="Afternoon (12 PM - 5 PM)">Afternoon (12 PM - 5 PM)</option>
                <option value="Evening (5 PM - 8 PM)">Evening (5 PM - 8 PM)</option>
              </select>
            </div>
            <div className="landing-form-group">
              <label htmlFor="demo-message">Tell us about your needs</label>
              <textarea id="demo-message" name="message" rows="3" placeholder="What specific challenges are you looking to solve?"></textarea>
            </div>
            <div className="landing-form-group">
              <button type="submit" className="landing-btn landing-btn-primary width-100">Schedule Demo</button>
            </div>
            <div style={{textAlign: 'center', marginTop: '1rem'}}>
              <p>Prefer to call? <strong>+1 (555) 123-4567</strong></p>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default DemoPage
