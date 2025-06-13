import { apiClient } from './config'

export const SettingsApi = {
  getTemplates: async () => {
    const response = await apiClient.get('/purchase-order/templates/rendered')
    return response
  },

  useTemplate: async (id) => {
    return await apiClient.get(`/purchase-order/activate/${id}`)
  },
}
