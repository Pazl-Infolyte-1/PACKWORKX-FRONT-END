import { apiClient } from '../api/config'
import dashboardMockData from '../data/dashboardData.json'

// Helper function to determine if error is a known backend issue
const isKnownBackendError = (error) => {
  const errorMessage = error.response?.data?.message || error.message || ''
  const knownErrors = [
    'Internal Server Error',
    'Illegal mix of collations',
    'Database connection failed',
    'SQLSTATE',
    'MySQL',
    'MariaDB'
  ]
  return knownErrors.some(knownError => errorMessage.includes(knownError))
}

// Helper function to get user-friendly error message
const getUserFriendlyErrorMessage = (error) => {
  const errorMessage = error.response?.data?.message || error.message || ''
  
  if (errorMessage.includes('Illegal mix of collations')) {
    return 'Database configuration issue detected. Using demo data while backend team resolves database collation settings.'
  }
  
  if (errorMessage.includes('Internal Server Error')) {
    return 'Backend server error detected. Using demo data while the issue is being resolved.'
  }
  
  if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
    return 'Cannot connect to backend server. Using demo data for development.'
  }
  
  return 'API temporarily unavailable. Using demo data while backend issues are resolved.'
}

// Dashboard API service
export const dashboardService = {
  // Get dashboard data with fallback to mock data
  getDashboardData: async (queryParams = '') => {
    try {
      // Try to fetch from API first
      const url = queryParams ? `/dashboard?${queryParams}` : '/dashboard';
      console.log('Fetching dashboard data from:', url);
      const response = await apiClient.get(url)
      return {
        success: true,
        data: response.data.data || response.data // Handle both response formats
      }
    } catch (error) {
      const isKnownError = isKnownBackendError(error)
      const userMessage = getUserFriendlyErrorMessage(error)
      
      // Log detailed error for developers
      console.group('🔍 Dashboard API Error Details')
      console.error('Error Type:', error.name || 'Unknown')
      console.error('Error Code:', error.code || 'N/A')
      console.error('HTTP Status:', error.response?.status || 'N/A')
      console.error('Backend Message:', error.response?.data?.message || 'No message')
      console.error('Full Error:', error)
      console.groupEnd()
      
      // Return mock data with appropriate messaging
      return {
        success: true,
        data: dashboardMockData,
        isMockData: true,
        errorInfo: {
          isKnownBackendError: isKnownError,
          userMessage: userMessage,
          technicalError: error.response?.data?.message || error.message,
          httpStatus: error.response?.status
        }
      }
    }
  },

  // Get dashboard widgets with fallback
  getDashboardWidgets: async () => {
    try {
      const response = await apiClient.get('/dashboard/widgets')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      const userMessage = getUserFriendlyErrorMessage(error)
      console.warn('Dashboard widgets endpoint error:', error.response?.data?.message || error.message)
      
      return {
        success: true,
        data: dashboardMockData.erpWidgets,
        isMockData: true,
        errorInfo: {
          isKnownBackendError: isKnownBackendError(error),
          userMessage: userMessage,
          technicalError: error.response?.data?.message || error.message,
          httpStatus: error.response?.status
        }
      }
    }
  },

  // Get dashboard metrics by date range with fallback
  getDashboardMetrics: async (startDate, endDate) => {
    try {
      const response = await apiClient.get('/dashboard/metrics', {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      const userMessage = getUserFriendlyErrorMessage(error)
      console.warn('Dashboard metrics endpoint error:', error.response?.data?.message || error.message)
      
      return {
        success: true,
        data: dashboardMockData.productionMetrics,
        isMockData: true,
        errorInfo: {
          isKnownBackendError: isKnownBackendError(error),
          userMessage: userMessage,
          technicalError: error.response?.data?.message || error.message,
          httpStatus: error.response?.status
        }
      }
    }
  },

  // Get dashboard chart data with fallback
  getDashboardCharts: async (chartType) => {
    try {
      const response = await apiClient.get(`/dashboard/charts/${chartType}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      const userMessage = getUserFriendlyErrorMessage(error)
      console.warn('Dashboard charts endpoint error:', error.response?.data?.message || error.message)
      
      return {
        success: true,
        data: dashboardMockData.chartData[chartType] || dashboardMockData.chartData,
        isMockData: true,
        errorInfo: {
          isKnownBackendError: isKnownBackendError(error),
          userMessage: userMessage,
          technicalError: error.response?.data?.message || error.message,
          httpStatus: error.response?.status
        }
      }
    }
  }
}
