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

// Import the dashboard service
import { dashboardService } from 'src/services/dashboardService'

// Import avatar images
import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

const Dashboard = () => {
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMockData, setIsMockData] = useState(false)
  const [errorInfo, setErrorInfo] = useState(null)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Local state for alerts that can be dismissed
  const [alerts, setAlerts] = useState([])

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      setErrorInfo(null)

      // Prepare API call with date parameters
      const params = new URLSearchParams();
      if (dateRange.startDate) {
        params.append('from_date', dateRange.startDate);
      }
      if (dateRange.endDate) {
        params.append('to_date', dateRange.endDate);
      }

      console.log('Fetching dashboard data with date range:', {
        from_date: dateRange.startDate,
        to_date: dateRange.endDate
      });

      const response = await dashboardService.getDashboardData(params.toString())
      console.log('API Response:', response)

      if (response.success && response.data) {
        setDashboardData(response.data)
        setAlerts(response.data.alerts || [])
        setIsMockData(response.isMockData || false)
        setErrorInfo(response.errorInfo || null)

        // Update date range from API response
        if (response.data.dashboardConfig?.dateRange) {
          setDateRange(response.data.dashboardConfig.dateRange)
        }

        // Show appropriate message based on error type
        if (response.isMockData && response.errorInfo) {
          setError(response.errorInfo.userMessage)
        }

        // Log widget data for debugging
        console.log('ERP Widgets with progress data:', response.data.erpWidgets);
      } else {
        throw new Error('Invalid API response format')
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Effect to fetch data on component mount
  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Effect to refetch data when date range changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (dashboardData) {
        fetchDashboardData()
      }
    }, 1000) // Debounce API calls

    return () => clearTimeout(timeoutId)
  }, [dateRange.startDate, dateRange.endDate])

  // If data is not loaded yet, use fallback structure
  const {
    dashboardConfig = {
      title: "PACKWORKX ERP Dashboard",
      subtitle: "Complete overview of your manufacturing operations and business processes"
    },
    themeColors = {
      production: "#e74c3c",
      inventory: "#3498db",
      sales: "#2ecc71",
      purchase: "#f39c12",
      quality: "#9b59b6",
      maintenance: "#e67e22",
      finance: "#34495e",
      hr: "#1abc9c"
    },
    erpWidgets = [],
    financialWidgets = [],
    productionMetrics = [],
    recentTransactions = [],
    chartData = {
      salesTrend: { labels: [], datasets: [] },
      inventoryDistribution: { labels: [], datasets: [] },
      machineEfficiency: { labels: [], datasets: [] },
      employeePerformance: { labels: [], datasets: [] }
    },
    quickActions = [],
    statusConfig = {
      statusStyles: {},
      priorityColors: {}
    }
  } = dashboardData || {}

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

  const getIcon = (iconName) => {
    return iconMap[iconName] || cilInfo
  }

  const dismissAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId))
  }

  const handleSearch = () => {
    setIsLoading(true)
    // Trigger a refresh of dashboard data
    fetchDashboardData().finally(() => {
      setIsLoading(false)
    })
  }

  const handleRefresh = () => {
    fetchDashboardData()
  }

  // Calculate progress value for widgets
  const calculateProgressValue = (widget) => {
    if (!widget || !widget.value || !widget.target) {
      console.warn('Progress calculation: Missing widget, value, or target', { widget });
      return 0;
    }

    try {
      let currentValue = 0;
      let targetValue = 0;

      // Handle different value formats
      if (widget.title === 'Active Machines') {
        // Handle "89/95" format
        const parts = widget.value.split('/');
        if (parts.length === 2) {
          currentValue = parseInt(parts[0]);
          targetValue = parseInt(parts[1]);
        }
      } else {
        // Handle regular numeric values
        currentValue = parseFloat(widget.value.replace(/[^0-9.-]/g, '')) || 0;
        targetValue = parseFloat(widget.target.replace(/[^0-9.-]/g, '')) || 1;
      }

      // Calculate percentage, cap at 100%
      const percentage = Math.min((currentValue / targetValue) * 100, 100);
      const finalValue = Math.max(percentage, 0); // Ensure it's not negative

      console.log(`Progress for ${widget.title}:`, {
        value: widget.value,
        target: widget.target,
        currentValue,
        targetValue,
        percentage: finalValue
      });


      return finalValue;
    } catch (error) {
      console.error('Error calculating progress for widget:', widget.title, error);
      return 0;
    }
  };

  // Show loading spinner while initial data is loading
  if (loading && !dashboardData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <CSpinner size="lg" />
        <span className="ms-2">Loading dashboard...</span>
      </div>
    )
  }

  // Show error state
  if (error && !dashboardData) {
    return (
      <div className="container-fluid">
        <CAlert color="danger" className="m-4">
          <h4>Error Loading Dashboard</h4>
          <p>{error}</p>
          <CButton color="primary" onClick={handleRefresh}>
            <CIcon icon={cilSpeedometer} className="me-2" />
            Retry
          </CButton>
        </CAlert>
      </div>
    )
  }







  return (
    <div className="manufacturing-erp-dashboard">
      {/* Error/Info Alert */}
      {error && dashboardData && (
        <CAlert
          color={isMockData ? (errorInfo?.isKnownBackendError ? "warning" : "info") : "danger"}
          dismissible
          className="m-3"
          onClose={() => setError(null)}
        >
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <strong>
                {isMockData
                  ? (errorInfo?.isKnownBackendError ? "⚠️ Backend Issue Detected:" : "ℹ️ Development Mode:")
                  : "❌ Error:"}
              </strong> {error}

              {isMockData && (
                <div className="mt-2 small">
                  <strong>Status:</strong> Using demo data while the issue is resolved.
                  {errorInfo?.isKnownBackendError && (
                    <div className="mt-1">
                      <strong>For Developers:</strong> Check backend logs and database configuration.
                    </div>
                  )}
                </div>
              )}

              {/* Technical details for developers */}
              {errorInfo?.technicalError && (
                <details className="mt-2">
                  <summary className="small text-muted cursor-pointer">Technical Details (Click to expand)</summary>
                  <div className="mt-1 small font-monospace text-muted">
                    <div><strong>HTTP Status:</strong> {errorInfo.httpStatus || 'N/A'}</div>
                    <div><strong>Backend Error:</strong> {errorInfo.technicalError}</div>
                    <div><strong>API Endpoint:</strong> /dashboard</div>
                    <div><strong>Base URL:</strong> https://dev-packwork.pazl.info/api/</div>
                  </div>
                </details>
              )}
            </div>

            {/* Quick action buttons */}
            {isMockData && errorInfo?.isKnownBackendError && (
              <div className="ms-3">
                <CButton
                  size="sm"
                  color="primary"
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  {loading ? <CSpinner size="sm" className="me-1" /> : '🔄'} Retry
                </CButton>
              </div>
            )}
          </div>
        </CAlert>
      )}

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
                      className="date-input"
                    />
                  </CCol>
                  <CCol>
                    <label className="form-label text-white-50 small">To Date</label>
                    <CFormInput
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                      className="date-input"
                    />
                  </CCol>
                  {/* <CCol xs="auto" className="d-flex align-items-end">
                    <CButton
                      className="bg-transparent border-white border-opacity-50 text-white me-2"
                      onClick={handleRefresh}
                      disabled={loading}
                      style={{ backdropFilter: 'blur(10px)' }}
                      title="Refresh Dashboard"
                    >
                      {loading ? <CSpinner size="sm" /> : <CIcon icon={cilSpeedometer} />}
                    </CButton>
                    <CButton
                      className="bg-transparent border-white border-opacity-50 text-white"
                      onClick={handleSearch}
                      disabled={isLoading}
                      style={{ backdropFilter: 'blur(10px)' }}
                    >
                      {isLoading ? <CSpinner size="sm" /> : <CIcon icon={cilSearch} />}
                    </CButton>
                  </CCol> */}
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
                {/* <CDropdown alignment="end" className="position-absolute" style={{ top: '10px', right: '10px' }}>
                  <CDropdownToggle color="transparent" caret={false} className="text-white p-1">
                    <CIcon icon={cilOptions} size="sm" />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem>View Details</CDropdownItem>
                    <CDropdownItem>Export Data</CDropdownItem>
                    <CDropdownItem>Set Alerts</CDropdownItem>
                    <CDropdownItem>Configure</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown> */}

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
                  <div className="widget-icon-container rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '60px', height: '60px' }}>
                    <CIcon icon={getIcon(widget.icon)} size="xl" />
                  </div>
                </div>

                {/* Progress toward target */}
                <div className="mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="opacity-75">Target Progress {Math.round(calculateProgressValue(widget))}%</small>
                    <small className="opacity-75">
                      {widget.target}
                    </small>
                  </div>
                  {/* <CProgress
                    value={Math.round(calculateProgressValue(widget))}
                    color="light"
                    style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }}
                  /> */}
                  <CProgress
                    value={Math.round(calculateProgressValue(widget))}
                    // color="success"
                    color={Math.round(calculateProgressValue(widget)) >= 100 ? 'success' : Math.round(calculateProgressValue(widget)) >= 50 ? 'warning' : 'danger'}

                  // className="custom-progress"
                  // style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)' }}
                  />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* Financial Overview */}
      {financialWidgets.length > 0 && (
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
                        <div className={`small ${widget.change?.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                          {(widget.change === "NaN%" ? '0%' : widget.change)}
                        </div>
                      </div>
                    </CCol>
                  ))}
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Charts Section */}
      {chartData.salesTrend.labels.length > 0 && (
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
      )}

      {/* Production Metrics & Employee Performance */}
      <CRow className="mb-4">
        {/* Production KPIs */}
        <CCol lg={12}>
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
                      // style={{ height: '8px' }}
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
        {/* <CCol lg={4}>
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
        </CCol> */}
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
                {/* <CFormSelect
                  size="sm"
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.1)',
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
                </CFormSelect> */}
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
                    {/* <CTableHeaderCell>Actions</CTableHeaderCell> */}
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
                          {(transaction.amount === "0") ? "N/A" : transaction.amount}
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
                      {/* <CTableDataCell>
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
                      </CTableDataCell> */}
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Quick Actions */}
      {/* <CRow>
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
      </CRow> */}
    </div>
  )
}

export default Dashboard