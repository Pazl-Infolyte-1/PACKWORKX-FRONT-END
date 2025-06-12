
import { apiClient } from './config'

export const productionApi = {

    getRouteById: async (id) => {
    try {
      return await apiClient.get(`/mapping/route/${id}`)
    } catch (error) {
      console.error(error)
    }
  },

}


