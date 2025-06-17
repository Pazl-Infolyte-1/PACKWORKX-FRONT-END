import React from 'react'

const SignInPage = ({ showPage, handleSignIn, formData, setFormData  }) => {
    const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div>
      <section className="landing-auth-container">
      <div className="landing-auth-form">
        <h2>Sign In to PackWorkX</h2>
        <form onSubmit={handleSignIn}>
          <div className="landing-form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData?.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="landing-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData?.password}
              onChange={handleInputChange}
            />
          </div>

          {/*{error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}*/}

          <div className="landing-form-group">
            <button
              type="submit"
              className="landing-btn landing-btn-primary width-100"
              //disabled={loading}
            >
              {/*{loading ? 'Signing in...' : 'Sign In'}*/}
              Sign In
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p>
              Don't have an account?{' '}
              <a href="#" onClick={() => showPage('signup')} style={{ color: '#e67e22' }}>
                Sign up here
              </a>
            </p>
            <p>
              <a href="#" style={{ color: '#e67e22' }}>
                Forgot your password?
              </a>
            </p>
          </div>
        </form>
      </div>
    </section>
    </div>
  )
}

export default SignInPage
