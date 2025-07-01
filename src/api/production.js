import { apiClient } from './config'

export const productionApi = {

  addWorkOrderIntoProduction: async (body) => {
    return await apiClient.patch('/work-order/production/batch', body)
  },
  removeWorkOrdersFromProduction: async (body) => {
    return await apiClient.patch('/work-order/production/batch', body)
  },
  getWorkOrderInGroup: async () => {
    return await apiClient.get('/work-order/ungrouped-layers?temporary_status=1')
  },
  getWorkOrderInCreated: async (params) => {
    return await apiClient.get('/work-order?payment_status=except_invoiced',{params})
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
    return await apiClient.get('/production/production-group?include_work_orders=true&temporary_status=1')
  },
   getProductionGroupTable:async(params)=>{
    return await apiClient.get('/production/production-group?include_work_orders=true&temporary_status=0',{params})
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
  },
  removeGroupsFromRawMeterialAllocations:async(body)=>{
    console.log(body)
    return await apiClient.delete('/production/production-groups', { data: body })
  },
  getGroupInRawmeterialByIds:async(ids)=>{
    return await apiClient.post(`/production/production-group/multiple`,{group_ids:ids})
  },
  refreshForNewForm:async()=>{
    return await apiClient.post(`/production/new`)
  },
  finalStatusUpdate:async(body)=>{
    return await apiClient.patch(`/production/production-group/final-status`,body)
  },


}


