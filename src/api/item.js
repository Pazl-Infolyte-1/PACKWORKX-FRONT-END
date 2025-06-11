import { apiClient } from './config'

export const itemApi = {
  getItemList: async (params = {}) => {
    try {
      return await apiClient.get('/items', {
        params: {
          search: params.search || '',

          sales_status: params.sales_status || '',

          page: params.page || 1,

          limit: params.limit || 10,
        },
      })
    } catch (error) {
      console.error('Error fetching items:', error.response?.data || error.message)

      throw error
    }
  },

  getItemData: async (id) => {
    return await apiClient.get(`/items/${id}`)
  },
  getCategoryList: async () => {
    return await apiClient.get(`/category`)
  },

  getSubCategory: async () => {
    return await apiClient.get(`/sub-category`)
  },

  addItem: async (body) => {
    return await apiClient.post(`/items`, body)
  },

  updateItem: async (id, body) => {
    return await apiClient.put(`/items/${id}`, body)
  },

  deleteItem: async (id) => {
    return await apiClient.delete(`/items/delete/${id}`)
  },
}
