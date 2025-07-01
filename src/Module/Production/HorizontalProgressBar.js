import React from 'react'

const getBarColor = (value) => {
  if (value <= 25) return '#dc3545' // red
  if (value <= 50) return '#fd7e14' // orange
  if (value <= 75) return '#ffc107' // yellow/amber
  return '#28a745' // green
}

const HorizontalProgressBar = ({ value, height = 16, background = '#e0e0e0' }) => {
  const clampedValue = Math.min(100, Math.max(0, value))
  const color = getBarColor(clampedValue)
  return (
    <div style={{ width: '70%', background, borderRadius: 8, height, overflow: 'hidden', position: 'relative', minWidth: 60 }}>
      <div
        style={{
          width: `${clampedValue}%`,
          background: color,
          height: '100%',
          transition: 'width 0.3s',
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          color: clampedValue > 50 ? '#fff' : '#333',
          fontWeight: 600,
          fontSize: 13,
          pointerEvents: 'none',
        }}
      >
        {clampedValue}%
      </span>
    </div>
  )
}

export default HorizontalProgressBar 