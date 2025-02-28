import React from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

const ProgressBar = ({ value }) => {
  return (
    <CircularProgressbar
      value={value}
      text={`${value}%`}
      styles={buildStyles({
        textColor: '#28a745',
        pathColor: '#28a745',
        trailColor: '#e0e0e0',
        textSize: '20px',
      })}
    />
  )
}

export default ProgressBar
