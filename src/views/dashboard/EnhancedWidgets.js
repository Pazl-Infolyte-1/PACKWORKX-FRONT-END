import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
  CCard,
  CCardBody,
  CCardHeader,
  CProgress,
  CButton,
  CBadge,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { 
  cilArrowBottom, 
  cilArrowTop, 
  cilOptions,
  cilPeople,
  cilDollar,
  cilChart,
  cilPhone,
  cilEnvelopeClosed,
  cilCalendar,
  cilClock,
  cilCheckCircle,
  cilBell
} from '@coreui/icons'

const EnhancedWidgetsDropdown = (props) => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)
  const [timeFilter, setTimeFilter] = useState('month')

  // Landing page theme colors
  const themeColors = {
    primary: '#e67e22',
    secondary: '#2c3e50',
    background: '#34495e',
    success: '#27ae60',
    warning: '#f39c12',
    danger: '#e74c3c',
    info: '#3498db'
  }

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = themeColors.primary
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = themeColors.info
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])

  // Enhanced CRM widget data
  const crmWidgetData = [
    {
      title: 'Total Leads',
      value: '2,847',
      change: '+12.4%',
      trend: 'up',
      color: themeColors.primary,
      bgGradient: `linear-gradient(135deg, ${themeColors.primary} 0%, #d35400 100%)`,
      icon: cilPeople,
      description: 'New leads this month',
      chartData: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          data: [650, 590, 800, 810],
          borderColor: 'rgba(255,255,255,0.8)',
          backgroundColor: 'rgba(255,255,255,0.2)',
          pointBackgroundColor: 'white',
          fill: true,
          tension: 0.4
        }]
      }
    },
    {
      title: 'Revenue',
      value: '$847K',
      change: '+15.2%',
      trend: 'up',
      color: themeColors.info,
      bgGradient: `linear-gradient(135deg, ${themeColors.info} 0%, #2980b9 100%)`,
      icon: cilDollar,
      description: 'Monthly recurring revenue',
      chartData: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          data: [180, 220, 190, 250],
          borderColor: 'rgba(255,255,255,0.8)',
          backgroundColor: 'rgba(255,255,255,0.2)',
          pointBackgroundColor: 'white',
          fill: true,
          tension: 0.4
        }]
      }
    },
    {
      title: 'Conversion Rate',
      value: '24.8%',
      change: '-2.1%',
      trend: 'down',
      color: themeColors.warning,
      bgGradient: `linear-gradient(135deg, ${themeColors.warning} 0%, ${themeColors.primary} 100%)`,
      icon: cilArrowTop,
      description: 'Lead to customer conversion',
      chartData: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          data: [26.2, 25.8, 23.5, 24.8],
          backgroundColor: 'rgba(255,255,255,0.3)',
          borderColor: 'rgba(255,255,255,0.7)',
          borderWidth: 1
        }]
      }
    },
    {
      title: 'Active Deals',
      value: '156',
      change: '+8.7%',
      trend: 'up',
      color: themeColors.success,
      bgGradient: `linear-gradient(135deg, ${themeColors.success} 0%, #229954 100%)`,
      icon: cilChart,
      description: 'Deals in pipeline',
      chartData: {
        labels: ['Prospecting', 'Qualified', 'Proposal', 'Negotiation', 'Closed'],
        datasets: [{
          data: [45, 32, 28, 18, 12],
          backgroundColor: [
            'rgba(255,255,255,0.3)',
            'rgba(255,255,255,0.4)', 
            'rgba(255,255,255,0.5)',
            'rgba(255,255,255,0.6)',
            'rgba(255,255,255,0.7)'
          ],
          borderColor: 'rgba(255,255,255,0.8)',
          borderWidth: 1
        }]
      }
    }
  ]

  // Team performance data
  const teamPerformance = [
    { name: 'Sarah Johnson', deals: 12, revenue: '$125K', target: 15, color: themeColors.success },
    { name: 'Mike Chen', deals: 10, revenue: '$98K', target: 12, color: themeColors.info },
    { name: 'Emma Davis', deals: 8, revenue: '$87K', target: 10, color: themeColors.warning },
    { name: 'John Smith', deals: 7, revenue: '$76K', target: 9, color: themeColors.primary }
  ]

  // Recent activities
  const recentActivities = [
    { 
      type: 'call', 
      message: 'Called TechCorp Inc. - Demo scheduled', 
      time: '2 hours ago',
      icon: cilPhone,
      color: themeColors.success
    },
    { 
      type: 'email', 
      message: 'Proposal sent to Digital Solutions', 
      time: '4 hours ago',
      icon: cilEnvelopeClosed,
      color: themeColors.info
    },
    { 
      type: 'meeting', 
      message: 'Meeting with Startup Hub completed', 
      time: '1 day ago',
      icon: cilCalendar,
      color: themeColors.warning
    },
    { 
      type: 'deal', 
      message: 'Deal closed with Growth Ventures', 
      time: '2 days ago',
      icon: cilCheckCircle,
      color: themeColors.primary
    }
  ]

  return (
    <div className={props.className}>
      {/* Main CRM Widgets */}
      <CRow xs={{ gutter: 4 }} className="mb-4">
        {crmWidgetData.map((widget, index) => (
          <CCol sm={6} xl={3} key={index}>
            <CCard 
              className="text-white overflow-hidden border-0 shadow-sm"
              style={{ 
                background: widget.bgGradient,
                minHeight: '180px'
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
                    <CDropdownItem>Set Goals</CDropdownItem>
                    <CDropdownItem>Configure Alerts</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>

                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="flex-grow-1">
                    <div className="fs-6 fw-medium opacity-75">{widget.title}</div>
                    <div className="fs-2 fw-bold mb-1">{widget.value}</div>
                    <div className="d-flex align-items-center">
                      <CIcon 
                        icon={widget.trend === 'up' ? cilArrowTop : cilArrowBottom}
                        className="me-1"
                        size="sm"
                      />
                      <span className="fs-6 fw-medium">{widget.change}</span>
                    </div>
                    <div className="fs-7 opacity-75 mt-1">{widget.description}</div>
                  </div>
                  <div 
                    className="bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '50px', height: '50px' }}
                  >
                    <CIcon icon={widget.icon} size="lg" />
                  </div>
                </div>

                {/* Mini Chart */}
                <div style={{ height: '60px' }}>
                  {index === 2 ? (
                    <CChartBar
                      data={widget.chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { display: false },
                          y: { display: false }
                        }
                      }}
                    />
                  ) : index === 3 ? (
                    <CChartBar
                      data={widget.chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { display: false },
                          y: { display: false }
                        }
                      }}
                    />
                  ) : (
                    <CChartLine
                      ref={index === 0 ? widgetChartRef1 : widgetChartRef2}
                      data={widget.chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { display: false },
                          y: { display: false }
                        },
                        elements: {
                          point: { radius: 2 },
                          line: { borderWidth: 2 }
                        }
                      }}
                    />
                  )}
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* Additional CRM Information Panels */}
      <CRow className="mb-4">
        {/* Team Performance */}
        <CCol lg={6}>
          <CCard className="h-100">
            <CCardHeader 
              style={{ 
                background: `linear-gradient(135deg, ${themeColors.secondary} 0%, ${themeColors.background} 100%)`,
                color: 'white' 
              }}
              className="d-flex justify-content-between align-items-center"
            >
              <h6 className="mb-0">Top Performers This Month</h6>
              <CBadge color="light" style={{ color: themeColors.secondary }}>
                {teamPerformance.length} team members
              </CBadge>
            </CCardHeader>
            <CCardBody>
              {teamPerformance.map((member, index) => {
                const progressPercentage = (member.deals / member.target) * 100
                return (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <div className="fw-semibold">{member.name}</div>
                        <small className="text-muted">{member.deals}/{member.target} deals • {member.revenue}</small>
                      </div>
                      <CBadge 
                        color={progressPercentage >= 80 ? 'success' : progressPercentage >= 60 ? 'warning' : 'danger'}
                      >
                        {progressPercentage.toFixed(0)}%
                      </CBadge>
                    </div>
                    <CProgress 
                      value={progressPercentage}
                      color={progressPercentage >= 80 ? 'success' : progressPercentage >= 60 ? 'warning' : 'danger'}
                      style={{ height: '8px' }}
                    />
                  </div>
                )
              })}
            </CCardBody>
          </CCard>
        </CCol>

        {/* Recent Activities */}
        <CCol lg={6}>
          <CCard className="h-100">
            <CCardHeader 
              style={{ 
                background: `linear-gradient(135deg, ${themeColors.primary} 0%, #d35400 100%)`,
                color: 'white' 
              }}
              className="d-flex justify-content-between align-items-center"
            >
              <h6 className="mb-0">Recent Activities</h6>
              <CButton size="sm" style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white' }}>
                View All
              </CButton>
            </CCardHeader>
            <CCardBody>
              {recentActivities.map((activity, index) => (
                <div key={index} className="d-flex align-items-start mb-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      backgroundColor: `${activity.color}20`,
                      border: `2px solid ${activity.color}40`
                    }}
                  >
                    <CIcon icon={activity.icon} style={{ color: activity.color }} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-medium" style={{ fontSize: '0.9rem' }}>
                      {activity.message}
                    </div>
                    <div className="text-muted small">
                      <CIcon icon={cilClock} className="me-1" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Quick Action Buttons */}
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader 
              style={{ 
                background: `linear-gradient(135deg, ${themeColors.info} 0%, #2980b9 100%)`,
                color: 'white' 
              }}
            >
              <h6 className="mb-0">Quick Actions</h6>
            </CCardHeader>
            <CCardBody>
              <div className="d-flex flex-wrap gap-2">
                <CButton 
                  style={{ 
                    background: themeColors.primary, 
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px'
                  }}
                  size="sm"
                >
                  <CIcon icon={cilPeople} className="me-2" />
                  Add Lead
                </CButton>
                <CButton 
                  style={{ 
                    background: themeColors.success, 
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px'
                  }}
                  size="sm"
                >
                  <CIcon icon={cilPhone} className="me-2" />
                  Make Call
                </CButton>
                <CButton 
                  style={{ 
                    background: themeColors.info, 
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px'
                  }}
                  size="sm"
                >
                  <CIcon icon={cilEnvelopeClosed} className="me-2" />
                  Send Email
                </CButton>
                <CButton 
                  style={{ 
                    background: themeColors.warning, 
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px'
                  }}
                  size="sm"
                >
                  <CIcon icon={cilCalendar} className="me-2" />
                  Schedule Meeting
                </CButton>
                <CButton 
                  style={{ 
                    background: themeColors.secondary, 
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px'
                  }}
                  size="sm"
                >
                  <CIcon icon={cilChart} className="me-2" />
                  View Reports
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

EnhancedWidgetsDropdown.propTypes = {
  className: PropTypes.string,
}

export default EnhancedWidgetsDropdown