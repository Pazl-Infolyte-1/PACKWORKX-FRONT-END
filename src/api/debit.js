import { apiClient } from './config'

export const debitApi = {
  getDebitNotes: async (params) => {
    try {
      return await apiClient.get('/debit-note', { params })
    } catch (error) {
      console.error(error)
    }
  },
  editDebitNote: async (payload, id) => {
    try {
      return await apiClient.put(`/debit-note/${id}`, payload)
    } catch (error) {
      console.error(error)
    }
  },
  postDebitNote: async (debitNoteFormData) => {
    return await apiClient.post('/debit-note', debitNoteFormData)
  },
  getAllPurchaseReturnIds: async () => {
    try {
      return await apiClient.get('/purchase-order/get/id')
    } catch (error) {
      console.error(error)
    }
  },
  getPurchaseReturnById: async (id) => {
    return await apiClient.get(`/purchase-order-return/${id}`)
  },

  deleteDebitNote: async (id) => {
    try {
      return await apiClient.delete(`/debit-note/${id}`)
    } catch (error) {
      console.error(error)
    }
  },
  getDebitNoteById: async (id) => {
    try {
      return await apiClient.get(`/debit-note/${id}`)
    } catch (error) {
      console.error(error)
    }
  },
}
