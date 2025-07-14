import { apiClient } from './config'

export const companyApi = {
  getCompanies: async (queryParams = {}, singleId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }

      const url = singleId ? `/companies/${singleId}` : '/companies'
      const response = await apiClient.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: queryParams,
      })

      return response.data
    } catch (error) {
      console.error('Error fetching companies:', error.response?.data || error.message)
      throw error
    }
  },

  createCompany: async (companyData) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }
      const response = await apiClient.post('/companies', companyData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error creating company:', error.response?.data || error.message)
      throw error
    }
  },

  updateCompany: async (companyId, companyData) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }
      const response = await apiClient.put(`/companies/${companyId}`, companyData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error updating company:', error.response?.data || error.message)
      throw error
    }
  },

  deleteCompany: async (companyId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }

      const response = await apiClient.delete(`/companies/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      console.error('Error deleting company:', error.response?.data || error.message)
      throw error
    }
  },

  getCompanyAddress: async () => {
    try {
      return await apiClient.get('/companies-address')
    } catch (error) {
      console.error(error)
    }
  },
   getPackages: async (params) => {
    try {
      return await apiClient.get('/packages', { params })
    } catch (error) {
      console.error(error)
    }
  },

  AddPacakges: async (payload) => {
    try {
      return await apiClient.post('/packages/create', payload)
    } catch (error) {
      console.error(error)
    }
  },

  UpdatePacakges: async (id, payload) => {
    try {
      return await apiClient.put(`/packages/update/${id}`, payload)
    } catch (error) {
      console.error(error)
    }
  },

  DeletePacakges: async (id) => {
    try {
      return await apiClient.delete(`/packages/delete/${id}`)
    } catch (error) {
      console.error(error)
    }
  },
  createCompanyBilling:async(body)=>{
    try {
      return await apiClient.post(`/companies/billing/create`,body)
    } catch (error) {
      console.error(error)
    }
  },
  createBillingPaymentLink:async(body)=>{
    try {
      return await apiClient.post(`/billing/send/payment/link`,body)
    } catch (error) {
      console.error(error)
    }
  },
  getCompanyBilling:async(params)=>{
    try {
      return await apiClient.get(`/companies/billing/get`,params)
    } catch (error) {
      console.error(error)
    }
  },
  getCompanyBillingById:async(id)=>{
    try {
      return await apiClient.get(`/companies/billing/get/${id}`)
    } catch (error) {
      console.error(error)
    }
  },

}