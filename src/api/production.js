
import { apiClient } from './config'

export const productionApi = {

  addWorkOrderIntoProduction: async (body) => {
    return await apiClient.patch('/work-order/production/batch', body)
  },
  getWorkOrderInGroup: async () => {
    return await apiClient.get('/work-order/ungrouped-layers')
  },
  getWorkOrderInCreated: async (params) => {
    return await apiClient.get('/work-order?production=created',{params})
  },
  getWorkOrderCreatedInProduction:async (body) => {
    return await apiClient.patch('/work-order?production=created',body)
  },
  removeWorkOrderFromProduction:async (workOrderId,body) => {
    return await apiClient.patch(`/work-order/production/${workOrderId}`, body)
  },
  createGroupInProduction:async (body)=>{
    return await apiClient.post('/production/production-group',body)
  },
  getProductionGroups:async()=>{
    return await apiClient.get('/production/production-group?include_work_orders=true')
  },
  getDeckleOptions:async()=>{
    return await apiClient.get('/items/reels/deckle')
  },
  getColorOptions:async()=>{
    return await apiClient.get('/items/reels/color')
  },
    getGsmOptions:async()=>{
    return await apiClient.get('/items/reels/gsm')
  },
    getBfOptions:async()=>{
    return await apiClient.get('/items/reels/bf')
  },
  getReelsInRawMeterial:async (params)=>{
    return await apiClient.get('/inventory/reels',{params})
  },
  removeWorkOrderFromCreationStageInProduction:async(workorderId,params)=>{
    return await apiClient.patch(`/work-order/production/${workorderId}`,{...params})
  },
  getInventoryHistory:async(id)=>{
    return await apiClient.get(`/production/allocation-history/inventory/${id}`)
  },
  allocateInventoryToGroup:async(body)=>{
    return await apiClient.patch(`/production/production-group/allocate`,body)
  },
  deAllocateInventoryFromGroup:async(body)=>{
    return await apiClient.patch(`/production/production-group/deallocate`,body)
  },
  getSingleGroupDetails:async(id)=>{
    return await apiClient.get(`/production/production-group/${id}/allocations`)
  }
}


