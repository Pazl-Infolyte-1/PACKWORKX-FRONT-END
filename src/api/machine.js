import { apiClient } from './config'

export const machineApi = {
  getMachine: async (params) => {
    try {
      return await apiClient.get('/machines/master/get', { params })
    } catch (error) {
      console.error(error)
    }
  },

  getMachineById: async (id) => {
    try {
      return await apiClient.get(`/machines/master/get/${id}`)
    } catch (error) {
      console.error(error)
    }
  },

  AddMachine: async (data) => {
    return await apiClient.post('/machines/master/create', data)
  },

  editMachine: async (id, data) => {
    return await apiClient.put(`/machines/master/update/${id}`, data)
  },

  deleteMachine: async (id) => {
    return await apiClient.delete(`/machines/master/delete/${id}`)
  },
  updateMachineStatus: async (id, data) => {
    return await apiClient.patch(`/machines/master/${id}/status`, data)
  },
  getProcess: async (params) => {
    try {
      return await apiClient.get('/machines/process', { params })
    } catch (error) {
      console.error(error)
    }
  },
    getProcessValues: async () => {
    try {
      return await apiClient.get('/machines/process-values')
    } catch (error) {
      console.error(error)
    }
  },
  getAllAssign: async () => {
    return await apiClient.get('/machines/assign')
  },

  getMachineRoute: async () => {
    return await apiClient.get('mapping/machine-route-process')
  },

  saveRouteProcesses: async (payload) => {
    return await apiClient.post('mapping/machine-route-process', payload)
  },

  updateRouteProcesses: async (id, payload) => {
    return await apiClient.put(`mapping/machine-route-process/${id}`, payload)
  },

  deleteRoute: async (id) => {
    return await apiClient.delete(`mapping/machine-route-process/${id}`)
  },
  getRouteList: async (params) => {
    try {
      const response = await apiClient.get('/mapping/route', {
        params: {
          search: params.search || '',
          page: params.page || 1,
          limit: params.limit || 10,
        },
      })
      return response
    } catch (error) {
      console.error(error)
    }
  },
    getByMachineId: async (id) => {
    return await apiClient.get(`machines/assign/machine/${id}`)
  },  
  getAllFileds: async () => {
    try {
      return await apiClient.get('/machines/process-fields')
    } catch (error) {
      console.error(error)
    }
  },
  getAllFiledsById: async (id) => {
    try {
      return await apiClient.get(`/machines/process/${id}/fields`)
    } catch (error) {
      console.error(error)
    }
  },
  getProcessFields: async (id) => {
    try {
      return await apiClient.get(`/machines/process/${id}/fields`)
    } catch (error) {
      console.error(error)
    }
  },

  saveProcessValues: async (payload) => {
    try {
      return await apiClient.post('/machines/process-values', payload)
    } catch (error) {
      console.error(error)
    }
  },

  updateProcessValues: async (payload) => {
    try {
      return await apiClient.put(`/machines/process-values/${payload.id}`, payload)
    } catch (error) {
      console.error(error)
    }
  },

  addFields: async (payload) => {
    try {
      return await apiClient.post('/machines/process-fields', payload)
    } catch (error) {
      console.error(error)
    }
  },
  updateField: async (payload) => {
    try {
      return await apiClient.put(`/machines/process-fields/${payload.id}`, payload)
    } catch (error) {
      console.error(error)
    }
  },
  deleteField: async (id) => {
    try {
      return await apiClient.delete(`/machines/process-fields/${id}`)
    } catch (error) {
      console.error(error)
    }
  },
    assignMachineProcess: async (payload) => {
    return await apiClient.post('/machines/assign', payload)
  },
  updateAssignMachine: async (payload, Id) => {
    return await apiClient.put(`/machines/assign/${Id}`, payload)
  },
    deleteAssignMachine: async (id) => {
    return await apiClient.delete(`/machines/assign/${id}`)
  },
  AddProcess: async (formData) => {
    return await apiClient.post('/machines/process', formData)
  },
  EditProcess: async (formData) => {
    try {
      return await apiClient.put(`/machines/process/${formData.id}`, formData)
    } catch (error) {
      console.error(error)
    }
  },

  deleteProcess: async (id) => {
    return await apiClient.delete(`/machines/process/${id}`)
  },
    getProcessDetails: async (id) => {
    try {
      return await apiClient.get(`/machines/process-values/${id}`)
    } catch (error) {
      console.error(error)
    }
  },
}
