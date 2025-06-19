import React, { useState, useEffect } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CButton,
  CButtonGroup,
  CProgress,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAvatar,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CAlert,
  CBadge,
  CSpinner,
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
  cilOptions,
  cilSearch,
  cilPlus,
  cilArrowTop,
  cilArrowBottom,
  cilChart,
  cilPeople,
  cilDollar,
  cilPhone,
  cilEnvelopeClosed,
  cilCalendar,
  cilClock,
  cilCheckCircle,
  cilInfo,
  cilBell,
  cilCloudDownload,
} from '@coreui/icons'
import { CChartLine, CChartBar, CChartDoughnut } from '@coreui/react-chartjs'
import './DashboardTheme.css'

const ManufacturingDashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      message: '3 machines require maintenance this week',
      time: '1 hour ago',
      icon: cilCalculator
    },
    {
      id: 2,
      type: 'danger',
      message: '5 SKUs are below minimum stock level',
      time: '2 hours ago',
      icon: cilList
    },
    {
      id: 3,
      type: 'success',
      message: '15 work orders completed today',
      time: '3 hours ago',
      icon: cilCheckCircle
    },
    {
      id: 4,
      type: 'info',
      message: '8 new sales orders received',
      time: '4 hours ago',
      icon: cilCart
    }
  ])

  // Manufacturing & Business KPI Widgets
  const businessMetrics = [
    {
      title: 'Sales Orders',
      value: '248',
      change: '+18.5%',
      trend: 'up',
      description: 'Orders this month',
      color: 'primary',
      icon: cilCart,
      target: '300',
      details: { pending: 45, processing: 123, completed: 80 }
    },
    {
      title: 'Work Orders',
      value: '156',
      change: '+12.3%',
      trend: 'up',
      description: 'Active production',
      color: 'warning',
      icon: cilPencil,
      target: '180',
      details: { scheduled: 32, inProgress: 89, completed: 35 }
    },
    {
      title: 'Machine Efficiency',
      value: '87.5%',
      change: '+5.2%',
      trend: 'up',
      description: 'Overall utilization',
      color: 'info',
      icon: cilCalculator,
      target: '90%',
      details: { operational: 12, maintenance: 2, idle: 1 }
    },
    {
      title: 'Revenue',
      value: '₹12.4L',
      change: '+22.7%',
      trend: 'up',
      description: 'Monthly revenue',
      color: 'success',
      icon: cilDollar,
      target: '₹15L',
      details: { sales: '₹10.2L', services: '₹2.2L' }
    },
    {
      title: 'Inventory Value',
      value: '₹8.7L',
      change: '-3.1%',
      trend: 'down',
      description: 'Current stock value',
      color: 'danger',
      icon: cilList,
      target: '₹9L',
      details: { rawMaterial: '₹4.2L', finished: '₹3.1L', wip: '₹1.4L' }
    },
    {
      title: 'Active Employees',
      value: '127',
      change: '+2.4%',
      trend: 'up',
      description: 'Present today',
      color: 'secondary',
      icon: cilUser,
      target: '130',
      details: { production: 89, admin: 23, maintenance: 15 }
    }
  ]

  // Recent Sales Orders Data
  const recentSalesOrders = [
    {
      id: 'SO-2024-1156',
      client: 'Mahindra Auto',
      items: 12,
      value: '₹2,45,000',
      status: 'Processing',
      priority: 'High',
      dueDate: '2024-07-25',
      assignedTo: 'Rajesh K.'
    },
    {
      id: 'SO-2024-1157',
      client: 'Tata Motors',
      items: 8,
      value: '₹1,87,500',
      status: 'Pending',
      priority: 'Medium',
      dueDate: '2024-07-28',
      assignedTo: 'Priya S.'
    },
    {
      id: 'SO-2024-1158',
      client: 'Bajaj Industries',
      items: 15,
      value: '₹3,12,000',
      status: 'Completed',
      priority: 'High',
      dueDate: '2024-07-20',
      assignedTo: 'Amit P.'
    },
    {
      id: 'SO-2024-1159',
      client: 'Hero MotoCorp',
      items: 6,
      value: '₹95,000',
      status: 'Processing',
      priority: 'Low',
      dueDate: '2024-08-02',
      assignedTo: 'Sunita M.'
    }
  ]

  // Stock Level Alerts
  const stockAlerts = [
    { sku: 'SKU-001', name: 'Steel Plates 10mm', currentStock: 45, minLevel: 50, status: 'Low' },
    { sku: 'SKU-023', name: 'Hydraulic Cylinders', currentStock: 8, minLevel: 15, status: 'Critical' },
    { sku: 'SKU-045', name: 'Rubber Gaskets', currentStock: 120, minLevel: 100, status: 'Good' },
    { sku: 'SKU-067', name: 'Ball Bearings', currentStock: 25, minLevel: 30, status: 'Low' }
  ]

  // Machine Status Data
  const machineStatus = [
    { id: 'M-001', name: 'CNC Lathe #1', status: 'Running', efficiency: 92, operator: 'Ravi S.' },
    { id: 'M-002', name: 'Hydraulic Press', status: 'Maintenance', efficiency: 0, operator: 'N/A' },
    { id: 'M-003', name: 'Welding Station #2', status: 'Running', efficiency: 88, operator: 'Kiran P.' },
    { id: 'M-004', name: 'Assembly Line #1', status: 'Idle', efficiency: 0, operator: 'Team A' }
  ]

  // Financial Overview Data
  const financialData = [
    { type: 'Purchase Orders', amount: '₹6.2L', count: 34, status: 'Pending' },
    { type: 'GRN Processed', amount: '₹4.8L', count: 28, status: 'Completed' },
    { type: 'Credit Notes', amount: '₹45,000', count: 7, status: 'Issued' },
    { type: 'Debit Notes', amount: '₹23,000', count: 4, status: 'Pending' }
  ]

  // Chart Data for Production Trends
  const productionTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Production Output',
        data: [1200, 1350, 1180, 1420],
        borderColor: '#e67e22',
        backgroundColor: '#e67e2220',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Sales Orders',
        data: [980, 1120, 1050, 1180],
        borderColor: '#3498db',
        backgroundColor: '#3498db20',
        tension: 0.4,
        fill: true
      }
    ]
  }

  // Work Order Status Distribution
  const workOrderStatusData = {
    labels: ['Scheduled', 'In Progress', 'Quality Check', 'Completed', 'On Hold'],
    datasets: [{
      data: [32, 89, 15, 35, 8],
      backgroundColor: [
        '#3498db',
        '#e67e22', 
        '#f39c12',
        '#27ae60',
        '#e74c3c'
      ]
    }]
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Processing': { color: 'warning', bg: '#f39c12' },
      'Pending': { color: 'info', bg: '#3498db' },
      'Completed': { color: 'success', bg: '#27ae60' },
      'Running': { color: 'success', bg: '#27ae60' },
      'Maintenance': { color: 'warning', bg: '#f39c12' },
      'Idle': { color: 'secondary', bg: '#6c757d' },
      'Critical': { color: 'danger', bg: '#e74c3c' },
      'Low': { color: 'warning', bg: '#f39c12' },
      'Good': { color: 'success', bg: '#27ae60' }
    }
    return statusConfig[status] || { color: 'secondary', bg: '#6c757d' }
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'High': '#e74c3c',
      'Medium': '#f39c12', 
      'Low': '#27ae60'
    }
    return colors[priority] || '#6c757d'
  }

  // Handle date range changes
  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }))
  }

  const handleSearch = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const dismissAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId))
  }

  return (
    <div className="dashboard-container">
      {/* Manufacturing Dashboard Header */}
      <CCard className="dashboard-header mb-4">
        <CCardBody>
          <CRow className="align-items-center">
            <CCol md={6}>
              <h2 className="mb-2">Manufacturing & Inventory Dashboard</h2>
              <p className="mb-0 opacity-75">
                Real-time overview of your manufacturing operations and business metrics
              </p>
            </CCol>
            <CCol md={6}>
              <div className="date-range-container">
                <CRow className="g-2">
                  <CCol>
                    <label className="form-label text-muted small">From Date</label>
                    <CFormInput
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                      className="date-input"
                    />
                  </CCol>
                  <CCol>
                    <label className="form-label text-muted small">To Date</label>
                    <CFormInput
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                      className="date-input"
                    />
                  </CCol>
                  <CCol xs="auto" className="d-flex align-items-end">
                    <CButton 
                      className="btn-primary-enhanced"
                      onClick={handleSearch}
                      disabled={isLoading}
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
            {alerts.map((alert) => (
              <CAlert
                key={alert.id}
                color={alert.type}
                dismissible
                onClose={() => dismissAlert(alert.id)}
                className={`alert-${alert.type}-enhanced`}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex align-items-center">
                    <CIcon icon={alert.icon} className="me-2" />
                    <span>{alert.message}</span>
                  </div>
                  <small className="opacity-75">{alert.time}</small>
                </div>
              </CAlert>
            ))}
          </CCol>
        </CRow>
      )}

      {/* Business Metrics Widgets */}
      <CRow className="mb-4" xs={{ gutter: 4 }}>
        {businessMetrics.map((metric, index) => (
          <CCol sm={6} xl={4} xxl={2} key={index}>
            <CCard className={`widget-stat-enhanced ${metric.color} text-white`}>
              <CCardBody className="position-relative">
                <CDropdown alignment="end" className="dropdown-enhanced position-absolute" style={{ top: '15px', right: '15px' }}>
                  <CDropdownToggle color="transparent" caret={false} className="text-white p-1">
                    <CIcon icon={cilOptions} size="sm" />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem>View Details</CDropdownItem>
                    <CDropdownItem>Export Data</CDropdownItem>
                    <CDropdownItem>Set Alerts</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>

                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="flex-grow-1">
                    <div className="fs-6 fw-medium opacity-75">{metric.title}</div>
                    <div className="widget-value">{metric.value}</div>
                    <div className={`widget-change ${metric.trend === 'up' ? 'positive' : 'negative'}`}>
                      <CIcon 
                        icon={metric.trend === 'up' ? cilArrowTop : cilArrowBottom}
                        className="me-1"
                        size="sm"
                      />
                      {metric.change}
                    </div>
                    <div className="fs-7 opacity-75 mt-1">{metric.description}</div>
                    <div className="fs-7 opacity-50 mt-1">Target: {metric.target}</div>
                  </div>
                  <div className="widget-icon-enhanced flex-shrink-0">
                    <CIcon icon={metric.icon} size="lg" />
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* Charts Section */}
      <CRow className="mb-4">
        <CCol lg={8}>
          <CCard className="card-enhanced">
            <CCardHeader className="card-header-enhanced">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Production & Sales Trends</h5>
                <CButtonGroup>
                  {['Week', 'Month', 'Quarter', 'Year'].map((period) => (
                    <CButton
                      key={period}
                      size="sm"
                      variant="outline"
                      color="light"
                      className={period === 'Week' ? 'active' : ''}
                    >
                      {period}
                    </CButton>
                  ))}
                </CButtonGroup>
              </div>
            </CCardHeader>
            <CCardBody>
              <CChartLine
                data={productionTrendData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
                style={{ height: '300px' }}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg={4}>
          <CCard className="card-enhanced h-100">
            <CCardHeader className="card-header-enhanced warning">
              <h5 className="mb-0">Work Order Status</h5>
            </CCardHeader>
            <CCardBody className="d-flex align-items-center">
              <CChartDoughnut
                data={workOrderStatusData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                    },
                  },
                }}
                style={{ height: '250px' }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Business Overview Cards */}
      <CRow className="mb-4">
        {/* Stock Alerts */}
        <CCol lg={6}>
          <CCard className="card-enhanced h-100">
            <CCardHeader className="card-header-enhanced danger">
              <h5 className="mb-0">Inventory Alerts</h5>
            </CCardHeader>
            <CCardBody>
              {stockAlerts.map((item, index) => {
                const statusBadge = getStatusBadge(item.status)
                return (
                  <div key={index} className="mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{item.name}</div>
                        <small className="text-muted">{item.sku}</small>
                        <div className="mt-1">
                          <small>Stock: {item.currentStock} | Min: {item.minLevel}</small>
                        </div>
                      </div>
                      <CBadge 
                        style={{ backgroundColor: statusBadge.bg, color: 'white' }}
                      >
                        {item.status}
                      </CBadge>
                    </div>
                    <CProgress 
                      value={(item.currentStock / item.minLevel) * 100}
                      color={statusBadge.color}
                      className="mt-2"
                      style={{ height: '6px' }}
                    />
                  </div>
                )
              })}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Machine Status */}
        <CCol lg={6}>
          <CCard className="card-enhanced h-100">
            <CCardHeader className="card-header-enhanced info">
              <h5 className="mb-0">Machine Status</h5>
            </CCardHeader>
            <CCardBody>
              {machineStatus.map((machine, index) => {
                const statusBadge = getStatusBadge(machine.status)
                return (
                  <div key={index} className="mb-3 pb-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{machine.name}</div>
                        <small className="text-muted">{machine.id} | {machine.operator}</small>
                        <div className="mt-1">
                          <small>Efficiency: {machine.efficiency}%</small>
                        </div>
                      </div>
                      <CBadge 
                        style={{ backgroundColor: statusBadge.bg, color: 'white' }}
                      >
                        {machine.status}
                      </CBadge>
                    </div>
                    {machine.efficiency > 0 && (
                      <CProgress 
                        value={machine.efficiency}
                        color={machine.efficiency > 80 ? 'success' : machine.efficiency > 60 ? 'warning' : 'danger'}
                        className="mt-2"
                        style={{ height: '6px' }}
                      />
                    )}
                  </div>
                )
              })}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Financial Overview */}
      <CRow className="mb-4">
        <CCol>
          <CCard className="card-enhanced">
            <CCardHeader className="card-header-enhanced success">
              <h5 className="mb-0">Financial Overview</h5>
            </CCardHeader>
            <CCardBody>
              <CRow>
                {financialData.map((item, index) => (
                  <CCol md={3} key={index}>
                    <div className="performance-metric">
                      <h6>{item.type}</h6>
                      <div className="fw-bold text-success fs-4">{item.amount}</div>
                      <div className="text-muted small">
                        {item.count} items • {item.status}
                      </div>
                    </div>
                  </CCol>
                ))}
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Recent Sales Orders Table */}
      <CRow>
        <CCol>
          <CCard className="card-enhanced">
            <CCardHeader className="card-header-enhanced">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Sales Orders</h5>
                <div className="d-flex gap-2">
                  <CBadge color="primary" className="fs-6">
                    {recentSalesOrders.length} orders
                  </CBadge>
                  <CButton size="sm" className="btn-primary-enhanced">
                    <CIcon icon={cilPlus} className="me-1" />
                    New Order
                  </CButton>
                </div>
              </div>
            </CCardHeader>
            <CCardBody className="p-0">
              <CTable hover responsive className="table-enhanced">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Order ID</CTableHeaderCell>
                    <CTableHeaderCell>Client</CTableHeaderCell>
                    <CTableHeaderCell>Items</CTableHeaderCell>
                    <CTableHeaderCell>Value</CTableHeaderCell>
                    <CTableHeaderCell>Priority</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Due Date</CTableHeaderCell>
                    <CTableHeaderCell>Assigned To</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {recentSalesOrders.map((order) => {
                    const statusBadge = getStatusBadge(order.status)
                    return (
                      <CTableRow key={order.id}>
                        <CTableDataCell>
                          <div className="fw-semibold">{order.id}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="fw-semibold">{order.client}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color="info">{order.items} items</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="fw-bold text-success">{order.value}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge 
                            style={{ 
                              backgroundColor: getPriorityColor(order.priority), 
                              color: 'white' 
                            }}
                          >
                            {order.priority}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge 
                            style={{ 
                              backgroundColor: statusBadge.bg, 
                              color: 'white' 
                            }}
                          >
                            {order.status}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="small">
                            <CIcon icon={cilCalendar} className="me-1" />
                            {order.dueDate}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <span className="fw-medium">{order.assignedTo}</span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CDropdown>
                            <CDropdownToggle size="sm" className="btn-primary-enhanced">
                              <CIcon icon={cilOptions} />
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem>
                                <CIcon icon={cilChart} className="me-2" />
                                View Details
                              </CDropdownItem>
                              <CDropdownItem>
                                <CIcon icon={cilPencil} className="me-2" />
                                Edit Order
                              </CDropdownItem>
                              <CDropdownItem>
                                <CIcon icon={cilEnvelopeClosed} className="me-2" />
                                Contact Client
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Quick Actions */}
      <CRow className="mt-4">
        <CCol>
          <div className="quick-actions">
            <h6 className="mb-3">Quick Actions</h6>
            <div className="d-flex flex-wrap gap-2">
              <CButton className="quick-action-btn">
                <CIcon icon={cilCart} className="me-1" />
                New Sales Order
              </CButton>
              <CButton className="quick-action-btn success">
                <CIcon icon={cilPencil} className="me-1" />
                Create Work Order
              </CButton>
              <CButton className="quick-action-btn info">
                <CIcon icon={cilList} className="me-1" />
                Add SKU
              </CButton>
              <CButton className="quick-action-btn warning">
                <CIcon icon={cilUserPlus} className="me-1" />
                Add Client
              </CButton>
              <CButton className="quick-action-btn secondary">
                <CIcon icon={cilCalculator} className="me-1" />
                Machine Report
              </CButton>
              <CButton className="quick-action-btn">
                <CIcon icon={cilCloudDownload} className="me-1" />
                Export Data
              </CButton>
            </div>
          </div>
        </CCol>
      </CRow>
    </div>
  )
}

export default ManufacturingDashboard