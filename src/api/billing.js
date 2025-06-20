import { apiClient } from './config'

export const billingApi = {
getBilling: async (page = 1, limit = 10,search) => {
  try {
    return await apiClient.get('/purchase-order/bill-get', {
      params: { page, limit,search },
    })
  } catch (error) {
    console.error(error)
    throw error
  }
},
getBillById: async (id) => {
  try {
    return await apiClient.get(`/purchase-order/bill-get/${id}`)
  } catch (error) {
    console.error('Error fetching bill by ID:', error.response?.data || error.message)
    throw error
  }
},
  createBill: async (data) => {
  try {
    return await apiClient.post(`/purchase-order/bill-create/`, data)
  } catch (error) {
    console.error('Error creating bill:', error.response?.data || error.message)
    throw error
  }
},
deleteBill: async (id) => {
  try {
    return await apiClient.delete(`/purchase-order/bill-delete/${id}`) // <-- fix endpoint
  } catch (error) {
    console.error('Error deleting bill:', error.response?.data || error.message)
    throw error
  }
},
updateBill: async (id, data) => {
  try {
    return await apiClient.put(`/purchase-order/bill-update/${id}`, data)
  } catch (error) {
    console.error('Error updating bill:', error.response?.data || error.message)
    throw error
  }
}


}
