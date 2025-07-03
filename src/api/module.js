import { apiClient } from './config'

export const moduleApi = {
  getModules: async (params) => {
    const response = await apiClient.get('/data-transfer/history',{params})
    return response
  },
  getModuleById: async (id) => {
    const response = await apiClient.get(`/data-transfer/status/${id}`)
    return response
  },
  getDropDownModules: async () => {
    const response = await apiClient.get('/data-transfer/modules')
    return response
  },
  downloadTemplate: async (moduleValue) => {
    const response = await apiClient.get(`/data-transfer/template/${moduleValue}`, {
      responseType: 'blob',
    })
    return response
  },
  uploadModuleData: async (formData) => {
    const response = await apiClient.post('/data-transfer/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response
  },
  getNextStep: async (id) => {
    const response = await apiClient.get(`/data-transfer/preview/${id}`)
    return response
  },
  mapColumns: async (transfer_id, column_mapping) => {
    const response = await apiClient.post(`/data-transfer/map-columns/${transfer_id}`, {
      column_mapping,
    })
    return response
  },

}
