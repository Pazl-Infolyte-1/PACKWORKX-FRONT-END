import React from 'react'

const Loading = ({ isLoading }) => {
  if (!isLoading) return null
  return <div style={styles.loader}></div>
}

// Styles
const styles = {
  loader: {
    width: '25px',
    height: '25px',
    border: '5px solid #9CA3AF',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
}

// Adding keyframes for animation
const styleSheet = document.styleSheets[0]
styleSheet.insertRule(
  `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`,
  styleSheet.cssRules.length,
)

export default Loading
