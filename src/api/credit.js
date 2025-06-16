import { apiClient } from './config'
export const creditApi = {
  getCreditNotes: async (params) => {
    return await apiClient.get('/credit-note/get-all', { params })
  },
  getCreditNotesById: async (id) => {
    return await apiClient.get(`/credit-note/get-by-id/${id}`)
  },
  AddCreditNote: async (payload) => {
    return await apiClient.post('/credit-note/create', payload)
  },
  UpdateCreditNote: async (payload, id) => {
    return await apiClient.put(`/credit-note/update/${id}`, payload)
  },
  deleteCreditNote: async (id) => {
    return await apiClient.delete(`/credit-note/delete/${id}`)
  },
  updateCreditNoteStatus: async (id) => {
    return await apiClient.patch(`/credit-note/${id}/restore`)
  },

}
