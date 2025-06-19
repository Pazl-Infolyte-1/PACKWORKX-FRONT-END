import React from 'react'
import { CAlert, CContainer, CButton } from '@coreui/react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console or error reporting service
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <CContainer className="mt-4">
          <CAlert color="danger">
            <h4>Something went wrong!</h4>
            <p>
              An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
                <summary>Error Details (Development Only)</summary>
                <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  <strong>Error:</strong> {this.state.error.toString()}
                  <br />
                  <strong>Stack:</strong>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </div>
              </details>
            )}
            <div className="mt-3">
              <CButton color="primary" onClick={this.handleReload}>
                Reload Page
              </CButton>
            </div>
          </CAlert>
        </CContainer>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
