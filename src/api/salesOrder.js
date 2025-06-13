import { apiClient } from './config'

export const salesOrderApi = {
  getSalesOrderList: async (params = {}) => {
    try {
      return await apiClient.get('/sale-order', {
        params: {
          search: params.search || '',
          //sales_generate_id:params.sales_generate_id || '',
          //sales_ui_id:params.sales_ui_id || '',
          //sku: params.sku || '',
          //manufacture: params.manufacture || '',
          //sales_status: params.sales_status || '',
          page: params.page || 1,
          limit: params.limit || 25,
        },
      })
    } catch (error) {
      console.error('Error fetching sales orders:', error.response?.data || error.message)
      throw error
    }
  },

  deleteSalesOrder: async (id) => {
    const response = await apiClient.delete(`/sale-order/${id}`)
    return response
  },

  getSaleOrderData: async (id) => {
    const response = await apiClient.get(`/sale-order/${id}`)
    return response
  },

  addSalesOrder: async (body) => {
    const response = await apiClient.post('/sale-order', body)
    return response
  },

  editSalesOrder: async (id, body) => {
    const response = await apiClient.put(`/sale-order/${id}`, body)
    return response
  },

  updateSalesOrderStatus: async (id, body) => {
    const response = await apiClient.patch(`/sale-order/${id}/status`, body)
    return response
  },

  downloadSalesOrder: async () => {
    return await apiClient.get('sale-order/download/excel', {
      responseType: 'blob',
      headers: {
        Accept: 'application/octet-stream',
      },
    })
  },
    DeleteSalesOrder: async (id) => {
    const response = await apiClient.delete(`/sale-order/${id}`)
    return response
  },

}