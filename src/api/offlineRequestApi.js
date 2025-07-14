import { apiClient } from './config'

export const offlineRequestApi = {
  getOfflineRequests: async (params) => {
    return await apiClient.get('/companies/offline-request/get', { params })
  },
}
