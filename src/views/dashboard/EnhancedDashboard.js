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
  CWidgetStatsA,
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCalendar,
  cilChart,
  cilPeople,
  cilUser,
  cilDollar,
  cilBell,
  cilTrendUp,
  cilTrendDown,
  cilOptions,
  cilSearch,
  cilFilterX,
  cilArrowTop,
  cilArrowBottom,
  cilPhone,
  cilEnvelopeClosed,
  cilLocationPin,
  cilClock,
  cilCheckCircle,
  cilExclamationTriangle,
  cilInfo,
  cilTarget,
  cilCloudDownload,
} from '@coreui/icons'
import { CChartLine, CChartBar, CChartDoughnut } from '@coreui/react-chartjs'
import './DashboardTheme.css'

// Import avatars
import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

// Enhanced Dashboard with Landing Page Theme
const EnhancedDashboard = () => {
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-12-31' })
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [timeFilter, setTimeFilter] = useState('month')
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: '5 leads require follow-up today', time: '2 hours ago' },
    { id: 2, type: 'success', message: 'Monthly sales target achieved!', time: '1 day ago' },
    { id: 3, type: 'info', message: 'New feature update available', time: '3 days ago' }
  ])

  // Enhanced Widget Data with landing page theme colors
  const dashboardStats = [
    {
      title: 'Total Leads',
      value: '2,847',
      percentage: '+12.4%',
      trend: 'up',
      color: 'primary',
      icon: cilPeople,
      description: 'New leads this month'
    },
    {
      title: 'Active Deals',
      value: '1,234',
      percentage: '+8.7%',
      trend: 'up',
      color: 'success',
      icon: cilTarget,
      description: 'Deals in pipeline'
    },
    {
      title: 'Revenue',
      value: '$847K',
      percentage: '+15.2%',
      trend: 'up',
      color: 'info',
      icon: cilDollar,
      description: 'Monthly recurring revenue'
    },
    {
      title: 'Conversion Rate',
      value: '24.8%',
      percentage: '-2.1%',
      trend: 'down',
      color: 'warning',
      icon: cilTrendUp,
      description: 'Lead to customer conversion'
    }
  ]

  // Enhanced Table Data with more realistic CRM data
  const leadData = [
    {
      id: 1,
      avatar: { src: avatar1, status: 'success' },
      name: 'John Smith',
      company: 'TechCorp Inc.',
      email: 'john@techcorp.com',
      phone: '+1 (555) 123-4567',
      status: 'Hot',
      value: '$50,000',
      lastContact: '2 hours ago',
      source: 'Website',
      country: 'USA'
    },
    {
      id: 2,
      avatar: { src: avatar2, status: 'warning' },
      name: 'Sarah Johnson',
      company: 'Digital Solutions',
      email: 'sarah@digital.com',
      phone: '+1 (555) 987-6543',
      status: 'Warm',
      value: '$75,000',
      lastContact: '1 day ago',
      source: 'LinkedIn',
      country: 'Canada'
    },
    {
      id: 3,
      avatar: { src: avatar3, status: 'danger' },
      name: 'Mike Chen',
      company: 'Startup Hub',
      email: 'mike@startup.com',
      phone: '+1 (555) 456-7890',
      status: 'Cold',
      value: '$25,000',
      lastContact: '3 days ago',
      source: 'Referral',
      country: 'Singapore'
    },
    {
      id: 4,
      avatar: { src: avatar4, status: 'success' },
      name: 'Emma Davis',
      company: 'Growth Labs',
      email: 'emma@growth.com',
      phone: '+1 (555) 321-7654',
      status: 'Hot',
      value: '$120,000',
      lastContact: '1 hour ago',
      source: 'Email Campaign',
      country: 'UK'
    },
    {
      id: 5,
      avatar: { src: avatar5, status: 'info' },
      name: 'David Wilson',
      company: 'Innovation Co.',
      email: 'david@innovation.com',
      phone: '+1 (555) 654-9876',
      status: 'Warm',
      value: '$85,000',
      lastContact: '4 hours ago',
      source: 'Cold Call',
      country: 'Australia'
    },
    {
      id: 6,
      avatar: { src: avatar6, status: 'secondary' },
      name: 'Lisa Martinez',
      company: 'Future Tech',
      email: 'lisa@future.com',
      phone: '+1 (555) 789-0123',
      status: 'Cold',
      value: '$45,000',
      lastContact: '2 days ago',
      source: 'Trade Show',
      country: 'Mexico