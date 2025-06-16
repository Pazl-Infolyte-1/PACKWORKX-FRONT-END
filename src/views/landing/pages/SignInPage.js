import React from 'react'

const SignInPage = ({ showPage, handleSignIn }) => {
  return (
    <div>
      <section className="landing-auth-container">
        <div className="landing-auth-form">
          <h2>Sign In to PackWorkX</h2>
          <form onSubmit={handleSignIn}>
            <div className="landing-form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="landing-form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <div className="landing-form-group">
              <button type="submit" className="landing-btn landing-btn-primary width-100">Sign In</button>
            </div>
            <div style={{textAlign: 'center', marginTop: '1rem'}}>
              <p>Don't have an account? <a href="#" onClick={() => showPage('signup')} style={{color: '#e67e22'}}>Sign up here</a></p>
              <p><a href="#" style={{color: '#e67e22'}}>Forgot your password?</a></p>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default SignInPage
