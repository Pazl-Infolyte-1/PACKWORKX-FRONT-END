import React from 'react'

const SignUpPage = ({ showPage, handleFormSubmit }) => {
  return (
    <div>
      <section className="landing-auth-container">
        <div className="landing-auth-form">
          <h2>Start Your Free Trial</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="landing-form-group">
              <label htmlFor="company">Company Name</label>
              <input type="text" id="company" name="company" required />
            </div>
            <div className="landing-form-group">
              <label htmlFor="fullname">Full Name</label>
              <input type="text" id="fullname" name="fullname" required />
            </div>
            <div className="landing-form-group">
              <label htmlFor="signup-email">Email Address</label>
              <input type="email" id="signup-email" name="email" required />
            </div>
            <div className="landing-form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" required />
            </div>
            <div className="landing-form-group">
              <label htmlFor="employees">Number of Employees</label>
              <select id="employees" name="employees" required>
                <option value="">Select...</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="200+">200+</option>
              </select>
            </div>
            <div className="landing-form-group">
              <label htmlFor="signup-password">Password</label>
              <input type="password" id="signup-password" name="password" required />
            </div>
            <div className="landing-form-group">
              <button type="submit" className="landing-btn landing-btn-primary width-100">Start Free Trial</button>
            </div>
            <div style={{textAlign: 'center', marginTop: '1rem'}}>
              <p>Already have an account? <a href="#" onClick={() => showPage('signin')} style={{color: '#e67e22'}}>Sign in here</a></p>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default SignUpPage
