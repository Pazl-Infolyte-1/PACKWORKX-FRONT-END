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
  cilPieChart
} from '@coreui/icons'
import { CChartBar, CChartLine, CChartDoughnut, CChartPie } from '@coreui/react-chartjs'
import './DashboardTheme.css'

const ManufacturingERPDashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Color theme for manufacturing dashboard
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

  // Manufacturing alerts
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'danger',
      message: 'Critical: Machine M-001 requires immediate maintenance',
      time: '30 minutes ago',
      icon: cilWarning,
      module: 'Maintenance'
    },
    {
      id: 2,
      type: 'warning', 
      message: 'Low stock alert: SKU-12345 inventory below minimum level',
      time: '2 hours ago',
      icon: cilList,
      module: 'Inventory'
    },
    {
      id: 3,
      type: 'success',
      message: 'Production target achieved: 105% of daily goal completed',
      time: '4 hours ago',
      icon: cilCheckCircle,
      module: 'Production'
    },
    {
      id: 4,
      type: 'info',
      message: 'New purchase order PO-2024-001 awaiting approval',
      time: '1 day ago',
      icon: cilInfo,
      module: 'Procurement'
    }
  ])

  // Main ERP widgets with all modules
  const erpWidgets = [
    {
      title: 'Sales Orders',
      value: '847',
      change: '+12.4%',
      trend: 'up',
      description: 'Active orders',
      color: themeColors.sales,
      icon: cilCart,
      bgGradient: `linear-gradient(135deg, ${themeColors.sales} 0%, #27ae60 100%)`,
      target: '1000',
      urgentCount: 23
    },
    {
      title: 'Work Orders',
      value: '156',
      change: '+8.7%',
      trend: 'up', 
      description: 'In production',
      color: themeColors.production,
      icon: cilPencil,
      bgGradient: `linear-gradient(135deg, ${themeColors.production} 0%, #c0392b 100%)`,
      target: '200',
      urgentCount: 12
    },
    {
      title: 'SKU Inventory',
      value: '12,450',
      change: '-3.2%',
      trend: 'down',
      description: 'Total items',
      color: themeColors.inventory,
      icon: cilList,
      bgGradient: `linear-gradient(135deg, ${themeColors.inventory} 0%, #2980b9 100%)`,
      target: '15000',
      urgentCount: 45
    },
    {
      title: 'Active Machines',
      value: '89/95',
      change: '+2.1%', 
      trend: 'up',
      description: 'Operational status',
      color: themeColors.maintenance,
      icon: cilCalculator,
      bgGradient: `linear-gradient(135deg, ${themeColors.maintenance} 0%, #d35400 100%)`,
      target: '95',
      urgentCount: 6
    },
    {
      title: 'Employees',
      value: '324',
      change: '+1.8%',
      trend: 'up',
      description: 'Active workforce',
      color: themeColors.hr,
      icon: cilUser,
      bgGradient: `linear-gradient(135deg, ${themeColors.hr} 0%, #16a085 100%)`,
      target: '350',
      urgentCount: 8
    },
    {
      title: 'Clients/Vendors',
      value: '1,234',
      change: '+5.4%',
      trend: 'up',
      description: 'Active partners',
      color: themeColors.finance,
      icon: cilUserPlus,
      bgGradient: `linear-gradient(135deg, ${themeColors.finance} 0%, #2c3e50 100%)`,
      target: '1500',
      urgentCount: 15
    },
    {
      title: 'Purchase Orders',
      value: '89',
      change: '+15.2%',
      trend: 'up',
      description: 'Pending orders',
      color: themeColors.purchase,
      icon: cilTruck,
      bgGradient: `linear-gradient(135deg, ${themeColors.purchase} 0%, #e67e22 100%)`,
      target: '120',
      urgentCount: 7
    },
    {
      title: 'Monthly Revenue',
      value: '$2.4M',
      change: '+18.9%',
      trend: 'up',
      description: 'Total earnings',
      color: themeColors.quality,
      icon: cilDollar,
      bgGradient: `linear-gradient(135deg, ${themeColors.quality} 0%, #8e44ad 100%)`,
      target: '$3M',
      urgentCount: 0
    }
  ]

  // Financial overview widgets  
  const financialWidgets = [
    {
      title: 'GRN Processed',
      value: '456',
      change: '+7.8%',
      description: 'Goods received',
      color: themeColors.inventory,
      icon: cilHome,
      amount: '$1.2M'
    },
    {
      title: 'Purchase Returns',
      value: '23',
      change: '-12.5%',
      description: 'Returns this month',
      color: themeColors.production,
      icon: cilArrowBottom,
      amount: '$45K'
    },
    {
      title: 'Sale Returns',
      value: '34',
      change: '-8.9%',
      description: 'Customer returns',
      color: themeColors.sales,
      icon: cilArrowTop,
      amount: '$67K'
    },
    {
      title: 'Stock Adjustments',
      value: '89',
      change: '+4.2%',
      description: 'Inventory corrections',
      color: themeColors.maintenance,
      icon: cilSettings,
      amount: '$23K'
    },
    {
      title: 'Credit Notes',
      value: '67',
      change: '-6.7%',
      description: 'Issued credits',
      color: themeColors.finance,
      icon: cilCreditCard,
      amount: '$156K'
    },
    {
      title: 'Debit Notes',
      value: '45',
      change: '+11.3%',
      description: 'Issued debits',
      color: themeColors.quality,
      icon: cilFile,
      amount: '$89K'
    }
  ]

  // Production metrics
  const productionMetrics = [
    { 
      label: 'Daily Production Target', 
      current: 1247, 
      target: 1200, 
      color: themeColors.production,
      unit: 'units',
      efficiency: 104
    },
    { 
      label: 'Quality Pass Rate', 
      current: 96.8, 
      target: 95, 
      color: themeColors.quality,
      unit: '%',
      efficiency: 102
    },
    { 
      label: 'Machine Utilization', 
      current: 87.5, 
      target: 85, 
      color: themeColors.maintenance,
      unit: '%',
      efficiency: 103
    },
    { 
      label: 'On-time Delivery', 
      current: 92.3, 
      target: 95, 
      color: themeColors.sales,
      unit: '%',
      efficiency: 97
    }
  ]

  // Recent transactions table data
  const recentTransactions = [
    {
      id: 1,
      type: 'Sales Order',
      reference: 'SO-2024-001',
      client: 'TechCorp Industries',
      amount: '$125,000',
      status: 'Confirmed',
      date: '2024-06-18',
      priority: 'High',
      icon: cilCart,
      color: themeColors.sales
    },
    {
      id: 2,
      type: 'Purchase Order',
      reference: 'PO-2024-156',
      client: 'Raw Materials Ltd',
      amount: '$45,000',
      status: 'Pending',
      date: '2024-06-17',
      priority: 'Medium',
      icon: cilTruck,
      color: themeColors.purchase
    },
    {
      id: 3,
      type: 'Work Order',
      reference: 'WO-2024-089',
      client: 'Internal Production',
      amount: '$23,000',
      status: 'In Progress',
      date: '2024-06-16',
      priority: 'High',
      icon: cilPencil,
      color: themeColors.production
    },
    {
      id: 4,
      type: 'GRN',
      reference: 'GRN-2024-234',
      client: 'Steel Suppliers Inc',
      amount: '$67,000',
      status: 'Received',
      date: '2024-06-15',
      priority: 'Low',
      icon: cilHome,
      color: themeColors.inventory
    },
    {
      id: 5,
      type: 'Credit Note',
      reference: 'CN-2024-012',
      client: 'Quality Electronics',
      amount: '$12,000',
      status: 'Issued',
      date: '2024-06-14',
      priority: 'Medium',
      icon: cilCreditCard,
      color: themeColors.finance
    }
  ]

  // Chart data for various analytics
  const salesTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales Orders',
        data: [650, 590, 800, 810, 756, 847],
        borderColor: themeColors.sales,
        backgroundColor: `${themeColors.sales}20`,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Purchase Orders',
        data: [280, 250, 320, 340, 298, 365],
        borderColor: themeColors.purchase,
        backgroundColor: `${themeColors.purchase}20`,
        fill: true,
        tension: 0.4
      }
    ]
  }

  const inventoryDistribution = {
    labels: ['Raw Materials', 'Work in Progress', 'Finished Goods', 'Packaging', 'Consumables'],
    datasets: [{
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        themeColors.inventory,
        themeColors.production, 
        themeColors.sales,
        themeColors.maintenance,
        themeColors.quality
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  }

  const machineEfficiency = {
    labels: ['M-001', 'M-002', 'M-003', 'M-004', 'M-005', 'M-006'],
    datasets: [{
      label: 'Efficiency %',
      data: [95, 88, 92, 78, 96, 89],
      backgroundColor: [
        themeColors.maintenance,
        themeColors.production,
        themeColors.maintenance, 
        themeColors.production,
        themeColors.maintenance,
        themeColors.production
      ],
      borderRadius: 8
    }]
  }

  // Helper functions
  const getStatusBadge = (status) => {
    const statusStyles = {
      'Confirmed': 'success',
      'Pending': 'warning',
      'In Progress': 'info',
      'Received': 'primary',
      'Issued': 'secondary',
      'Cancelled': 'danger'
    }
    return statusStyles[status] || 'secondary'
  }

  const getPriorityColor = (priority) => {
    const priorityColors = {
      'High': 'danger',
      'Medium': 'warning', 
      'Low': 'success'
    }
    return priorityColors[priority] || 'secondary'
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
                Manufacturing ERP Dashboard
              </h2>
              <p className="mb-0 opacity-75">
                Real-time overview of your manufacturing operations and business processes
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
                className="border-0 shadow-sm"
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex align-items-center">
                    <CIcon icon={alert.icon} className="me-2" />
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

      {/* Navigation Tabs */}
      <CRow className="mb-4">
        <CCol>
          <CCard className="border-0 shadow-sm">
            <CCardBody className="p-2">
              <CButtonGroup className="w-100">
                {[
                  { key: 'overview', label: 'Overview', icon: cilSpeedometer },
                  { key: 'production', label: 'Production', icon: cilFactory },
                  { key: 'inventory', label: 'Inventory', icon: cilList },
                  { key: 'finance', label: 'Finance', icon: cilDollar },
                  { key: 'analytics', label: 'Analytics', icon: cilChart }
                ].map((tab) => (
                  <CButton
                    key={tab.key}
                    variant={activeTab === tab.key ? 'solid' : 'outline'}
                    color={activeTab === tab.key ? 'primary' : 'light'}
                    onClick={() => setActiveTab(tab.key)}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <CIcon icon={tab.icon} className="me-2" />
                    {tab.label}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

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
                    <CIcon icon={widget.icon} size="xl" />
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
                        <CIcon icon={widget.icon} size="lg" />
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

      {/* Production Metrics & Charts */}
      <CRow className="mb-4">
        {/* Production KPIs */}
        <CCol lg={6}>
          <CCard className="border-0 shadow-sm h-100">
            <CCardHeader 
              style={{ 
                background: `linear-gradient(135deg, ${themeColors.production} 0%, ${themeColors.maintenance} 100%)`,
                color: 'white' 
              }}
            >
              <h5 className="mb-0 d-flex align-items-center">
                <CIcon icon={cilBarChart} className="me-2" />
                Production KPIs
              </h5>
            </CCardHeader>
            <CCardBody>
              {productionMetrics.map((metric, index) => (
                <div key={index} className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <div className="fw-semibold">{metric.label}</div>
                      <small className="text-muted">
                        {metric.current}{metric.unit} / {metric.target}{metric.unit}
                      </small>
                    </div>
                    <div className="text-end">
                      <CBadge 
                        color={metric.efficiency >= 100 ? 'success' : metric.efficiency >= 90 ? 'warning' : 'danger'}
                      >
                        {metric.efficiency}% Efficiency
                      </CBadge>
                    </div>
                  </div>
                  <CProgress 
                    value={(metric.current / metric.target) * 100}
                    color={metric.efficiency >= 100 ? 'success' : metric.efficiency >= 90 ? 'warning' : 'danger'}
                    style={{ height: '12px' }}
                  />
                </div>
              ))}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Inventory Distribution Chart */}
        <CCol lg={6}>
          <CCard className="border-0 shadow-sm h-100">
            <CCardHeader 
              style={{ 
                background: `linear-gradient(135deg, ${themeColors.inventory} 0%, ${themeColors.sales} 100%)`,
                color: 'white' 
              }}
            >
              <h5 className="mb-0 d-flex align-items-center">
                <CIcon icon={cilPieChart} className="me-2" />
                Inventory Distribution
              </h5>
            </CCardHeader>
            <CCardBody>
              <div style={{ height: '300px' }}>
                <CChartDoughnut
                  data={inventoryDistribution}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          usePointStyle: true,
                          padding: 20
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
                  data={salesTrendData}
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

        {/* Machine Efficiency */}
        <CCol lg={4}>
          <CCard className="border-0 shadow-sm h-100">
            <CCardHeader 
              style={{ 
                background: `linear-gradient(135deg, ${themeColors.maintenance} 0%, ${themeColors.production} 100%)`,
                color: 'white' 
              }}
            >
              <h5 className="mb-0 d-flex align-items-center">
                <CIcon icon={cilCalculator} className="me-2" />
                Machine Efficiency
              </h5>
            </CCardHeader>
            <CCardBody>
              <div style={{ height: '330px' }}>
                <CChartBar
                  data={machineEfficiency}
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
                            <CIcon icon={transaction.icon} />
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
                {[
                  { label: 'New Sales Order', icon: cilCart, color: themeColors.sales },
                  { label: 'Create Work Order', icon: cilPencil, color: themeColors.production },
                  { label: 'Add SKU', icon: cilList, color: themeColors.inventory },
                  { label: 'Purchase Order', icon: cilTruck, color: themeColors.purchase },
                  { label: 'Process GRN', icon: cilHome, color: themeColors.inventory },
                  { label: 'Add Employee', icon: cilUser, color: themeColors.hr },
                  { label: 'Credit Note', icon: cilCreditCard, color: themeColors.finance },
                  { label: 'Stock Adjustment', icon: cilSettings, color: themeColors.maintenance }
                ].map((action, index) => (
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
                  >
                    <CIcon icon={action.icon} className="me-2" />
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

export default ManufacturingERPDashboard