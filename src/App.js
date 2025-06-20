import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import './scss/examples.scss'

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Signin = React.lazy(() => import('./views/landing/pages/SignInPage'))
//const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const LandingPage = React.lazy(() => import('./views/landing/LandingPage'))
//const ConfirmPassword = React.lazy(() => import('./views/landing/pages/ConfirmPassword'))


// Protected route component to redirect authenticated users away from auth pages
const PublicRoute = ({ element }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  //return isAuthenticated ? <Navigate to="/dashboard" replace /> : element
    return isAuthenticated ? <Navigate to="/landing" replace /> : element

}

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, [])

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
      <Routes>
  <Route
    path="/"
    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />}
  />
  <Route path="/landing" name="Landing Page" element={<LandingPage />} />
  <Route
    path="/reset-password"
    element={<PublicRoute element={<LandingPage />} />}
  />
  <Route path="/login" element={<PublicRoute element={<LandingPage />} />} />
  <Route path="/register" element={<PublicRoute element={<Register />} />} />
  <Route path="/404" element={<Page404 />} />
  <Route path="/500" element={<Page500 />} />
  <Route
    path="/*"
    element={isAuthenticated ? <DefaultLayout /> : <Navigate to="/login" replace />}
  />
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
s
      </Suspense>
    </BrowserRouter>
  )
}

export default App
