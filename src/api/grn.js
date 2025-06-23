import { apiClient } from './config'

export const grnApi = {
  getGrn: async (params) => {
    try {
      return await apiClient.get('/grn', { params })
    } catch (error) {
      console.error(error)
    }
  },

  postGrn: async (payload) => {
    try {
      return await apiClient.post('/grn', payload)
    } catch (error) {
      console.error(error)
    }
  },

  editGrn: async (payload) => {
    try {
      return await apiClient.put(`/grn/${payload.id}`, payload)
    } catch (error) {
      console.error(error)
    }
  },

  deleteGrn: async (id) => {
    try {
      return await apiClient.delete(`/grn/${id}`)
    } catch (error) {
      console.error(error)
    }
  },

  getGrnById: async (id) => {
    try {
      return await apiClient.get(`/grn/${id}`)
    } catch (error) {
      console.error(error)
    }
  },

  getGRNByPOId: async (poId) => {
    try {
      return await apiClient.get(`/stock-adjustments/grn/${poId}`)
    } catch (error) {
      console.error('Error fetching GRN by PO ID:', error.response?.data || error.message)
      throw error
    }
  },
  getProductsForStockAdjustment: async (grnId) => {
    try {
      return await apiClient.get(`/stock-adjustments/items`)
    } catch (error) {
      console.error(
        'Error fetching products for stock adjustment:',
        error.response?.data || error.message,
      )
      throw error
    }
  },
  getInventoryByItemId: async (itemId) => {
      return await apiClient.get(`/stock-adjustments/items/${itemId}`)
  },
}
