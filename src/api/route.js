
import { apiClient } from './config'

export const routeApi = {
   getRoute: async (params) => {
    try {
      return await apiClient.get('/mapping/route', { params })
    } catch (error) {
      console.error(error)
    }
  },

    EditRoute: async (formData) => {
    try {
      return await apiClient.put(`/mapping/route/${formData.id}`, formData)
    } catch (error) {
      console.error(error)
    }
  },

    AddRoute: async (formData) => {
    try {
      return await apiClient.post('/mapping/route', formData)
    } catch (error) {
      console.error(error)
    }
  },
    DeleteRoute: async (id) => {
    try {
      return await apiClient.delete(`/mapping/route/${id}`)
    } catch (error) {
      console.error(error)
    }
  },
    getRouteById: async (id) => {
    try {
      return await apiClient.get(`/mapping/route/${id}`)
    } catch (error) {
      console.error(error)
    }
  },

}


