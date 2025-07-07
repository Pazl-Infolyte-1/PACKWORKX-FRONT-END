import { apiClient } from './config'

export const taskApi = {
  getTaskData: async () => {
    try {
      return await apiClient.get('/work-order?search=&page=1&limit=50')
    } catch (error) {
      console.error('Error submitting stock adjustment:', error.response?.data || error.message)
      throw error
    }
  },
    groupStatusUpdate: async (id, body) => {
    const response = await apiClient.patch(`/work-order/status/${id}`, body)
    return response
  },

}
