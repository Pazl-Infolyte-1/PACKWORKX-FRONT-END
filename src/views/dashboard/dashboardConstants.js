// Manufacturing ERP Dashboard Constants

// Manufacturing ERP Theme Colors
export const MANUFACTURING_THEME_COLORS = {
  production: '#e74c3c',
  inventory: '#3498db',
  sales: '#2ecc71',
  purchase: '#f39c12',
  quality: '#9b59b6',
  maintenance: '#e67e22',
  finance: '#34495e',
  hr: '#1abc9c',
  
  // Gradient combinations for manufacturing modules
  gradients: {
    production: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
    inventory: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
    sales: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
    purchase: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
    quality: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
    maintenance: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
    finance: 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)',
    hr: 'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)',
  },
  
  // Alpha variations for backgrounds
  alpha: {
    production10: '#e74c3c10',
    production20: '#e74c3c20',
    production30: '#e74c3c30',
    inventory10: '#3498db10',
    inventory20: '#3498db20',
    sales10: '#2ecc7110',
    sales20: '#2ecc7120',
    purchase10: '#f39c1210',
    purchase20: '#f39c1220',
    quality10: '#9b59b610',
    quality20: '#9b59b620',
    maintenance10: '#e67e2210',
    maintenance20: '#e67e2220',
    finance10: '#34495e10',
    finance20: '#34495e20',
    hr10: '#1abc9c10',
    hr20: '#1abc9c20',
  }
}

// Manufacturing Module Configurations
export const MANUFACTURING_MODULES = {
  salesOrders: {
    title: 'Sales Orders',
    icon: 'cilCart',
    color: MANUFACTURING_THEME_COLORS.sales,
    route: '/sales_order',
    description: 'Manage customer orders and sales',
    metrics: ['total', 'pending', 'confirmed', 'shipped']
  },
  workOrders: {
    title: 'Work Orders',
    icon: 'cilPencil',
    color: MANUFACTURING_THEME_COLORS.production,
    route: '/work_orders',
    description: 'Production planning and execution',
    metrics: ['active', 'completed', 'delayed', 'scheduled']
  },
  inventory: {
    title: 'SKU Inventory',
    icon: 'cilList',
    color: MANUFACTURING_THEME_COLORS.inventory,
    route: '/skus',
    description: 'Stock management and tracking',
    metrics: ['total_items', 'low_stock', 'out_of_stock', 'categories']
  },
  machines: {
    title: 'Machines',
    icon: 'cilCalculator',
    color: MANUFACTURING_THEME_COLORS.maintenance,
    route: '/machines',
    description: 'Equipment and machinery management',
    metrics: ['active', 'maintenance', 'efficiency', 'downtime']
  },
  employees: {
    title: 'Employees',
    icon: 'cilUser',
    color: MANUFACTURING_THEME_COLORS.hr,
    route: '/employee',
    description: 'Workforce management',
    metrics: ['total', 'present', 'absent', 'performance']
  },
  clients: {
    title: 'Clients/Vendors',
    icon: 'cilUserPlus',
    color: MANUFACTURING_THEME_COLORS.finance,
    route: '/clients',
    description: 'Customer and supplier management',
    metrics: ['total', 'active', 'new', 'transactions']
  },
  purchaseOrders: {
    title: 'Purchase Orders',
    icon: 'cilTruck',
    color: MANUFACTURING_THEME_COLORS.purchase,
    route: '/purchase_orders',
    description: 'Procurement and purchasing',
    metrics: ['pending', 'approved', 'received', 'total_value']
  },
  routes: {
    title: 'Routes',
    icon: 'cilExternalLink',
    color: MANUFACTURING_THEME_COLORS.quality,
    route: '/routes',
    description: 'Delivery and logistics routing',
    metrics: ['active', 'completed', 'optimized', 'distance']
  }
}

// Financial Operations Configuration
export const FINANCIAL_OPERATIONS = {
  grn: {
    title: 'GRN (Goods Received Notes)',
    icon: 'cilHome',
    color: MANUFACTURING_THEME_COLORS.inventory,
    description: 'Track goods received from suppliers'
  },
  purchaseReturns: {
    title: 'Purchase Returns',
    icon: 'cilArrowBottom',
    color: MANUFACTURING_THEME_COLORS.production,
    description: 'Returns to suppliers'
  },
  saleReturns: {
    title: 'Sale Returns',
    icon: 'cilArrowTop',
    color: MANUFACTURING_THEME_COLORS.sales,
    description: 'Customer returns processing'
  },
  stockAdjustments: {
    title: 'Stock Adjustments',
    icon: 'cilSettings',
    color: MANUFACTURING_THEME_COLORS.maintenance,
    description: 'Inventory corrections and adjustments'
  },
  creditNotes: {
    title: 'Credit Notes',
    icon: 'cilCreditCard',
    color: MANUFACTURING_THEME_COLORS.finance,
    description: 'Credit memos and adjustments'
  },
  debitNotes: {
    title: 'Debit Notes',
    icon: 'cilFile',
    color: MANUFACTURING_THEME_COLORS.quality,
    description: 'Debit memos and charges'
  }
}

// Transaction Status Configurations
export const TRANSACTION_STATUS_CONFIG = {
  'Confirmed': {
    color: MANUFACTURING_THEME_COLORS.sales,
    bgColor: MANUFACTURING_THEME_COLORS.alpha.sales20,
    badge: 'success',
    priority: 5
  },
  'Pending': {
    color: MANUFACTURING_THEME_COLORS.purchase,
    bgColor: MANUFACTURING_THEME_COLORS.alpha.purchase20,
    badge: 'warning',
    priority: 3
  },
  'In Progress': {
    color: MANUFACTURING_THEME_COLORS.inventory,
    bgColor: MANUFACTURING_THEME_COLORS.alpha.inventory20,
    badge: 'info',
    priority: 4
  },
  'Received': {
    color: MANUFACTURING_THEME_COLORS.inventory,
    bgColor: MANUFACTURING_THEME_COLORS.alpha.inventory20,
    badge: 'primary',
    priority: 4
  },
  'Issued': {
    color: MANUFACTURING_THEME_COLORS.finance,
    bgColor: MANUFACTURING_THEME_COLORS.alpha.finance20,
    badge: 'secondary',
    priority: 3
  },
  'Completed': {
    color: MANUFACTURING_THEME_COLORS.sales,
    bgColor: MANUFACTURING_THEME_COLORS.alpha.sales20,
    badge: 'success',
    priority: 5
  },
  'Cancelled': {
    color: MANUFACTURING_THEME_COLORS.production,
    bgColor: MANUFACTURING_THEME_COLORS.alpha.production20,
    badge: 'danger',
    priority: 1
  }
}

// Priority Configurations
export const PRIORITY_CONFIG = {
  'High': {
    color: MANUFACTURING_THEME_COLORS.production,
    badge: 'danger',
    weight: 3
  },
  'Medium': {
    color: MANUFACTURING_THEME_COLORS.purchase,
    badge: 'warning',
    weight: 2
  },
  'Low': {
    color: MANUFACTURING_THEME_COLORS.sales,
    badge: 'success',
    weight: 1
  }
}

// Manufacturing KPIs Configuration
export const MANUFACTURING_KPIS = {
  production: {
    dailyTarget: {
      label: 'Daily Production Target',
      unit: 'units',
      target: 1200,
      icon: 'cilFactory'
    },
    qualityRate: {
      label: 'Quality Pass Rate',
      unit: '%',
      target: 95,
      icon: 'cilCheckCircle'
    },
    efficiency: {
      label: 'Machine Utilization',
      unit: '%',
      target: 85,
      icon: 'cilCalculator'
    },
    delivery: {
      label: 'On-time Delivery',
      unit: '%',
      target: 95,
      icon: 'cilTruck'
    }
  },
  inventory: {
    turnover: {
      label: 'Inventory Turnover',
      unit: 'times/year',
      target: 12,
      icon: 'cilList'
    },
    accuracy: {
      label: 'Stock Accuracy',
      unit: '%',
      target: 98,
      icon: 'cilCheckCircle'
    },
    obsolete: {
      label: 'Obsolete Stock',
      unit: '%',
      target: 2,
      icon: 'cilWarning'
    }
  },
  finance: {
    roi: {
      label: 'Return on Investment',
      unit: '%',
      target: 15,
      icon: 'cilDollar'
    },
    margin: {
      label: 'Gross Profit Margin',
      unit: '%',
      target: 30,
      icon: 'cilChart'
    }
  }
}

// Alert Types for Manufacturing
export const MANUFACTURING_ALERTS = {
  critical: {
    type: 'danger',
    icon: 'cilWarning',
    priority: 1,
    autoClose: false
  },
  warning: {
    type: 'warning',
    icon: 'cilInfo',
    priority: 2,
    autoClose: true,
    timeout: 10000
  },
  info: {
    type: 'info',
    icon: 'cilInfo',
    priority: 3,
    autoClose: true,
    timeout: 8000
  },
  success: {
    type: 'success',
    icon: 'cilCheckCircle',
    priority: 4,
    autoClose: true,
    timeout: 5000
  }
}

// Chart Configurations for Manufacturing
export const MANUFACTURING_CHART_CONFIG = {
  defaultOptions: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: MANUFACTURING_THEME_COLORS.production,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        intersect: false,
        mode: 'index',
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    }
  },
  colors: {
    primary: MANUFACTURING_THEME_COLORS.production,
    secondary: MANUFACTURING_THEME_COLORS.inventory,
    tertiary: MANUFACTURING_THEME_COLORS.sales,
    quaternary: MANUFACTURING_THEME_COLORS.purchase,
    quinary: MANUFACTURING_THEME_COLORS.quality
  }
}

// Performance Targets for Manufacturing
export const MANUFACTURING_TARGETS = {
  daily: {
    production: 1200,
    quality_checks: 150,
    shipments: 45,
    maintenance_hours: 8
  },
  weekly: {
    production: 6000,
    quality_checks: 750,
    shipments: 225,
    maintenance_hours: 40
  },
  monthly: {
    production: 25000,
    quality_checks: 3000,
    shipments: 900,
    maintenance_hours: 160,
    revenue: 2000000, // $2M
    sales_orders: 1000,
    purchase_orders: 400
  }
}

// Utility Functions for Manufacturing
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number)
}

export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`
}

export const getStatusBadgeClass = (status) => {
  const config = TRANSACTION_STATUS_CONFIG[status]
  return config ? config.badge : 'secondary'
}

export const getPriorityBadgeClass = (priority) => {
  const config = PRIORITY_CONFIG[priority]
  return config ? config.badge : 'secondary'
}

export const calculateEfficiency = (current, target) => {
  return Math.round((current / target) * 100)
}

export const getEfficiencyColor = (efficiency) => {
  if (efficiency >= 100) return MANUFACTURING_THEME_COLORS.sales
  if (efficiency >= 90) return MANUFACTURING_THEME_COLORS.purchase
  if (efficiency >= 70) return MANUFACTURING_THEME_COLORS.inventory
  return MANUFACTURING_THEME_COLORS.production
}

export const getTimeAgo = (date) => {
  const now = new Date()
  const diffInMs = now - new Date(date)
  const diffInHours = diffInMs / (1000 * 60 * 60)
  const diffInDays = diffInHours / 24
  
  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`
  } else if (diffInDays < 30) {
    return `${Math.floor(diffInDays)} days ago`
  } else {
    return new Date(date).toLocaleDateString()
  }
}

export const generateManufacturingChartData = (type, timeRange = 'month') => {
  const sampleData = {
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      salesOrders: [120, 150, 140, 180, 165, 145, 190],
      workOrders: [45, 52, 48, 65, 58, 50, 70],
      purchaseOrders: [25, 32, 28, 40, 35, 30, 45]
    },
    month: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      salesOrders: [650, 720, 680, 847],
      workOrders: [125, 140, 138, 156],
      purchaseOrders: [65, 75, 72, 89]
    },
    quarter: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      salesOrders: [2200, 2450, 2380, 2650, 2580, 2890],
      workOrders: [480, 520, 510, 580, 560, 620],
      purchaseOrders: [250, 280, 270, 310, 295, 340]
    },
    year: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      salesOrders: [8500, 9200, 10100, 11200],
      workOrders: [1800, 2100, 2300, 2600],
      purchaseOrders: [950, 1100, 1250, 1400]
    }
  }
  
  return sampleData[timeRange] || sampleData.month
}

// Filter Options for Manufacturing Modules
export const MANUFACTURING_FILTER_OPTIONS = {
  salesOrders: [
    { value: 'all', label: 'All Sales Orders' },
    { value: 'confirmed', label: 'Confirmed Orders' },
    { value: 'pending', label: 'Pending Orders' },
    { value: 'shipped', label: 'Shipped Orders' },
    { value: 'high_priority', label: 'High Priority' }
  ],
  workOrders: [
    { value: 'all', label: 'All Work Orders' },
    { value: 'active', label: 'Active Production' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'delayed', label: 'Delayed' }
  ],
  inventory: [
    { value: 'all', label: 'All Items' },
    { value: 'low_stock', label: 'Low Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
    { value: 'raw_materials', label: 'Raw Materials' },
    { value: 'finished_goods', label: 'Finished Goods' }
  ],
  transactions: [
    { value: 'all', label: 'All Transactions' },
    { value: 'sales_orders', label: 'Sales Orders' },
    { value: 'purchase_orders', label: 'Purchase Orders' },
    { value: 'work_orders', label: 'Work Orders' },
    { value: 'grn', label: 'GRN' },
    { value: 'returns', label: 'Returns' }
  ]
}

export default {
  MANUFACTURING_THEME_COLORS,
  MANUFACTURING_MODULES,
  FINANCIAL_OPERATIONS,
  TRANSACTION_STATUS_CONFIG,
  PRIORITY_CONFIG,
  MANUFACTURING_KPIS,
  MANUFACTURING_ALERTS,
  MANUFACTURING_CHART_CONFIG,
  MANUFACTURING_TARGETS,
  MANUFACTURING_FILTER_OPTIONS,
  formatCurrency,
  formatNumber,
  formatPercentage,
  getStatusBadgeClass,
  getPriorityBadgeClass,
  calculateEfficiency,
  getEfficiencyColor,
  getTimeAgo,
  generateManufacturingChartData
}