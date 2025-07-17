import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './LandingPage.css'
import { AdvancedSupportChatbot } from '../../components/chatbot'

// Import individual page components
import Header from './components/Header'
import HomePage from './pages/HomePage'
import FeaturesPage from './pages/FeaturesPage'
import ProductsPage from './pages/ProductsPage'
import PricingPage from './pages/PricingPage'
import IndustriesPage from './pages/IndustriesPage'
import ClientsPage from './pages/ClientsPage'
import ResourcesPage from './pages/ResourcesPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import DemoPage from './pages/DemoPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import Footer from './components/Footer'
import { useDispatch } from 'react-redux'
import { authApi } from '../../api/auth'
import CustomAlert from '../../components/New/CustomAlert'
// import { apiClient } from '../../api/config'
import { landingApi } from '../../api/landingPage'
import ForgotPassword from './pages/ForgotPassword'
import ConfirmPassword from './pages/ConfirmPassword'

const LandingPage = () => {
  const [activePage, setActivePage] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [alerts, setAlerts] = useState([])
  const [packagename, setPackageName] = useState('Free')
  const location = useLocation()

  const dispatch = useDispatch()
  const showPage = (pageId) => {
    setActivePage(pageId)
    window.scrollTo(0, 0)
    setMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleTrailFormSubmit = async (
    e,
    message = 'Thank you! Your submission has been received. We will contact you soon.',
  ) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const company = formData.get('company')
    const fullname = formData.get('fullname')
    const email = formData.get('email')
    const phone = formData.get('phone')
    const password = formData.get('password')

    const submissionData = {
      name: company,
      email: email,
      phone: phone,
      website: 'https://premiumboxmfg.com',
      address: 'chennai',
      currency: '4',
      timezone: 'America/Chicago',
      language: 'en',
      company_state_id: '1',
      logo: 'https://premiumboxmfg.com/assets/logo.png',
      package_name: packagename === 'Free' ? 'Trial' : packagename || 'Trial',
      password: password,
      companyAccountDetails: [
        {
          accountName: fullname,
          accountEmail: email,
        },
      ],
      package_id: 2,
      package_type: 'monthly',
      version: 'trial',
    }

    const OfflineTrailData = {
      company_name: company,
      full_name: fullname,
      email: email,
      phone: phone,
      password: password,
    }


    try {
      const req_type = await landingApi.getRequestType()
      if (req_type.data.requestType === 'offline request') {
        const response = await landingApi.addTrailOffline(OfflineTrailData)
        if (response.status === 200 || response.status === 201) {
          showPage('home')
          setAlerts([
            {
              severity: 'success',
              message: 'Completed Successfully',
            },
          ])
        }
      } else {
        const response = await landingApi.addTrail(submissionData)
        if (response?.data?.message) {
          //alert(message);
          setAlerts([
            {
              severity: 'success',
              message: response?.data?.message || 'Sign Up Success',
            },
          ])
          e.target.reset()
          showPage('home')
        } else {
          alert('Something went wrong. Please try again.')
        }
      }
    } catch (error) {
      console.error('API Error:', error)
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Sign Up Failed',
        },
      ])
      //alert(error.message || "Error submitting form. Please try again.");
    }

    //alert('Thank you! Your submission has been received. We will contact you soon.');
  }

  //const handleSignIn = (e) => {
  //  e.preventDefault()
  //  // Redirect to your existing login page
  //  navigate('/login')
  //}

  const handleSignIn = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authApi.login({
        email: formData.email,
        password: formData.password,
      })

      if (response.status === true && response) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('company_state_id', response.company_state_id)

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            email: response.user?.email || formData.email,
            token: response.token,
          },
        })
localStorage.setItem('company-branch-id', "")
        navigate('/dashboard', { replace: true })
      } else {
        setError('Invalid login response')
      }
    } catch (error) {
      console.error('Login failed', error?.response?.data?.message)
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Login Failed',
        },
      ])
      //setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false)
    }
  }

  const createDemo = async (e) => {
    e.preventDefault()

    const form = e.target

    const demoData = {
      company_name: form.company.value,
      full_name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      role: form.role.value,
      preferred_demo_time: form.time.value,
      needs_description: form.message.value,
    }

    try {
      const response = await landingApi.addDemo(demoData)
      setAlerts([
        {
          severity: 'success',
          message: response?.data?.message || 'Demo request Success!',
        },
      ])
      //alert("Thank you! We’ll get back to you soon.");
      form.reset() // Reset form after successful submission
      showPage('home')
    } catch (error) {
      console.error('Failed to submit demo request:', error)
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Demo request Failed!',
        },
      ])
      //alert("Oops! Something went wrong. Please try again.");
    }
  }

  const setEmailForForgotPassword = async (e) => {
    e.preventDefault()

    const dataval = {
      email: formData.email,
    }

    try {
      const response = await landingApi.setPasswordForEmail(dataval)
      e.target.reset()
      setAlerts([
        {
          severity: 'success',
          message: response?.data?.message || 'Check Your Mail',
        },
      ])
      showPage('signin')
      //alert("Password reset link sent to your email.");
      // Optionally clear email field
      // setFormData({ email: "" });
    } catch (error) {
      console.error('API Error:', error.response.data.message)
      setAlerts([
        {
          severity: 'error',
          message: error.response.data.message || 'Email Error',
        },
      ])
      //alert("Something went wrong. Please try again.");
    }
  }
  useEffect(() => {
    const { pathname, search } = window.location

    if (pathname === '/reset-password') {
      const queryParams = new URLSearchParams(search)
      const token = queryParams.get('token')
      const email = queryParams.get('email')

      setFormData((prev) => ({
        ...prev,
        token,
        email,
      }))

      setActivePage('confirmPassword')
    }
  }, [])

  useEffect(() => {
    const { pathname, search } = window.location

    if (pathname === '/login') {
      showPage('signin')
    }
  }, [])

  const setNewPassword = async (e) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      setAlerts([
        {
          severity: 'error',
          message: 'Passwords Do Not Match',
        },
      ])
      return
    }

    const { email, token, newPassword, confirmPassword } = formData

    const payload = {
      email,
      token,
      newPassword,
      confirmPassword,
    }

    try {
      const response = await landingApi.resetPassword(payload)
      if (response?.data?.message) {
        setAlerts([
          {
            severity: 'success',
            message: response?.data?.message,
          },
        ])
        // Optionally redirect or update UI here
        showPage('signin')
      }
    } catch (error) {
      console.error('error', error)
      setAlerts([
        {
          severity: 'error',
          message: error.response.data.message,
        },
      ])
    }
  }

  const submitContacts = async (e) => {
    e.preventDefault()

    const form = e.target

    const contactData = {
      name: form.name.value,
      email: form.email.value,
      company: form.company.value,
      subject: form.subject.value,
      message: form.message.value,
    }

    try {
      const response = await landingApi.createContacts(contactData)
      setAlerts([
        {
          severity: 'success',
          message: response?.data?.message,
        },
      ])
      // Optionally show success message to user
      //alert("Message sent successfully!");

      // Reset the form
      form.reset()
    } catch (error) {
      console.error('API Error:', error)
      setAlerts([
        {
          severity: 'error',
          message: error.response.data.message,
        },
      ])
      //alert("Something went wrong. Please try again.");
    }
  }

  const renderActivePage = () => {
    const pageProps = {
      showPage,
      handleTrailFormSubmit,
      handleSignIn,
      setFormData,
      formData,
      createDemo,
      setEmailForForgotPassword,
      setNewPassword,
      submitContacts,
      packagename,
      setPackageName,
    }

    switch (activePage) {
      case 'home':
        return <HomePage {...pageProps} />
      case 'features':
        return <FeaturesPage {...pageProps} />
      case 'products':
        return <ProductsPage {...pageProps} />
      case 'pricing':
        return <PricingPage {...pageProps} />
      case 'industries':
        return <IndustriesPage {...pageProps} />
      case 'clients':
        return <ClientsPage {...pageProps} />
      case 'resources':
        return <ResourcesPage {...pageProps} />
      case 'about':
        return <AboutPage {...pageProps} />
      case 'contact':
        return <ContactPage {...pageProps} />
      case 'demo':
        return <DemoPage {...pageProps} />
      case 'signin':
        return <SignInPage {...pageProps} />
      case 'signup':
        return <SignUpPage {...pageProps} packageName={packagename} />
      case 'forgotPassword':
        return <ForgotPassword {...pageProps} />
      case 'confirmPassword':
        return <ConfirmPassword {...pageProps} />
      default:
        return <HomePage {...pageProps} />
    }
  }
  const handleClose = () => {
    setAlerts([])
  }

  return (
    <div className="landing-page">
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <Header
        showPage={showPage}
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        setPackageName={setPackageName}
      />

      <main className="landing-content">{renderActivePage()}</main>

      <Footer />

      {/* Support Chatbot */}
      <AdvancedSupportChatbot />
    </div>
  )
}

export default LandingPage
