import axios from 'axios'
// import authMiddleware from './middleware/authMiddleware'

const BASE_URL = 'https://packworkx.pazl.info/api/'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    console.log('Interceptor token:', token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('Authorization header set:', config.headers.Authorization)
    }
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  },
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

// src/services/api/endpoints.js
const endpoints = {
  auth: {
    login: {
      url: '/user/login',
      method: 'POST',
    },
    register: {
      url: '/auth/register',
      method: 'POST',
    },
    logout: {
      url: '/auth/logout',
      method: 'POST',
    },
  },
  menu: {
    sideBarMenu: {
      url: '/rbac',
      method: 'GET',
    },
  },
  customers: {
    list: {
      url: '/customers',
      method: 'GET',
    },
    detail: {
      url: (id) => `/customers/${id}`,
      method: 'GET',
    },
    create: {
      url: '/customers',
      method: 'POST',
    },
    update: {
      url: (id) => `/customers/${id}`,
      method: 'PUT',
    },
    delete: {
      url: (id) => `/customers/${id}`,
      method: 'DELETE',
    },
  },
  deals: {
    list: {
      url: '/deals',
      method: 'GET',
    },
    detail: {
      url: (id) => `/deals/${id}`,
      method: 'GET',
    },
    create: {
      url: '/deals',
      method: 'POST',
    },
    update: {
      url: (id) => `/deals/${id}`,
      method: 'PUT',
    },
    delete: {
      url: (id) => `/deals/${id}`,
      method: 'DELETE',
    },
  },
}

// Updated API methods using the new endpoint structure
export const apiMethods = {
  // Auth methods
  login: async (credentials) => {
    console.log('credentials', credentials)
    try {
      const { url, method } = endpoints.auth.login
      // Encode credentials before sending
      //   const encodedCredentials = authMiddleware.encodeAES(credentials)
      // Send encoded credentials to the server
      const response = await apiClient[method.toLowerCase()](url, credentials)

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }

      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  // side bar menu
  getSideBarMenu: async (params) => {
    try {
      const token = localStorage.getItem('token')
      console.log('object', token)
      const { url, method } = endpoints.menu.sideBarMenu
      const response = await apiClient[method.toLowerCase()](url, { params })
      return response.data
    } catch (error) {
      throw error
    }
  },
  // Customer methods
  getCustomers: async (params) => {
    try {
      const { url, method } = endpoints.customers.list
      const response = await apiClient[method.toLowerCase()](url, { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  getCustomerById: async (id) => {
    try {
      const { url, method } = endpoints.customers.detail
      const response = await apiClient[method.toLowerCase()](url(id))
      return response.data
    } catch (error) {
      throw error
    }
  },

  createCustomer: async (customerData) => {
    try {
      const { url, method } = endpoints.customers.create
      const response = await apiClient[method.toLowerCase()](url, customerData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateCustomer: async (id, customerData) => {
    try {
      const { url, method } = endpoints.customers.update
      const response = await apiClient[method.toLowerCase()](url(id), customerData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteCustomer: async (id) => {
    try {
      const { url, method } = endpoints.customers.delete
      const response = await apiClient[method.toLowerCase()](url(id))
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default apiMethods
