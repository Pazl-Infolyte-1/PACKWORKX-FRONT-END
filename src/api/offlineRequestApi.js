import { apiClient } from './config'

export const offlineRequestApi = {
  getOfflineRequests: async (params) => {
    return await apiClient.get('/companies/offline-request/get', { params })
  },
  deleteOfflineRequest: async (id) => {
    return await apiClient.delete(`/companies/offline-request/delete/${id}`)
  },
approveStatus: async ({ id, approval_status }) => {
  return await apiClient.put(`/companies/offline-request/${id}/approval`, {
    approval_status,
  })
}

}
