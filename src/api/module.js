import { apiClient } from './config'

export const moduleApi = {
  getModules: async () => {
    const response = await apiClient.get('/modules')
    return response
  },
}
