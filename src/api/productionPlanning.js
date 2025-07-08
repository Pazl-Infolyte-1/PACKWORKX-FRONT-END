import { get } from 'lodash'
import { apiClient } from './config'

export const productionPlanningApi = {
  addProductionPlanning: async (body) => {
    return await apiClient.post('/production-schedule/create', body)
  },
  updateProductionPlanning: async (productionId, body) => {
    return await apiClient.put(`/production-schedule/update/${productionId}`, body)
  },
  getProductionPlanningByDate: async (date) => {
    return await apiClient.get(`/production-schedule/get-all?date=${date}`)
  },
  getProductionPlanningByTimeline: async (params = {}) => {
    return await apiClient.get('/production-schedule/get-all', { params })
  },
  deleteProductionPlanning: async (productionId) => {
    return await apiClient.delete(`/production-schedule/delete/${productionId}`)
  },
}
