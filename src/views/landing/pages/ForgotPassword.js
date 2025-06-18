import React from 'react'

const ForgotPassword = ({ showPage, handleSignIn, formData, setFormData,setEmailForForgotPassword  }) => {
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
		<h4>Enter Email Id to setup Password </h4>
		<form onSubmit={setEmailForForgotPassword}>
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

		  {/*{error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}*/}

		  <div className="landing-form-group">
			<button
			  type="submit"
			  className="landing-btn landing-btn-primary width-100"
			  //disabled={loading}
			>
			  {/*{loading ? 'Signing in...' : 'Sign In'}*/}
			  Submit
			</button>
	
            <div style={{textAlign: 'center', marginTop: '1rem'}}>
              <p>Already have an account? <a href="#" onClick={() => showPage('signin')} style={{color: '#e67e22'}}>Sign in here</a></p>
            </div>
		  </div>
		</form>
	  </div>
	</section>
	</div>
  )
}

export default ForgotPassword
