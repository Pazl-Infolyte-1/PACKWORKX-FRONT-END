

import React from 'react'
import { useSearchParams } from 'react-router-dom'

const ConfirmPassword = ({ showPage, handleSignIn, formData, setFormData,setEmailForForgotPassword ,setNewPassword }) => {
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
		<h4>Setup New-Password</h4>
		<form onSubmit={setNewPassword}>
		 <div className="landing-form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              required
              value={formData?.newPassword}
              onChange={handleInputChange}
            />
          </div>
 <div className="landing-form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              value={formData?.confirmPassword}
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
		  </div>
		</form>
	  </div>
	</section>
	</div>
  )
}

export default ConfirmPassword
