import React from 'react'

const ContactPage = ({ handleFormSubmit,submitContacts }) => {
  return (
    <div>
      <section className="landing-page-header">
        <div className="landing-container">
          <h1>Get in Touch</h1>
          <p>Ready to transform your corrugated box manufacturing business?</p>
        </div>
      </section>

      <section className="landing-container">
        <div className="landing-contact-content">
          <div className="landing-contact-info">
            <h3>Contact Information</h3>
            <div className="landing-contact-item">
              <div className="landing-contact-icon">📍</div>
              <div>
                <h4>Address</h4>
                <p>123 Manufacturing Street<br />Industrial District, NY 10001</p>
              </div>
            </div>
            <div className="landing-contact-item">
              <div className="landing-contact-icon">📞</div>
              <div>
                <h4>Phone</h4>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="landing-contact-item">
              <div className="landing-contact-icon">📧</div>
              <div>
                <h4>Email</h4>
                <p>sales@packworkx.com</p>
              </div>
            </div>
            <div className="landing-contact-item">
              <div className="landing-contact-icon">🕒</div>
              <div>
                <h4>Business Hours</h4>
                <p>Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>

          <div className="landing-auth-form">
            <h3>Send Us a Message</h3>
            <form onSubmit={submitContacts}>
              <div className="landing-form-group">
                <label htmlFor="contact-name">Name</label>
                <input type="text" id="contact-name" name="name" required />
              </div>
              <div className="landing-form-group">
                <label htmlFor="contact-email">Email</label>
                <input type="email" id="contact-email" name="email" required />
              </div>
              <div className="landing-form-group">
                <label htmlFor="contact-company">Company</label>
                <input type="text" id="contact-company" name="company" />
              </div>
              <div className="landing-form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" required />
              </div>
              <div className="landing-form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="5" required></textarea>
              </div>
              <div className="landing-form-group">
                <button type="submit" className="landing-btn landing-btn-primary width-100">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
