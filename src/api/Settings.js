import { apiClient } from './config'

export const SettingsApi = {
  getTemplates: async () => {
    const response = await apiClient.get('/purchase-order/templates/rendered')
    return response
  },

  useTemplate: async (id) => {
    return await apiClient.get(`/purchase-order/activate/${id}`)
  },
  getInvoiceTemplates: async () => {
    const response = await apiClient.get('/work-order-invoice/templates/rendered')
    return response
  },
  applyInvoiceTemplate: async (id) => {
    return await apiClient.get(`/work-order-invoice/activate/${id}`)
  },

}
