import axios from 'axios'

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
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export const apiMethods = {
  login: async (credentials) => {
    console.log('credentials', credentials)
    try {
      const response = await apiClient.post('/user/login', credentials, {
        headers: {
          'x-api-key':
            '4b3e77f648e5b9055a45f0812b3a4c3b88b08ff10b2f34ec21d11b6f678b6876a4014c88ff2a3c7e8e934c4f4790a94d3acb28d2f78a9b90f18960feaf3e4f99',
        },
      })

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }

      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  getSideBarMenu: async (params) => {
    try {
      const token = localStorage.getItem('token')
      console.log('object', token)
      const response = await apiClient.get(
        'https://mocki.io/v1/711cbc7d-a070-4077-bf97-8c1369fa075f',
        { params },
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  getFormFields: async (id) => {
    try {
      const response = await apiClient.get(`/form-fields/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  getClientOrVendors: async () => {
    try {
      const response = await apiClient.get(
        'https://mocki.io/v1/10d77686-3679-4445-89db-9da5fe60eb4a',
      )
      return response.data
    } catch (error) {
      console.error('Error in getClientOrVendors:', error)
      throw error
    }
  },

  formatDate: async (isoString) => {
    try {
      const date = new Date(isoString)
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch (error) {
      console.error('Error in formatDate:', error)
      throw error
    }
  },

  addSku: async (addNewSkuData) => {
    try {
      const response = await apiClient.post('/skuDetails', addNewSkuData,{
      })
      return response.data
    } catch (error) {
      console.error(error)
    }
  },

  getSkuList: async () => {
    try {
      const response = await apiClient.get('/skuDetails')
      return response.data
    } catch (error) {
      console.error(error);
      
    }
  },

  updateSku: async (addNewSkuData) => {
    try {
      const response = await apiClient.put(`/skuDetails/${addNewSkuData.id}`, addNewSkuData)
      return response.data
    } catch (error) {
      console.error(error)
    }
  },

  deleteSku: async (id) => {
    try {
      const response = await apiClient.delete(`/skuDetails/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  },
}

export default apiMethods
