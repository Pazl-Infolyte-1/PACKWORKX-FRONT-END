import React from 'react'
import { useNavigate } from 'react-router-dom'

const TestLandingButton = () => {
  const navigate = useNavigate()

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      background: '#e67e22',
      color: 'white',
      padding: '10px 15px',
      borderRadius: '5px',
      cursor: 'pointer',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    }} onClick={() => navigate('/landing')}>
      View Landing Page
    </div>
  )
}

export default TestLandingButton
