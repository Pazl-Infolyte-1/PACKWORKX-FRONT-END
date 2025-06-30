import { apiClient } from './config'

export const moduleApi = {
  getModules: async () => {
    const response = await apiClient.get('/data-transfer/history')
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
}
