import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CButtonGroup,
  CProgress,
  CBadge,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CAlert,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CSpinner,
  CAvatar,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilCart,
  cilList,
  cilUserPlus,
  cilPencil,
  cilCalculator,
  cilExternalLink,
  cilUser,
  cilArrowTop,
  cilArrowBottom,
  cilDollar,
  cilChart,
  cilBell,
  cilCalendar,
  cilSearch,
  cilOptions,
  cilCheckCircle,
  cilWarning,
  cilInfo,
  cilClock,
  cilPlus,
  cilTruck,
  cilFactory,
  cilHome,
  cilFile,
  cilCreditCard,
  cilSettings,
  cilGraph,
  cilLayers,
  cilIndustry,
  cilPeople,
  cilBarChart,
  cilPhone,
  cilEnvelopeClosed,
  cilLocationPin
} from '@coreui/icons'
import { CChartBar, CChartLine, CChartDoughnut, CChartPie } from '@coreui/react-chartjs'
import './DashboardTheme.css'

// Import the JSON data
import dashboardData from 'src/data/dashboardData.json'

// Import avatar images
import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

const Dashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: dashboardData.dashboardConfig.dateRange.startDate,
    endDate: dashboardData.dashboardConfig.dateRange.endDate
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Get data from JSON
  const {
    dashboardConfig,
    themeColors,
    alerts: initialAlerts,
    erpWidgets,
    financialWidgets,
    productionMetrics,
    recentTransactions,
    chartData,
    quickActions,
    statusConfig
  } = dashboardData

  const [alerts, setAlerts] = useState(initialAlerts)

  // Icon mapping (since we can't import icons dynamically from JSON)
  const iconMap = {
    cilWarning,
    cilList,
    cilCheckCircle,
    cilInfo,
    cilCart,
    cilPencil,
    cilCalculator,
    cilUser,
    cilUserPlus,
    cilTruck,
    cilExternalLink,
    cilHome,
    cilArrowBottom,
    cilArrowTop,
    cilSettings,
    cilCreditCard,
    cilFile,
    cilPlus,
    cilFactory,
    cilDollar,
    cilGraph,
    cilChart,
    cilBarChart,
    cilPeople,
    cilLayers,
    cilCalendar,
    cilOptions,
    cilSearch
  }

  // Helper functions
  const getStatusBadge = (status) => {
    return statusConfig.statusStyles[status] || 'secondary'
  }

  const getPriorityColor = (priority) => {
    return statusConfig.priorityColors[priority] || 'secondary'
  }

  const dismissAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId))
  }

  const handleSearch = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const getIcon = (iconName) => {
    return iconMap[iconName] || cilInfo
  }

  return (
    <div className="manufacturing-erp-dashboard">
      {/* Dashboard Header */}
      <CCard className="dashboard-header mb-4" style={{
        background: `linear-gradient(135deg, ${themeColors.production} 0%, ${themeColors.inventory} 100%)`,
        color: 'white',
        border: 'none'
      }}>
        <CCardBody>
          <CRow className="align-items-center">
            <CCol md={6}>
              <h2 className="mb-2 d-flex align-items-center">
                <CIcon icon={cilFactory} className="me-3" size="xl" />
                {dashboardConfig.title}
              </h2>
              <p className="mb-0 opacity-75">
                {dashboardConfig.subtitle}
              </p>
            </CCol>
            <CCol md={6}>
              <div className="date-range-container">
                <CRow className="g-2">
                  <CCol>
                    <label className="form-label text-white-50 small">From Date</label>
                    <CFormInput
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                      className="bg-white bg-opacity-20 text-white border-white border-opacity-30"
                      style={{ backdropFilter: 'blur(10px)' }}
                    />
                  </CCol>
                  <CCol>
                    <label className="form-label text-white-50 small">To Date</label>
                    <CFormInput
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                      className="bg-white bg-opacity-20 text-white border-white border-opacity-30"
                      style={{ backdropFilter: 'blur(10px)' }}
                    />
                  </CCol>
                  <CCol xs="auto" className="d-flex align-items-end">
                    <CButton 
                      className="bg-white bg-opacity-20 border-white border-opacity-30 text-white"
                      onClick={handleSearch}
                      disabled={isLoading}
                      style={{ backdropFilter: 'blur(10px)' }}
                    >
                      {isLoading ? <CSpinner size="sm" /> : <CIcon icon={cilSearch} />}
                    </CButton>
                  </CCol>
                </CRow>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <CRow className="mb-4">
          <CCol>
            {alerts.slice(0, 2).map((alert) => (
              <CAlert
                key={alert.id}
                color={alert.type}
                dismissible
                onClose={() => dismissAlert(alert.id)}
                className="border-0 shadow-sm mb-2"
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex align-items-center">
                    <CIcon icon={getIcon(alert.icon)} className="me-2" />
                    <div>
                      <span className="fw-bold">[{alert.module}]</span> {alert.message}
                    </div>
                  </div>
                  <small className="opacity-75">{alert.time}</small>
                </div>
              </CAlert>
            ))}
          </CCol>
        </CRow>
      )}

      {/* Main ERP Widgets */}
      <CRow className="mb-4">
        {erpWidgets.map((widget, index) => (
          <CCol sm={6} xl={3} key={index} className="mb-3">
            <CCard 
              className="text-white overflow-hidden border-0 shadow-sm h-100"
              style={{ 
                background: widget.bgGradient,
                minHeight: '200px'
              }}
            >
              <CCardBody className="position-relative">
                <CDropdown alignment="end" className="position-absolute" style={{ top: '10px', right: '10px' }}>
                  <CDropdownToggle color="transparent" caret={false} className="text-white p-1">
                    <CIcon icon={cilOptions} size="sm" />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem>View Details</CDropdownItem>
                    <CDropdownItem>Export Data</CDropdownItem>
                    <CDropdownItem>Set Alerts</CDropdownItem>
                    <CDropdownItem>Configure</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>

                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="flex-grow-1">
                    <div className="fs-6 fw-medium opacity-75">{widget.title}</div>
                    <div className="fs-1 fw-bold mb-2">{widget.value}</div>
                    <div className="d-flex align-items-center mb-2">
                      <CIcon 
                        icon={widget.trend === 'up' ? cilArrowTop : cilArrowBottom}
                        className="me-1"
                        size="sm"
                      />
                      <span className="fs-6 fw-medium">{widget.change}</span>
                    </div>
                    <div className="fs-7 opacity-75">{widget.description}</div>
                    {widget.urgentCount > 0 && (
                      <CBadge color="danger" className="mt-2">
                        {widget.urgentCount} urgent
                      </CBadge>
                    )}
                  </div>
                  <div 
                    className="bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '60px', height: '60px' }}
                  >
                    <CIcon icon={getIcon(widget.icon)} size="xl" />
                  </div>
                </div>

                {/* Progress toward target */}
                <div className="mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="opacity-75">Target Progress</small>
                    <small className="opacity-75">
                      {widget.target}
                    </small>
                  </div>
                  <CProgress 
                    value={
                      widget.title === 'Active Machines' 
                        ? (89/95) * 100 
                        : (parseInt(widget.value.replace(/[^0-9]/g, '')) / parseInt(widget.target.replace(/[^0-9]/g, ''))) * 100
                    }
                    color="light"
                    style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }}
                  />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* Financial Overview */}
      <CRow className="mb-4">
        <CCol>
          <CCard className="border-0 shadow-sm">
            <CCardHeader 
              style={{ 
                background: `linear-gradient(135deg, ${themeColors.finance} 0%, ${themeColors.quality} 100%)`,
                color: 'white' 
              }}
              className="d-flex justify-content-between align-items-center"
            >
              <h5 className="mb-0 d-flex align-items-center">
                <CIcon icon={cilDollar} className="me-2" />
                Financial Operations Overview
              </h5>
              <CBadge color="light" style={{ color: themeColors.finance }}>
                Last 30 Days
              </CBadge>
            </CCardHeader>
            <CCardBody>
              <CRow>
                {financialWidgets.map((widget, index) => (
                  <CCol md={4} lg={2} key={index} className="mb-3">
                    <div 
                      className="p-3 rounded-3 text-center h-100"
                      style={{ 
                        background: `linear-gradient(135deg, ${widget.color}15 0%, ${widget.color}05 100%)`,
                        border: `2px solid ${widget.color}20`
                      }}
                    >
                      <div 
                        className="rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center"
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          backgroundColor: `${widget.color}20`,
                          color: widget.color
                        }}
                      >
                        <CIcon icon={getIcon(widget.icon)} size="lg" />
                      </div>
                      <div className="fw-bold fs-5" style={{ color: widget.color }}>
                        {widget.value}
                      </div>
                      <div className="small text-muted mb-1">{widget.description}</div>
                      <div className="fw-bold small">{widget.amount}</div>
                      <div className={`small ${widget.change.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                        {widget.change}
                      </div>
                    </div>
                  </CCol>
                ))}
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Charts Section */}
      <CRow className="mb-4">
        {/* Sales & Purchase Trends */}
        <CCol lg={8}>
          <CCard className="border-0 shadow-sm">
            <CCardHeader 
              style={{ 
                background: `linear-gradient(135deg, ${themeColors.sales} 0%, ${themeColors.purchase} 100%)`,
                color: 'white' 
              }}
              className="d-flex justify-content-between align-items-center"
            >
              <h5 className="mb-0 d-flex align-items-center">
                <CIcon icon={cilGraph} className="me-2" />
                Sales & Purchase Trends
              </h5>
              <CButtonGroup>
                {['Week', 'Month', 'Quarter', 'Year'].map((period) => (
                  <CButton
                    key={period}
                    size="sm"
                    variant="outline"
                    style={{ 
                      backgroundColor: period === 'Month' ? 'rgba(255,255,255,0.2)' : 'transparent',
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white'
                    }}
                  >
                    {period}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCardHeader>
            <CCardBody>
              <div style={{ height: '350px' }}>
                <CChartLine
                  data={chartData.salesTrend}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0,0,0,0.1)'
                        }
                      },
                      x: {
                        grid: {
                          color: 'rgba(0,0,0,0.1)'
                        }
                      }
                    }
                  }}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Inventory Distribution */}
        <CCol lg={4}>
          <CCard className="border-0 shadow-sm h-100">
            <CCardHeader 
              style={{ 
                background: `linear-gradient(135deg, ${themeColors.inventory} 0%, ${themeColors.sales} 100%)`,
                color: 'white' 
              }}
            >
              <h5 className="mb-0 d-flex align-items-center">
                <CIcon icon={cilChart} className="me-2" />
                Inventory Distribution
              </h5>
            </CCardHeader>
            <CCardBody>
              <div style={{ height: '330px' }}>
                <CChartDoughnut
                  data={chartData.inventoryDistribution}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          usePointStyle: true,
                          padding: 15,
                          font: {
                            size: 11
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Production Metrics & Employee Performance */}
      <CRow className="mb-4">
        {/* Production KPIs */}
        <CCol lg={8}>
          <CCard className="border-0 shadow-sm h-100">
            <CCardHeader 
              style={{ 
                background: `linear-gradient(135deg, ${themeColors.production} 0%, ${themeColors.maintenance} 100%)`,
                color: 'white' 
              }}
            >
              <h5 className="mb-0 d-flex align-items-center">
                <CIcon icon={cilBarChart} className="me-2" />
                Production KPIs & Machine Efficiency
              </h5>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={6}>
                  <h6 className="mb-3">Daily Targets</h6>
                  {productionMetrics.map((metric, index) => (
                    <div key={index} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <div className="fw-semibold small">{metric.label}</div>
                          <small className="text-muted">
                            {metric.current}{metric.unit} / {metric.target}{metric.unit}
                          </small>
                        </div>
                        <CBadge 
                          color={metric.efficiency >= 100 ? 'success' : metric.efficiency >= 90 ? 'warning' : 'danger'}
                          className="small"
                        >
                          {metric.efficiency}%
                        </CBadge>
                      </div>
                      <CProgress 
                        value={(metric.current / metric.target) * 100}
                        color={metric.efficiency >= 100 ? 'success' : metric.efficiency >= 90 ? 'warning' : 'danger'}
                        style={{ height: '8px' }}
                      />
                    </div>
                  ))}
                </CCol>
                <CCol md={6}>
                  <h6 className="mb-3">Machine Performance</h6>
                  <div style={{ height: '200px' }}>
                    <CChartBar
                      data={chartData.machineEfficiency}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                            grid: {
                              color: 'rgba(0,0,0,0.1)'
                            }
                          },
                          x: {
                            grid: {
                              display: false
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Employee Distribution */}
        <CCol lg={4}>
          <CCard className="border-0 shadow-sm h-100">
            <CCardHeader 
              style={{ 
                background: `linear-gradient(135deg, ${themeColors.hr} 0%, ${themeColors.quality} 100%)`,
                color: 'white' 
              }}
            >
              <h5 className="mb-0 d-flex align-items-center">
                <CIcon icon={cilPeople} className="me-2" />
                Employee Distribution
              </h5>
            </CCardHeader>
            <CCardBody>
              <div style={{ height: '300px' }}>
                <CChartPie
                  data={chartData.employeePerformance}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          usePointStyle: true,
                          padding: 15,
                          font: {
                            size: 11
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Recent Transactions Table */}
      <CRow className="mb-4">
        <CCol>
          <CCard className="border-0 shadow-sm">
            <CCardHeader 
              style={{ 
                background: `linear-gradient(135deg, ${themeColors.finance} 0%, ${themeColors.hr} 100%)`,
                color: 'white' 
              }}
              className="d-flex justify-content-between align-items-center"
            >
              <h5 className="mb-0 d-flex align-items-center">
                <CIcon icon={cilLayers} className="me-2" />
                Recent Transactions & Activities
              </h5>
              <div className="d-flex align-items-center gap-2">
                <CFormSelect
                  size="sm"
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white'
                  }}
                >
                  <option>All Types</option>
                  <option>Sales Orders</option>
                  <option>Purchase Orders</option>
                  <option>Work Orders</option>
                  <option>GRN</option>
                  <option>Returns</option>
                </CFormSelect>
                <CBadge color="light" style={{ color: themeColors.finance }}>
                  {recentTransactions.length} items
                </CBadge>
              </div>
            </CCardHeader>
            <CCardBody className="p-0">
              <CTable hover responsive className="mb-0">
                <CTableHead style={{ backgroundColor: '#f8f9fa' }}>
                  <CTableRow>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Reference</CTableHeaderCell>
                    <CTableHeaderCell>Client/Partner</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Priority</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {recentTransactions.map((transaction) => (
                    <CTableRow key={transaction.id}>
                      <CTableDataCell>
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                            style={{ 
                              width: '35px', 
                              height: '35px', 
                              backgroundColor: `${transaction.color}20`,
                              color: transaction.color
                            }}
                          >
                            <CIcon icon={getIcon(transaction.icon)} />
                          </div>
                          <span className="fw-semibold">{transaction.type}</span>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <span className="font-monospace">{transaction.reference}</span>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="fw-medium">{transaction.client}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <span className="fw-bold" style={{ color: themeColors.sales }}>
                          {transaction.amount}
                        </span>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getStatusBadge(transaction.status)}>
                          {transaction.status}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getPriorityColor(transaction.priority)}>
                          {transaction.priority}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="text-muted small">
                          <CIcon icon={cilCalendar} className="me-1" />
                          {transaction.date}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CDropdown>
                          <CDropdownToggle size="sm" color="primary" variant="outline">
                            <CIcon icon={cilOptions} />
                          </CDropdownToggle>
                          <CDropdownMenu>
                            <CDropdownItem>View Details</CDropdownItem>
                            <CDropdownItem>Edit</CDropdownItem>
                            <CDropdownItem>Print</CDropdownItem>
                            <CDropdownItem>Export</CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Quick Actions */}
      <CRow>
        <CCol>
          <CCard className="border-0 shadow-sm">
            <CCardHeader 
              style={{ 
                background: `linear-gradient(135deg, ${themeColors.hr} 0%, ${themeColors.quality} 100%)`,
                color: 'white' 
              }}
            >
              <h6 className="mb-0 d-flex align-items-center">
                <CIcon icon={cilPlus} className="me-2" />
                Quick Actions
              </h6>
            </CCardHeader>
            <CCardBody>
              <div className="d-flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <CButton
                    key={index}
                    style={{ 
                      backgroundColor: action.color,
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                    size="sm"
                    className="shadow-sm"
                    onClick={() => console.log(`Action: ${action.action}`)}
                  >
                    <CIcon icon={getIcon(action.icon)} className="me-2" />
                    {action.label}
                  </CButton>
                ))}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Dashboard