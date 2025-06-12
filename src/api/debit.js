import { apiClient } from './config'

export const debitApi = {
  getDebitNotes: async (search, page, limits) => {
    try {
      return 'success'
    } catch (error) {
      console.error(error)
    }
  },
  editDebitNote: async (id) => {
    try {
      return 'success'
    } catch (error) {
      console.error(error)
    }
  },
  postDebitNote: async (id) => {
    try {
      return 'success'
    } catch (error) {
      console.error(error)
    }
  },
  getAllPurchaseReturnIds: async (search, page, limits) => {
    try {
      return 'success'
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

  deleteDebitNote: async (id) => {
    try {
      return 'success'
    } catch (error) {
      console.error(error)
    }
  },
  getDebitNoteById: async (id) => {
    try {
      return 'success'
    } catch (error) {
      console.error(error)
    }
  },
}
