import { apiClient } from './config'

export const authApi = {
  login: async (credentials) => {
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

  getSideBarMenu: async (queryParams = {}) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }
      const response = await apiClient.get('/rbac', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: queryParams,
      })
      return response.data
    } catch (error) {
      console.error('Error fetching sidebar menu:', error.response?.data || error.message)
      throw error
    }
  },
}