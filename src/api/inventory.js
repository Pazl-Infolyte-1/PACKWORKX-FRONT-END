import { apiClient } from './config'

export const inventoryApi = {
  getinventory: async () => {
    try {
      return await apiClient.get('/inventory?limit=10000')
    } catch (error) {
      console.error(error)
    }
  },

  getinventoryWithParams: async (catId, page, limit = 50, search = '', subCatId) => {
    try {
      // Build query string manually to control order
      let query = `/inventory?search=${encodeURIComponent(search || '')}`
      query += `&page=${page}&limit=${limit}`
      if (catId) {
        query += `&categoryId=${catId}`
      }
      if (subCatId) {
        query += `&subCategoryId=${subCatId}`
      }

      return await apiClient.get(query)
    } catch (error) {
      console.error(error)
    }
  },

  singleInventoryView: async (id) => {
    try {
      const response = await apiClient.get(`/inventory/status/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  getInventoryExcelExport: async (params) => {
    try {
      const response = await apiClient.get(`/inventory/export`, {
        responseType: 'blob',
        params,
      })

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'Inventory Details.xlsx')
      document.body.appendChild(link)
      link.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } catch (error) {
      console.error('Failed to export inventory Excel:', error)
    }
  },

  getInventoryInSkuView: async () => {
    try {
      const response = await apiClient.get(`/inventory?search=&page=1&limit=50&subCategoryId=1`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  // Stock Adjustments
  getStockAdjustments: async (page = 1, entries) => {
    try {
      return await apiClient.get(`/stock-adjustments?page=${page}&entries=${entries}`)
    } catch (error) {
      console.error('Error fetching stock adjustments:', error.response?.data || error.message)
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

  singleStockAdjustment: async (id) => {
    try {
      const response = await apiClient.get(`/stock-adjustments/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  },

  postStockAdjustment: async (payload) => {
    try {
      return await apiClient.post('/stock-adjustments', payload)
    } catch (error) {
      console.error('Error submitting stock adjustment:', error.response?.data || error.message)
      throw error
    }
  },

  getStockAdjustmentsByItemId: async (id) => {
    try {
      return await apiClient.get(`/stock-adjustments/items/${id}`)
    } catch (error) {
      console.error(
        'Error fetching stock adjustments by item ID:',
        error.response?.data || error.message,
      )
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

  getInventorySummary: async () => {
    return await apiClient.get('/inventory/product')
  }
}