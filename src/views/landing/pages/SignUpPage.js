import React from 'react'

const SignUpPage = ({ showPage, handleTrailFormSubmit, packageName }) => {
  return (
    <div>
      <section className="landing-auth-container">
        <div className="landing-auth-form">
          <h2>Start Your {packageName} Trial</h2>
          <form onSubmit={handleTrailFormSubmit}>
            <div className="landing-form-group">
              <label htmlFor="company">Company Name<span className="text-red-500">*</span></label>
              <input type="text" id="company" name="company" required />
            </div>
            <div className="landing-form-group">
              <label htmlFor="fullname">Full Name<span className="text-red-500">*</span></label>
              <input type="text" id="fullname" name="fullname" required />
            </div>
            <div className="landing-form-group">
              <label htmlFor="signup-email">Email Address<span className="text-red-500">*</span></label>
              <input type="email" id="signup-email" name="email" required />
            </div>
            <div className="landing-form-group">
              <label htmlFor="phone">Phone Number<span className="text-red-500">*</span></label>
              <input
                type="tel"
                id="phone"
                name="phone"
                pattern="[0-9]{10}"
                maxLength="10"
                title="Please enter only numbers exactly 10 digits"
                required
              />
            </div>
            <div className="landing-form-group">
              <label htmlFor="signup-password">Password<span className="text-red-500">*</span></label>
              <input type="password" id="signup-password" name="password" required />
            </div>
            <div className="landing-form-group">
              <button type="submit" className="landing-btn landing-btn-primary width-100">
                Start {packageName} Trial
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p>
                Already have an account?{' '}
                <a href="#" onClick={() => showPage('signin')} style={{ color: '#e67e22' }}>
                  Sign in here
                </a>
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default SignUpPage
