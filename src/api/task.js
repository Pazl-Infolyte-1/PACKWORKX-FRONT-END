import { apiClient } from './config'

export const taskApi = {
getTaskData: async ({ page = 1, limit = 10, search = '' } = {}) => {
  try {
    return await apiClient.get(`/work-order?search=${search}&page=${page}&limit=${limit}`);
  } catch (error) {
    console.error('Error fetching task data:', error.response?.data || error.message);
    throw error;
  }
},
    groupStatusUpdate: async (id, body) => {
    const response = await apiClient.patch(`/work-order/status/${id}`, body)
    return response
  },

}
