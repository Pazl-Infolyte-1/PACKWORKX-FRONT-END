import { apiClient } from './config'

export const stockAdjustmentApi = {
  postStockAdjustment: async (payload) => {
    try {
      return await apiClient.post('/stock-adjustments', payload)
    } catch (error) {
      console.error('Error submitting stock adjustment:', error.response?.data || error.message)
      throw error
    }
  },
  updateStockAdjustment: async (id, payload) => {
    try {
      return await apiClient.put(`/stock-adjustments/${id}`, payload)
    } catch (error) {
      console.error('Error updating stock adjustment:', error.response?.data || error.message)
      throw error
    }
  },
  deleteStockAdjustment: async (id) => {
    try {
      return await apiClient.delete(`/stock-adjustments/${id}`)
    } catch (error) {
      console.error(error)
    }
  },

  downloadStockAdjustmentExcel: async (id) => {
    try {
      return 'success'
    } catch (error) {
      console.error(error)
    }
  },
}
