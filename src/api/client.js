import { apiClient } from './config'

export const clientApi = {
  getClients: async (queryParams = {}) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }
      const response = await apiClient.get('/clients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: queryParams,
      })
      return response.data
    } catch (error) {
      console.error('Error fetching clients:', error.response?.data || error.message)
      throw error
    }
  },

  getSkuClients: async (queryParams = {}) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }
      const response = await apiClient.get('/clients?status=active', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: queryParams,
      })
      return response.data
    } catch (error) {
      console.error('Error fetching active clients:', error.response?.data || error.message)
      throw error
    }
  },

  postClient: async (clientData) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }

      const response = await apiClient.post('/clients', clientData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data
    } catch (error) {
      console.error('Error posting client:', error.response?.data || error.message)
      throw error
    }
  },

  editClient: async (clientId, clientData) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }

      const response = await apiClient.put(`/clients/${clientId}`, clientData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data
    } catch (error) {
      console.error('Error editing client:', error.response?.data || error.message)
      throw error
    }
  },

  deleteClient: async (clientId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }
      const response = await apiClient.delete(`/clients/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error deleting client:', error.response?.data || error.message)
      throw error
    }
  },

  singleClients: async (id) => {
    try {
      const response = await apiClient.get(`/clients/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  },

  downloadClientExcel: async (queryParams = {}) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }
      const response = await apiClient.get('/clients/download/excel', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: queryParams,
        responseType: 'blob',
      })
      return response.data
    } catch (error) {
      console.error('Error downloading clients:', error.response?.data || error.message)
      throw error
    }
  },

  clientStatusSwitch: async (status, clientId) => {
    try {
      return await apiClient.patch(`clients/${clientId}/status`, { status })
    } catch (error) {
      console.error(error)
    }
  },
  getGst: async (gstNumber) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }

      const response = await apiClient.post(
        '/clients/check-gst',
        { gst_number: gstNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      return response.data
    } catch (error) {
      console.error('Error fetching GST details:', error.response?.data || error.message)
      throw error
    }
  },

  getVendor: async (params) => {
    return await apiClient.get('/clients', { params })
  },

    singleclients: async (id) => {
    try {
      const response = await apiClient.get(`/clients/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  },

}