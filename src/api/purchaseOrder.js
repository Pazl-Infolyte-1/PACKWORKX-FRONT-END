import { apiClient } from './config'

export const purchaseOrderApi = {
  getPurchaseOrders: async (params = {}) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('No token found. Please log in again.')
      }

      const response = await apiClient.get('/purchase-order', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          status: params.status || 'active',
          page: params.page || 1,
          limit: params.limit || 10,
          client: params.client || '',
          search: params.search || '',
        },
      })

      const transformedData = response.data.data.map((po) => ({
        ...po,
        items: po.PurchaseOrderItems || [],
      }))

      return {
        success: response.data.success,
        message: response.data.message,
        data: transformedData,
        totalCount: response.data.totalCount,
      }
    } catch (error) {
      console.error('Error fetching purchase orders:', error.response?.data || error.message)
      throw error
    }
  },

  getAllPurchaseOrderIds: async () => {
    return await apiClient.get('/purchase-order/ids')
  },

  getPurchaseOrderById: async (id) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('No token found. Please log in again.')
      }

      const response = await apiClient.get(`/purchase-order/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const transformedData = {
        ...response.data.data,
        items: response.data.data.PurchaseOrderItems || [],
      }

      return {
        success: response.data.success,
        message: response.data.message,
        data: transformedData,
      }
    } catch (error) {
      console.error(`Error fetching purchase order ${id}:`, error.response?.data || error.message)
      throw error
    }
  },

  createPurchaseOrder: async (data) => {
    try {
      return await apiClient.post('/purchase-order', data)
    } catch (error) {
      console.error('Error creating purchase order:', error.response?.data || error.message)
      throw error
    }
  },

  updatePurchaseOrder: async (id, data) => {
    try {
      return await apiClient.put(`/purchase-order/${id}`, data)
    } catch (error) {
      console.error(
        `Error updating purchase order ID ${id}:`,
        error.response?.data || error.message,
      )
      throw error
    }
  },

  deletePurchaseOrder: async (id) => {
    try {
      return await apiClient.delete(`/purchase-order/${id}`)
    } catch (error) {
      console.error(
        `Error deleting purchase order ID ${id}:`,
        error.response?.data || error.message,
      )
      throw error
    }
  },

  getPurchaseOrderList: async (params) => {
    try {
      const response = await apiClient.get('/purchase-order', {
        params: {
          search: params.search || '',
          client: params.client || '',
          page: params.page || 1,
          limit: params.limit || 10,
        },
      })

      return response.data
    } catch (error) {
      console.error(error)
    }
  },

  getPurchaseOrderDropdown: async () => {
    try {
      const response = await apiClient.get('/purchase-order/ids?limit=10000')
      return response.data
    } catch (error) {
      console.error(error)
    }
  },

  getPurchaseOrderDetails: async ({ po_id, grn_id }) => {
    console.log('Fetching purchase order details for PO ID:', po_id, 'and GRN ID:', grn_id)
    try {
      return await apiClient.get('/purchase-order/details/po', {
        params: {
          po_id,
          grn_id,
        },
      })
    } catch (error) {
      console.error('Error fetching purchase order details:', error.response?.data || error.message)
      throw error
    }
  },

  submitPurchaseOrderReturn: async (payload) => {
    try {
      return await apiClient.post('/purchase-order/return/gst/po', payload)
    } catch (error) {
      console.error('Error submitting PO return:', error.response?.data || error.message)
      throw error
    }
  },

  getPurchaseReturn: async (params) => {
    try {
      return await apiClient.get('/purchase-order-return', { params })
    } catch (error) {
      console.error(error)
    }
  },
  getPurchaseReturnById: async (id) => {
    try {
      return await apiClient.get(`/purchase-order-return/${id}`)
    } catch (error) {
      console.error(error)
    }
  },

  deletePoReturn: async (id) => {
    try {
      return await apiClient.delete(`/purchase-order-return/${id}`)
    } catch (error) {
      console.error(error)
    }
  },

  downloadPurchaseOrderPDF: async (id) => {
    return await apiClient.get(`/purchase-order/${id}/download`, {
      responseType: 'blob',
    })
  },
  updatePoRetrun: async (id, val) => {
    try {
      return 'success'
    } catch (error) {
      console.error(error)
    }
  },
  getPOForReturn: async () => {
    try {
      return await apiClient.get('/purchase-order/get/id')
    } catch (error) {
      console.error('Error fetching PO for return:', error.response?.data || error.message)
      throw error
    }
  },
  getGrnByPoId: async (po_id) => {
    try {
      return await apiClient.get(`/purchase-order/grn/${po_id}`)
    } catch (error) {
      console.error('Error fetching GRN by PO ID:', error.response?.data || error.message)
      throw error
    }
  },
  getBillForPO: async () => {
    try {
      return await apiClient.get(`/purchase-order/bill-get`)
    } catch (error) {
      console.error('Error fetching bill for PO:', error.response?.data || error.message)
      throw error
    }
  },
  createPayment: async (payload) => {
    try {
      return await apiClient.post('/purchase-order/payment/details', payload)
    } catch (error) {
      console.error('Error creating purchase order payment:', error.response?.data || error.message)
      throw error
    }
  },
  getPaymentHistory: async (po_id) => {
    try {
      return await apiClient.get(`/purchase-order/payment/details/${po_id}`)
    } catch (error) {
      console.error(
        `Error fetching payment history for PO ID ${po_id}:`,
        error.response?.data || error.message,
      )
      throw error
    }
  },
}
