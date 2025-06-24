import { apiClient } from './config'

export const skuApi = {
  addSku: async (addNewSkuData) => {
    try {
      const response = await apiClient.post('/sku-details', addNewSkuData, {})
      return response
    } catch (error) {
      console.error('Error in addSku:', error)
      throw error
    }
  },

  getSkuList: async (params) => {
    try {
      const response = await apiClient.get('/sku-details', {
        params: {
          search: params?.search || '',
          client: params?.client || '',
          sku_type: params?.sku_type || '',
          page: params?.page || 1,
          limit: params?.limit || 10,
        },
      })
      return response.data
    } catch (error) {
      console.error(error)
    }
  },

  updateSku: async (addNewSkuData) => {
    const { id, ...dataWithoutId } = addNewSkuData
    try {
      const response = await apiClient.put(`/sku-details/${id}`, dataWithoutId)
      return response
    } catch (error) {
      console.error('Error in updateSku:', error)
      throw error
    }
  },

  deleteSku: async (id) => {
    try {
      const response = await apiClient.delete(`/sku-details/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  singleSku: async (id) => {
    try {
      const response = await apiClient.get(`/sku-details/${id}`)
      return response.data
    } catch (error) {
      console.error('API error in singlesku:', error)
      throw error
    }
  },

  getSingleSkuData: async (id) => {
    const response = await apiClient.get(`/sku-details/${id}`)
    return response
  },

  getSkuType: async () => {
    try {
      const response = await apiClient.get('/sku-details/sku-type/get')
      return response.data
    } catch (error) {
      console.error(error)
    }
  },

  deleteSkuType: async (id) => {
    try {
      return await apiClient.delete(`/sku-details/sku-type/${id}`)
    } catch (error) {
      console.error(error)
    }
  },

  getSkuListOptions: async () => {
    try {
      const response = await apiClient.get('/sku-details', {
        params: { limit: 10000 },
      })
      return response.data
    } catch (error) {
      console.error(error)
    }
  },

  getSkuExcelExport: async (params) => {
    try {
      const response = await apiClient.get('/sku-details/download/excel', {
        responseType: 'blob',
        params,
      })

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'SKU Details.xlsx')
      document.body.appendChild(link)
      link.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } catch (error) {
      console.error(error)
    }
  },

  getSkuVersions: async (id) => {
    const response = await apiClient.get(`/sku-details/sku-version/sku/${id}`)
    return response
  },

  addSkuVersion: async (body) => {
    const response = await apiClient.post(`/sku-details/sku-version`, body)
    return response
  },

  deleteSkuVersion: async (id) => {
    const response = await apiClient.delete(`/sku-details/sku-version/${id}`)
    return response
  },

  getSingleSkuVersion: async (id) => {
    const response = await apiClient.get(`/sku-details/sku-version/${id}`)
    return response
  },

  updateSkuVersion: async (id, body) => {
    const response = await apiClient.put(`/sku-details/sku-version/${id}`, body)
    return response
  },

  getSkuByClientId: async (client_id) => {
    return await apiClient.get(`sku-details/client-sku/${client_id}`)
  },

  postSkuValuesOptions: async (body) => {
    return await apiClient.post(`sku-details/options`, body)
  },

  getSkuValuesOptions: async (id) => {
    return await apiClient.get(`sku-details/${id}/options`)
  },
    getFluteType: async () => {
    try {
      return await apiClient.get('/common-service/flute')
    } catch (error) {
      console.error(error)
    }
  },
  updateDie: async (id, formData) => {
    try {
      return await apiClient.put(`/common-service/die/update/${id}`, formData)
    } catch (error) {
      console.error(error)
    }
  },
  addDie: async (formData) => {
    try {
      return await apiClient.post('/common-service/die/create', formData)
    } catch (error) {
      console.error(error)
    }
  },
    updateFlute: async (id, formData) => {
    try {
      return await apiClient.put(`/common-service/flute/update/${id}`, formData)
    } catch (error) {
      console.error(error)
    }
  },

    addFlute: async (formData) => {
    try {
      return await apiClient.post('/common-service/flute/create', formData)
    } catch (error) {
      console.error(error)
    }
  },
    getDies: async (params) => {
    try {
      return await apiClient.get('/common-service/die', { params })
    } catch (error) {
      console.error(error)
    }
  },
    deleteDie: async (id) => {
    try {
      return await apiClient.delete(`/common-service/die/delete/${id}`)
    } catch (error) {
      console.error(error)
    }
  },
  deleteFlute: async (id) => {
    try {
      return await apiClient.delete(`/common-service/flute/delete/${id}`)
    } catch (error) {
      console.error(error)
    }
  }

}