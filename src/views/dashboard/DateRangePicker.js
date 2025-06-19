import React from 'react'
import PropTypes from 'prop-types'
import {
  CFormInput,
  CButton,
  CRow,
  CCol,
  CSpinner,
  CButtonGroup
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilCalendar } from '@coreui/icons'

const DateRangePicker = ({ 
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  isLoading,
  showQuickSelects,
  style,
  transparent
}) => {
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

  const quickSelectOptions = [
    { label: 'Today', days: 0 },
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'Last 90 Days', days: 90 },
    { label: 'This Year', days: 365 }
  ]

  const handleQuickSelect = (days) => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - days)
    
    onEndDateChange(end.toISOString().split('T')[0])
    onStartDateChange(start.toISOString().split('T')[0])
  }

  const containerStyle = transparent ? {
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '20px',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    ...style
  } : {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 15px rgba(0, 0, 0, 0.08)',
    border: '2px solid #f1f3f4',
    ...style
  }

  const inputStyle = transparent ? {
    background: 'rgba(255, 255, 255, 0.2)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    padding: '10px 15px',
    color: 'white',
    backdropFilter: 'blur(10px)'
  } : {
    border: '2px solid #e9ecef',
    borderRadius: '10px',
    padding: '10px 15px',
    fontSize: '1rem'
  }

  return (
    <div style={containerStyle}>
      {/* Quick Select Buttons */}
      {showQuickSelects && (
        <div className="mb-3">
          <label className={`form-label small ${transparent ? 'text-white-50' : 'text-muted'}`}>
            Quick Select
          </label>
          <div className="d-flex flex-wrap gap-2">
            {quickSelectOptions.map((option) => (
              <CButton
                key={option.label}
                size="sm"
                variant="outline"
                style={{
                  borderColor: transparent ? 'rgba(255,255,255,0.3)' : themeColors.inventory,
                  color: transparent ? 'rgba(255,255,255,0.8)' : themeColors.inventory,
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.75rem'
                }}
                onClick={() => handleQuickSelect(option.days)}
              >
                {option.label}
              </CButton>
            ))}
          </div>
        </div>
      )}

      {/* Date Range Inputs */}
      <CRow className="g-2">
        <CCol>
          <label className={`form-label small ${transparent ? 'text-white-50' : 'text-muted'}`}>
            <CIcon icon={cilCalendar} className="me-1" />
            From Date
          </label>
          <CFormInput
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            style={inputStyle}
          />
        </CCol>
        <CCol>
          <label className={`form-label small ${transparent ? 'text-white-50' : 'text-muted'}`}>
            <CIcon icon={cilCalendar} className="me-1" />
            To Date
          </label>
          <CFormInput
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            style={inputStyle}
          />
        </CCol>
        <CCol xs="auto" className="d-flex align-items-end">
          <CButton 
            style={{
              background: transparent 
                ? 'rgba(255, 255, 255, 0.2)' 
                : `linear-gradient(135deg, ${themeColors.inventory} 0%, #2980b9 100%)`,
              border: transparent ? '2px solid rgba(255, 255, 255, 0.3)' : 'none',
              borderRadius: '10px',
              padding: '10px 15px',
              color: 'white',
              backdropFilter: transparent ? 'blur(10px)' : 'none'
            }}
            onClick={onSearch}
            disabled={isLoading}
          >
            {isLoading ? <CSpinner size="sm" /> : <CIcon icon={cilSearch} />}
          </CButton>
        </CCol>
      </CRow>

      {/* Date Range Summary */}
      <div className="mt-2">
        <small className={transparent ? 'text-white-50' : 'text-muted'}>
          {startDate && endDate && (
            <>
              Selected range: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
              {' '}({Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} days)
            </>
          )}
        </small>
      </div>
    </div>
  )
}

DateRangePicker.propTypes = {
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  onStartDateChange: PropTypes.func.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  showQuickSelects: PropTypes.bool,
  style: PropTypes.object,
  transparent: PropTypes.bool
}

DateRangePicker.defaultProps = {
  isLoading: false,
  showQuickSelects: true,
  style: {},
  transparent: false
}

export default DateRangePicker