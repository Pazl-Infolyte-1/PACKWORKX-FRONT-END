import { apiClient } from './config'

export const employeeApi = {
  createNewEmployee: async (employeeForm) => {
    return await apiClient.post('/user/register', employeeForm)
  },

  getEmployeeList: async (params) => {
    try {
      const response = await apiClient.get('/user/employees', {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || '',
          department: params.department,
          role: params.role,
          reportingManager: params.reportingManager,
          status: params.status,
        },
      })
      return response
    } catch (error) {
      console.error(error)
    }
  },

  updateEmployeeStatus: async (id, body) => {
    const response = await apiClient.patch(`/user/employees/${id}/status`, body)
    return response
  },

  deleteEmployee: async (id) => {
    try {
      return await apiClient.delete(`/user/employees/${id}`)
    } catch (error) {
      console.error(error)
    }
  },

  editEmployee: async (id, body) => {
    return await apiClient.put(`/user/employees/${id}`, body)
  },

  getEmployeeData: async (id) => {
    try {
      return await apiClient.get(`/user/employees/${id}`)
    } catch (error) {
      console.error(error)
    }
  },

  getDepartmentsList: async () => {
    try {
      return await apiClient.get('/departments')
    } catch (error) {
      console.error(error)
    }
  },

  deleteDepartment: async (id) => {
    const response = await apiClient.delete(`/departments/${id}`)
    return response
  },

  getDepartmentById: async (id) => {
    const response = await apiClient.get(`/departments/${id}`)
    return response
  },

  updateDepartment: async (id, body) => {
    const response = await apiClient.put(`/departments/${id}`, body)
    return response
  },

  postDepartment: async (body) => {
    const response = await apiClient.post('/departments', body)
    return response
  },

  getDesignation: async () => {
    try {
      return await apiClient.get('/designations')
    } catch (error) {
      console.error(error)
    }
  },

  getDesignationList: async () => {
    const response = await apiClient.get('/designations')
    return response
  },

  deleteDesignation: async (id) => {
    const response = await apiClient.delete(`/designations/${id}`)
    return response
  },

  editDesignation: async (id, body) => {
    const response = await apiClient.put(`/designations/${id}`, body)
    return response
  },

  postDesignation: async (body) => {
    const response = await apiClient.post('/designations', body)
    return response
  },

  postRole: async (body) => {
    const response = await apiClient.post('/role', body)
    return response
  },

  getRoleById: async (id) => {
    const response = await apiClient.get(`/role/${id}`)
    return response
  },

  updateRole: async (id, body) => {
    const response = await apiClient.put(`/role/${id}`, body)
    return response
  },

  deleteRole: async (id) => {
    const response = await apiClient.delete(`/role/${id}`)
    return response
  },

  getRoles: async () => {
    try {
      return await apiClient.get('/role')
    } catch (error) {
      console.error(error)
    }
  },
}