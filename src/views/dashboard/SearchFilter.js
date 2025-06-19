import React from 'react'
import PropTypes from 'prop-types'
import {
  CFormInput,
  CFormSelect,
  CInputGroup,
  CButton,
  CSpinner,
  CRow,
  CCol
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilFilter, cilPlus, cilChart } from '@coreui/icons'

const SearchFilter = ({ 
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  filterOptions,
  onSearch,
  isLoading,
  placeholder,
  showAddButton,
  showExportButton,
  onAdd,
  onExport,
  additionalFilters
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

  return (
    <div 
      className="search-filter-container"
      style={{
        background: 'white',
        borderRadius: '15px',
        padding: '25px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        marginBottom: '25px',
        position: 'relative'
      }}
    >
      {/* Gradient top border */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '3px',
          background: `linear-gradient(90deg, ${themeColors.production}, ${themeColors.inventory}, ${themeColors.sales})`
        }}
      />
      
      <CRow className="align-items-center">
        {/* Search Input */}
        <CCol md={4}>
          <CInputGroup>
            <CFormInput
              placeholder={placeholder || "Search by name, reference, or client..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: '2px solid #e9ecef',
                borderRadius: '12px 0 0 12px',
                padding: '12px 18px',
                fontSize: '1rem'
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onSearch()
                }
              }}
            />
            <CButton 
              style={{
                background: `linear-gradient(135deg, ${themeColors.inventory} 0%, #2980b9 100%)`,
                border: 'none',
                borderRadius: '0 12px 12px 0',
                padding: '12px 20px'
              }}
              onClick={onSearch}
              disabled={isLoading}
            >
              {isLoading ? <CSpinner size="sm" className="text-white" /> : <CIcon icon={cilSearch} className="text-white" />}
            </CButton>
          </CInputGroup>
        </CCol>

        {/* Filter Dropdown */}
        <CCol md={3}>
          <CFormSelect
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            style={{
              border: '2px solid #e9ecef',
              borderRadius: '12px',
              padding: '12px 18px',
              fontSize: '1rem'
            }}
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </CFormSelect>
        </CCol>

        {/* Additional Filters */}
        {additionalFilters && (
          <CCol md={2}>
            {additionalFilters}
          </CCol>
        )}

        {/* Action Buttons */}
        <CCol md={additionalFilters ? 3 : 5} className="text-end">
          <div className="d-flex gap-2 justify-content-end">
            {showExportButton && (
              <CButton
                style={{
                  background: `linear-gradient(135deg, ${themeColors.finance} 0%, #2c3e50 100%)`,
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  color: 'white',
                  fontWeight: '600'
                }}
                onClick={onExport}
              >
                <CIcon icon={cilChart} className="me-2" />
                Export Report
              </CButton>
            )}
            
            {showAddButton && (
              <CButton
                style={{
                  background: `linear-gradient(135deg, ${themeColors.production} 0%, #c0392b 100%)`,
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  color: 'white',
                  fontWeight: '600'
                }}
                onClick={onAdd}
              >
                <CIcon icon={cilPlus} className="me-2" />
                Add New
              </CButton>
            )}
          </div>
        </CCol>
      </CRow>

      {/* Advanced Filter Toggle */}
      <div className="mt-3">
        <CButton
          variant="ghost"
          size="sm"
          style={{
            color: themeColors.inventory,
            padding: '5px 10px',
            borderRadius: '8px'
          }}
        >
          <CIcon icon={cilFilter} className="me-1" />
          Advanced Filters
        </CButton>
      </div>
    </div>
  )
}

SearchFilter.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  selectedFilter: PropTypes.string.isRequired,
  setSelectedFilter: PropTypes.func.isRequired,
  filterOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  onSearch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  placeholder: PropTypes.string,
  showAddButton: PropTypes.bool,
  showExportButton: PropTypes.bool,
  onAdd: PropTypes.func,
  onExport: PropTypes.func,
  additionalFilters: PropTypes.node
}

SearchFilter.defaultProps = {
  isLoading: false,
  showAddButton: true,
  showExportButton: true,
  onAdd: () => {},
  onExport: () => {}
}

export default SearchFilter