import { apiClient } from './config'

export const workOrderApi = {
  getWorkOrders: async (params) => {
    try {
      return await apiClient.get('/work-order', { params })
    } catch (error) {
      console.error(error)
    }
  },

  createWorkOrder: async (body) => {
    const response = await apiClient.post('/work-order', body)
    return response
  },

  getWorkOrderById: async (id) => {
    const response = await apiClient.get(`/work-order/${id}`)
    return response
  },

  workOrderStatusUpdate: async (id, body) => {
    const response = await apiClient.patch(`/work-order/status/${id}`, body)
    return response
  },

  editWorkOrder: async (id, body) => {
    const response = await apiClient.put(`/work-order/${id}`, body)
    return response
  },

  deleteWorkOrder: async (id) => {
    const response = await apiClient.delete(`/work-order/${id}`)
    return response
  },
  addWorkOrderIntoProduction: async (body) => {
    return await apiClient.patch('/work-order/production/batch', body)
  },

  getWorkOrderInProduction: async (body) => {
    return await apiClient.get('/work-order/production=in_production')
  },

  getWorkOrderProgressDropDownOptions: async (id) => {
    return await apiClient.get('/common-service/work-order-status')
  },

   downloadWorkOrder: async () => {
    return await apiClient.get('work-order/download/excel', {
      responseType: 'blob',
      headers: {
        Accept: 'application/octet-stream',
      },
    })
  },
  createInvoiceWorkOrder: async (body) => {
    try {
      return await apiClient.post(`work-order-invoice/create`, body)
    } catch (error) {
      console.error(error)
    }
  },

  getInvoiceList: async (params) => {
    try {
      return await apiClient.get(`/work-order-invoice/get`, { params })
    } catch (error) {
      console.error(error)
    }
  },

  getInvoiceById: async (id, params = {}) => {
    return await apiClient.get(`/work-order-invoice/get/${id}`, { params })
  },

  getInvoiceHistory: async (id) => {
    return await apiClient.get(`/work-order-invoice/get-by-sku/${id}`)
  },

  getInvoice: async (params = {}) => {
    return await apiClient.get(`/work-order-invoice/get`, { params })
  },
}