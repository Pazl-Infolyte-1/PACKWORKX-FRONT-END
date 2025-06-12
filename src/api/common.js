import { apiClient } from './config'

export const commonApi = {
  // Dropdown Management
  getDropDown: async () => {
    return await apiClient.get('/common-service/dropdown-name')
  },

  addDropdownName: async (payload) => {
    return await apiClient.post('/common-service/dropdown-name', payload)
  },

  editDropdownName: async (payload) => {
    return await apiClient.put(`/common-service/dropdown-name/${payload.client_id}`, payload)
  },

  deleteDropdownName: async (id) => {
    return await apiClient.delete(`/common-service/dropdown-name/${id}`)
  },

  getDropDownValue: async () => {
    return await apiClient.get('/common-service/dropdown-value')
  },

  addDropDownValue: async (payload) => {
    return await apiClient.post('/common-service/dropdown-value', payload)
  },

  updateDropDownValue: async (payload) => {
    return await apiClient.put(`/common-service/dropdown-value/${payload.id}`, payload)
  },

  deleteDropDownValue: async (id) => {
    return await apiClient.delete(`/common-service/dropdown-value/${id}`)
  },

  // State Management
  getState: async () => {
    return await apiClient.get('/common-service/states')
  },

  // Category Management
  subCategoryDropdown: async (categoryId) => {
    try {
      const response = await apiClient.get(
        categoryId ? `/items/sub-category/id` : `/sub-category`,
        {
          params: categoryId ? { category_id: categoryId } : {},
        },
      )
      return response
    } catch (error) {
      console.error('Error inside subCategoryDropdown:', error)
      throw error
    }
  },
  // Items
  singleItem: async (id) => {
    try {
      const response = await apiClient.get(`/items/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  getCountries: async () => {
    try {
      return await apiClient.get(`/common-service/countries`)
    } catch (error) {
      console.error(error)
    }
  },
  getCurrency: async () => {
    try {
      return await apiClient.get('/common-service/currency')
    } catch (error) {
      console.error(error)
    }
  },

  getModule: async () => {
    try {
      return await apiClient.get('/common-service/module')
    } catch (error) {
      console.error(error)
    }
  },
  uploadFile: async (file) => {
    try {
      return await apiClient.post('/file/upload', file, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    } catch (error) {
      console.error(error)
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
  getColors: async () => {
    try {
      return await apiClient.get(`/common-service/colors`)
    } catch (error) {
      console.error(error)
    }
  },

  getNotifications: async (params) => {
    try {
      return await apiClient.get('/inventory/notifications')
    } catch (error) {
      console.error(error)
    }
  },
  clearNotifications: async (id) => {
    try {
      return await apiClient.patch(`/inventory/notifications/${id}`, { status: 'dismissed' })
    } catch (error) {
      console.error(error)
    }
  },
  throwAlert: async (id) => {
    try {
      return await apiClient.post(`/inventory/alert/`, { item_id: id })
    } catch (error) {
      console.error(error)
    }
  },
}
