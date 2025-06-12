
import { apiClient } from './config'

export const stockAdjustmentApi = {
  deleteStockAdjustment: async (id) => {
    try {
      return await apiClient.delete(`/stock-adjustments/${id}`)
    } catch (error) {
      console.error(error)
    }
  },

downloadStockAdjustmentExcel:async (id) => {
    try {
      return "success"
    } catch (error) {
      console.error(error)
    }
  },
}


