import React from 'react'
import PropTypes from 'prop-types'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
  CProgress
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowTop, cilArrowBottom } from '@coreui/icons'

const MetricCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  description, 
  color, 
  icon, 
  target,
  urgentCount,
  bgGradient 
}) => {
  // Manufacturing ERP theme colors
  const themeColors = {
    production: '#e74c3c',
    inventory: '#3498db',
    sales: '#2ecc71',
    purchase: '#f39c12',
    quality: '#9b59b6',
    maintenance: '#e67e22',
    finance: '#34495e',
    hr: '#1abc9c'
  }

  const getProgressValue = () => {
    if (!target || !value) return 0
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''))
    const numericTarget = parseInt(target.replace(/[^0-9]/g, ''))
    return (numericValue / numericTarget) * 100
  }

  return (
    <CCard 
      className="text-white overflow-hidden border-0 shadow-sm h-100"
      style={{ 
        background: bgGradient || `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        minHeight: '200px'
      }}
    >
      <CCardBody className="position-relative">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <div className="fs-6 fw-medium opacity-75">{title}</div>
            <div className="fs-1 fw-bold mb-2">{value}</div>
            <div className="d-flex align-items-center mb-2">
              <CIcon 
                icon={trend === 'up' ? cilArrowTop : cilArrowBottom}
                className="me-1"
                size="sm"
              />
              <span className="fs-6 fw-medium">{change}</span>
            </div>
            <div className="fs-7 opacity-75">{description}</div>
            {urgentCount > 0 && (
              <CBadge color="danger" className="mt-2">
                {urgentCount} urgent
              </CBadge>
            )}
          </div>
          <div 
            className="bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: '60px', height: '60px' }}
          >
            <CIcon icon={icon} size="xl" />
          </div>
        </div>

        {/* Progress toward target */}
        {target && (
          <div className="mt-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <small className="opacity-75">Target Progress</small>
              <small className="opacity-75">{target}</small>
            </div>
            <CProgress 
              value={getProgressValue()}
              color="light"
              style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }}
            />
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  change: PropTypes.string,
  trend: PropTypes.oneOf(['up', 'down']),
  description: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.object,
  target: PropTypes.string,
  urgentCount: PropTypes.number,
  bgGradient: PropTypes.string
}

MetricCard.defaultProps = {
  change: '+0%',
  trend: 'up',
  description: '',
  color: '#3498db',
  urgentCount: 0
}

export default MetricCard