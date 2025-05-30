import axios from 'axios'
import { API_BASE_URL } from './constant'

const BASE_URL = API_BASE_URL
const GST_URL = 'http://sheet.gstincheck.co.in/check/9ee24120971acd5c17dc6cad239d99fa'
// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  },
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

// Request interceptor
// apiClient.interceptors.request.use(
//   async (config) => {
//     try {
//       // Fetch the token from SQL.js database
//       const token = await getToken()

//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`
//       }
//     } catch (error) {
//       console.error('Error fetching token from DB:', error)
//     }
//     return config
//   },
//   (error) => {
//     console.error('Request interceptor error:', error)
//     return Promise.reject(error)
//   },
// )

// // Response interceptor
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       try {
//         // Clear the token from SQL.js if unauthorized
//         const { deleteToken } = await import('../db/tokenService')
//         await deleteToken()

//         // Redirect to the login page
//         window.location.href = '/login'
//       } catch (dbError) {
//         console.error('Error clearing token from DB:', dbError)
//       }
//     }
//     return Promise.reject(error)
//   },
// )

export const apiMethods = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/user/login', credentials, {
        headers: {
          'x-api-key':
            '4b3e77f648e5b9055a45f0812b3a4c3b88b08ff10b2f34ec21d11b6f678b6876a4014c88ff2a3c7e8e934c4f4790a94d3acb28d2f78a9b90f18960feaf3e4f99',
        },
      })

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        // await saveToken(response.data.token)
      }

      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  //getSideBarMenu: async (params) => {
  //  try {
  //    const token = localStorage.getItem('token')
  //    console.log('object', token)
  //    const response = await apiClient.get(
  //      'https://mocki.io/v1/711cbc7d-a070-4077-bf97-8c1369fa075f',
  //      { params },
  //    )
  //    return response.data
  //  } catch (error) {
  //    throw error
  //  }
  //},

  getSideBarMenu: async (queryParams = {}) => {
    try {
      const token = localStorage.getItem('token') // Retrieve token
      // const token = await getToken()
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }
      const response = await apiClient.get('/rbac', {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
        params: queryParams, // Attach query params (optional)
      })
      return response.data
    } catch (error) {
      console.error('Error fetching clients:', error.response?.data || error.message)
      throw error
    }
  },

  getFormFields: async (id) => {
    try {
      const response = await apiClient.get(`/form-fields/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
  //companies
  getCompanies: async (queryParams = {}, singleId) => {
    console.log('api id', singleId)
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('No token found. Please log in again.')
      }

      // If singleId exists, append it to the endpoint, otherwise, use "/companies"
      const url = singleId ? `/companies/${singleId}` : '/companies'

      const response = await apiClient.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: queryParams, // Pass query parameters if needed
      })

      return response.data
    } catch (error) {
      console.error('Error fetching companies:', error.response?.data || error.message)
      throw error
    }
  },

  createCompany: async (companyData) => {
    try {
      const token = localStorage.getItem('token') // Retrieve token before sending request
      // const token = await getToken()
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }
      const response = await apiClient.post('/companies', companyData, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      })
      return response.data
    } catch (error) {
      console.error('Error posting client:', error.response?.data || error.message)
      throw error
    }
  },
  updateCompany: async (companyId, companyData) => {
    console.log(companyId, 'client124')
    try {
      const token = localStorage.getItem('token') // Retrieve token before sending request
      // const token = await getToken()
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }
      const response = await apiClient.put(`/companies/${companyId}`, companyData, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      })
      return response.data
    } catch (error) {
      console.error('Error posting client:', error.response?.data || error.message)
      throw error
    }
  },
  deleteCompany: async (companyId) => {
    try {
      const token = localStorage.getItem('token') // Retrieve token before sending request
      // const token = await getToken()

      if (!token) {
        throw new Error('No token found. Please log in again.')
      }

      const response = await apiClient.delete(`/companies/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      })
      return response.data
    } catch (error) {
      console.error('Error deleting company:', error.response?.data || error.message)
      throw error
    }
  },
  getClientOrVendors: async () => {
    try {
      const response = await apiClient.get(
        'https://mocki.io/v1/10d77686-3679-4445-89db-9da5fe60eb4a',
      )
      return response.data
    } catch (error) {
      console.error('Error in getClientOrVendors:', error)
      throw error
    }
  },

  formatDate: async (isoString) => {
    try {
      const date = new Date(isoString)
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch (error) {
      console.error('Error in formatDate:', error)
      throw error
    }
  },

  postClient: async (clientData) => {
    try {
      const token = localStorage.getItem('token') // Retrieve token before sending request
      // const token = await getToken()
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }

      const response = await apiClient.post('/clients', clientData, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      })

      return response.data
    } catch (error) {
      console.error('Error posting client:', error.response?.data || error.message)
      throw error
    }
  },
  editClient: async (clientId, clientData) => {
    console.log(clientId, 'client124')
    try {
      const token = localStorage.getItem('token') // Retrieve token before sending request
      // const token = await getToken()
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }

      const response = await apiClient.put(`/clients/${clientId}`, clientData, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      })

      return response.data
    } catch (error) {
      console.error('Error posting client:', error.response?.data || error.message)
      throw error
    }
  },
  getClients: async (queryParams = {}) => {
    console.log(queryParams)
    try {
      const token = localStorage.getItem('token') // Retrieve token
      // const token = await getToken()

      if (!token) {
        throw new Error('No token found. Please log in again.')
      }
      const response = await apiClient.get('/clients', {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
        params: queryParams, // Attach query params (optional)
      })
      return response.data
    } catch (error) {
      console.error('Error fetching clients:', error.response?.data || error.message)
      throw error
    }
  },
  deleteClient: async (clientId) => {
    try {
      const token = localStorage.getItem('token') // Retrieve token before sending request
      // const token = await getToken()

      if (!token) {
        throw new Error('No token found. Please log in again.')
      }
      const response = await apiClient.delete(`/clients/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      })
      return response.data
    } catch (error) {
      console.error('Error deleting client:', error.response?.data || error.message)
      throw error
    }
  },
  //getGst: async (gstNumber) => {
  //  try {
  //    if (!gstNumber) {
  //      throw new Error('GST number is required')
  //    }

  //    const response = await axios.get(`${GST_URL}/${gstNumber}`)

  //    return response.data
  //  } catch (error) {
  //    console.error('Error fetching GST details:',error.response?.data || error.message)
  //    throw error
  //  }
  //},

  getGst: async (gstNumber) => {
    try {
      const token = localStorage.getItem('token') // Retrieve token before sending request

      if (!token) {
        throw new Error('No token found. Please log in again.')
      }

      const response = await apiClient.post(
        '/clients/check-gst',
        { gst_number: gstNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token
          },
        },
      )

      return response.data
    } catch (error) {
      console.error('Error fetching GST details:', error.response?.data || error.message)
      throw error
    }
  },

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
          search: params.search || '',
          client: params.client || '',
          sku_type: params.sku_type || '',
          page: params.page || 1,
          limit: params.limit || 10,
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
      throw error // ← this is important for proper error handling
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

  downloadClientExcel: async (queryParams = {}) => {
    try {
      const token = localStorage.getItem('token')
      // const token = await getToken()
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }
      const response = await apiClient.get('/clients/download/excel', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: queryParams,
        responseType: 'blob', // <-- Important! Treat response as binary data
      })
      return response.data
    } catch (error) {
      console.error('Error downloading clients:', error.response?.data || error.message)
      throw error
    }
  },

  singleclients: async (id) => {
    try {
      const response = await apiClient.get(`/clients/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  },

  singlesku: async (id) => {
    try {
      const response = await apiClient.get(`/sku-details/${id}`)
      return response.data
    } catch (error) {
      console.error('API error in singlesku:', error)
      throw error // Optional: rethrow for handling at the call site
    }
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
  getCountries: async () => {
    try {
      return await apiClient.get(`/common-service/countries`)
    } catch (error) {
      console.error(error)
    }
  },
  getCompanyAddress: async () => {
    try {
      return await apiClient.get(`/companies-address`)
    } catch (error) {
      console.error(error)
    }
  },
  getDepartmentsList: async () => {
    try {
      return await apiClient.get(`/departments`)
    } catch (error) {
      console.error(error)
    }
  },
  getDesignation: async () => {
    try {
      return await apiClient.get(`/designations`)
    } catch (error) {
      console.error(error)
    }
  },
  uploadFile: async (file) => {
    try {
      return await apiClient.post('/file/upload', file, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    } catch (error) {
      console.error(error)
    }
  },
  createNewEmployee: async (employeeForm) => {
    // try {
    return await apiClient.post('/user/register', employeeForm)
    // } catch (error) {
    // console.error(error)
    // }
  },
  GetEmployeelist: async (params) => {
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

  DeleteEmployee: async (id) => {
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
  getPackages: async (params) => {
    try {
      return await apiClient.get('/packages', { params })
    } catch (error) {
      console.error(error)
    }
  },

  AddPacakges: async (payload) => {
    try {
      return await apiClient.post('/packages/create', payload)
    } catch (error) {
      console.error(error)
    }
  },

  UpdatePacakges: async (id, payload) => {
    try {
      return await apiClient.put(`/packages/update/${id}`, payload)
    } catch (error) {
      console.error(error)
    }
  },

  DeletePacakges: async (id) => {
    try {
      return await apiClient.delete(`/packages/delete/${id}`)
    } catch (error) {
      console.error(error)
    }
  },

  getCurrency: async () => {
    try {
      return await apiClient.get('/common-service/currency')
    } catch (error) {
      console.error(error)
    }
  },

  getModule: async () => {
    try {
      return await apiClient.get('/common-service/module')
    } catch (error) {
      console.error(error)
    }
  },

  getWorkOrders: async (params) => {
    try {
      return await apiClient.get('/work-order', { params })
    } catch (error) {
      console.error(error)
    }
  },

  getProcess: async (params) => {
    try {
      return await apiClient.get('/machines/process', { params })
    } catch (error) {
      console.error(error)
    }
  },
  getByMachineId: async (id) => {
    return await apiClient.get(`machines/assign/machine/${id}`)
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

  getRoute: async (params) => {
    try {
      return await apiClient.get('/mapping/route', { params })
    } catch (error) {
      console.error(error)
    }
  },

  AddRoute: async (formData) => {
    try {
      return await apiClient.post('/mapping/route', formData)
    } catch (error) {
      console.error(error)
    }
  },

  EditRoute: async (formData) => {
    try {
      return await apiClient.put(`/mapping/route/${formData.id}`, formData)
    } catch (error) {
      console.error(error)
    }
  },

  DeleteRoute: async (id) => {
    try {
      return await apiClient.delete(`/mapping/route/${id}`)
    } catch (error) {
      console.error(error)
    }
  },

  getRouteById: async (id) => {
    try {
      return await apiClient.get(`/mapping/route/${id}`)
    } catch (error) {
      console.error(error)
    }
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

  getDies: async (params) => {
    try {
      return await apiClient.get('/common-service/die', { params })
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

  updateDie: async (id, formData) => {
    try {
      return await apiClient.put(`/common-service/die/update/${id}`, formData)
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

  getSalesOrderList: async (params = {}) => {
    try {
      return await apiClient.get('/sale-order', {
        params: {
          client: params.client || '',
          sku: params.sku || '',
          manufacture: params.manufacture || '',
          sales_status: params.sales_status || '',
          page: params.page || 1,
          limit: params.limit || 25,
        },
      })
    } catch (error) {
      console.error('Error fetching sales orders:', error.response?.data || error.message)
      throw error
    }
  },

  DeleteSalesOrder: async (id) => {
    const response = await apiClient.delete(`/sale-order/${id}`)
    return response
  },

  getSaleOrderData: async (id) => {
    const response = await apiClient.get(`/sale-order/${id}`)
    return response
  },

  addSalesOrder: async (body) => {
    const response = await apiClient.post(`/sale-order`, body)
    return response
  },

  editSalesOrder: async (id, body) => {
    const response = await apiClient.put(`/sale-order/${id}`, body)
    return response
  },

  getSkuVersions: async (id) => {
    const response = await apiClient.get(`/sku-details/sku-version/sku/${id}`)
    return response
  },

  getFluteType: async () => {
    try {
      return await apiClient.get('/common-service/flute')
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
  },

  addFlute: async (formData) => {
    try {
      return await apiClient.post('/common-service/flute/create', formData)
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
  getColors: async () => {
    try {
      return await apiClient.get(`/common-service/colors`)
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
  getProcessDetails: async (id) => {
    try {
      return await apiClient.get(`/machines/process-values/${id}`)
    } catch (error) {
      console.error(error)
    }
  },
  getSingleSkuData: async (id) => {
    const response = await apiClient.get(`/sku-details/${id}`)
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
  createWorkOrder: async (body) => {
    const response = await apiClient.post(`/work-order`, body)
    return response
  },
  getWorkOrderById: async (id) => {
    const response = await apiClient.get(`/work-order/${id}`)
    return response
  },
  workOrderStatusUpdate: async (id, body) => {
    const response = await apiClient.put(`/work-order/status/${id}`, body)
    return response
  },
  editWorkOrder: async (id, body) => {
    const response = await apiClient.put(`/work-order/${id}`, body)
    return response
  },

  deleteWorkOrder: async (id) => {
    const response = await apiClient.delete(`/work-order/${id}`)
    return response
  },
  updateSalesOrderStatus: async (id, body) => {
    const response = await apiClient.patch(`/sale-order/${id}/status`, body)
    return response
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

  getDesignationList: async () => {
    const response = await apiClient.get(`/designations`)
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
    const response = await apiClient.post(`/designations`, body)
    return response
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
    const response = await apiClient.post(`/departments`, body)
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
      return await apiClient.get(`/role`)
    } catch (error) {
      console.error(error)
    }
  },

  //
  //items

  getItemList: async (params = {}) => {
    try {
      return await apiClient.get('/items', {
        params: {
          search: params.search || '',

          sales_status: params.sales_status || '',

          page: params.page || 1,

          limit: params.limit || 10,
        },
      })
    } catch (error) {
      console.error('Error fetching items:', error.response?.data || error.message)

      throw error
    }
  },

  getItemData: async (id) => {
    return await apiClient.get(`/items/${id}`)
  },
  getCategoryList: async () => {
    return await apiClient.get(`/category`)
  },

  getSubCategory: async () => {
    return await apiClient.get(`/sub-category`)
  },

  addItem: async (body) => {
    return await apiClient.post(`/items`, body)
  },

  updateItem: async (id, body) => {
    return await apiClient.put(`/items/${id}`, body)
  },

  deleteItem: async (id) => {
    return await apiClient.delete(`/items/delete/${id}`)
  },

  // po-order

  getPurchaseOrders: async (params = {}) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('No token found. Please log in again.')
      }

      const response = await apiClient.get('/purchase-order', {
        headers: {
          Authorization: `Bearer ${token}`,
        },

        params: {
          status: params.status || 'active',

          page: params.page || 1,

          limit: params.limit || 10,

          client: params.client || '',

          search: params.search || '',
        },
      })

      const transformedData = response.data.data.map((po) => ({
        ...po,

        items: po.PurchaseOrderItems || [], // Map PurchaseOrderItems to items
      }))

      return {
        success: response.data.success,

        message: response.data.message,

        data: transformedData,

        totalCount: response.data.totalCount,
      }
    } catch (error) {
      console.error('Error fetching purchase orders:', error.response?.data || error.message)

      throw error
    }
  },

  getAllPurchaseOrderIds: async () => {
   return await apiClient.get('/purchase-orders/ids')
  },

  // Get a single purchase order by ID

  getPurchaseOrderById: async (id) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('No token found. Please log in again.')
      }

      const response = await apiClient.get(`/purchase-order/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const transformedData = {
        ...response.data.data,

        items: response.data.data.PurchaseOrderItems || [],
      }

      return {
        success: response.data.success,

        message: response.data.message,

        data: transformedData,
      }
    } catch (error) {
      console.error(`Error fetching purchase order ${id}:`, error.response?.data || error.message)

      throw error
    }
  },

  createPurchaseOrder: async (data) => {
    try {
      return await apiClient.post('/purchase-order', data)
    } catch (error) {
      console.error('Error creating purchase order:', error.response?.data || error.message)

      throw error
    }
  },

  updatePurchaseOrder: async (id, data) => {
    try {
      return await apiClient.put(`/purchase-order/${id}`, data)
    } catch (error) {
      console.error(
        `Error updating purchase order ID ${id}:`,
        error.response?.data || error.message,
      )

      throw error
    }
  },

  deletePurchaseOrder: async (id) => {
    try {
      return await apiClient.delete(`/purchase-order/${id}`)
    } catch (error) {
      console.error(
        `Error deleting purchase order ID ${id}:`,
        error.response?.data || error.message,
      )

      throw error
    }
  },

  getPurchaseOrderList: async (params) => {
    try {
      const response = await apiClient.get('/purchase-order', {
        params: {
          search: params.search || '',

          client: params.client || '',

          page: params.page || 1,

          limit: params.limit || 10,
        },
      })

      return response.data
    } catch (error) {
      console.error(error)
    }
  },

  updateMachineStatus: async (id, data) => {
    return await apiClient.patch(`/machines/master/${id}/status`, data)
  },

  getAllAssign: async () => {
    return await apiClient.get('/machines/assign')
  },
  getGrn: async (params) => {
    try {
      return await apiClient.get('/grn', { params })
    } catch (error) {
      console.error(error)
    }
  },

  postGrn: async (payload) => {
    try {
      return await apiClient.post('/grn', payload)
    } catch (error) {
      console.error(error)
    }
  },
  editGrn: async (payload) => {
    try {
      return await apiClient.put(`/grn/${payload.id}`, payload)
    } catch (error) {
      console.error(error)
    }
  },
  deleteGrn: async (id) => {
    try {
      return await apiClient.delete(`/grn/${id}`)
    } catch (error) {
      console.error(error)
    }
  },

  getGrnById: async (id) => {
    try {
      return await apiClient.get(`/grn/${id}`)
    } catch (error) {
      console.error(error)
    }
  },
  // getinventory: async () => {
  //   try {
  //     return await apiClient.get('/inventory')
  //   } catch (error) {
  //     console.error(error)
  //   }
  // },
  getinventory: async () => {
    try {
      return await apiClient.get('/inventory?limit=10000')
    } catch (error) {
      console.error(error)
    }
  },

  getPurchaseReturn: async (params) => {
    try {
      return await apiClient.get('/purchase-order-return', { params })
    } catch (error) {
      console.error(error)
    }
  },

  getDropDown: async () => {
    return await apiClient.get('/common-service/dropdown-name')
  },

  addDropdownName: async (payload) => {
    return await apiClient.post('/common-service/dropdown-name', payload)
  },

  editDropdownName: async (payload) => {
    return await apiClient.put(`/common-service/dropdown-name/${payload.client_id}`, payload)
  },

  deleteDropdownName: async (id) => {
    return await apiClient.delete(`/common-service/dropdown-name/${id}`)
  },

  getDropDownValue: async () => {
    return await apiClient.get('/common-service/dropdown-value')
  },

  addDropDownValue: async (payload) => {
    return await apiClient.post('/common-service/dropdown-value', payload)
  },

  updateDropDownValue: async (payload) => {
    return await apiClient.put(`/common-service/dropdown-value/${payload.id}`, payload)
  },

  deleteDropDownValue: async (id) => {
    return await apiClient.delete(`/common-service/dropdown-value/${id}`)
  },

  getState: async () => {
    return await apiClient.get('/common-service/states')
  },

  getPurchaseOrderDetails: async ({ po_id, grn_id }) => {
    try {
      return await apiClient.get('/purchase-order/details/po', {
        params: {
          po_id,
          grn_id,
        },
      })
    } catch (error) {
      console.error('Error fetching purchase order details:', error.response?.data || error.message)
      throw error
    }
  },

  submitPurchaseOrderReturn: async (payload) => {
    try {
      return await apiClient.post('/purchase-order/return/gst/po', payload)
    } catch (error) {
      console.error('Error submitting PO return:', error.response?.data || error.message)
      throw error
    }
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
  downloadSalesOrder: async () => {
    return await apiClient.get('sale-order/download/excel', {
      responseType: 'blob', // for binary files like Excel
      headers: {
        Accept: 'application/octet-stream',
      },
    })
  },
  downloadWorkOrder: async () => {
    return await apiClient.get('work-order/download/excel', {
      responseType: 'blob', // for binary files like Excel
      headers: {
        Accept: 'application/octet-stream',
      },
    })
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
  deletePoReturn: async (id) => {
    try {
      return await apiClient.delete(`/purchase-order-return/${id}`)
    } catch (error) {
      console.error(error)
    }
  },
  clientStatusSwitch: async (status, clientId) => {
    try {
      return await apiClient.patch(`clients/${clientId}/status`, { status })
    } catch (error) {
      console.error(error)
    }
  },

  createInvoiceWorkOrder: async (body) => {
    try {
      return await apiClient.post(`work-order-invoice/create`, body)
    } catch (error) {
      console.error(error)
    }
  },
  getInvoiceList: async (params) => {
    try {
      return await apiClient.get(`/work-order-invoice/get`, { params })
    } catch (error) {
      console.error(error)
    }
  },
  getInvoiceById: async (id) => {
    try {
      return await apiClient.get(`/work-order-invoice/get/${id}`)
    } catch (error) {
      console.error(error)
    }
  },
  getStockAdjustments: async (page = 1, entries) => {
    try {
      return await apiClient.get(`/stock-adjustments?page=${page}&entries=${entries}`)
    } catch (error) {
      console.error('Error fetching stock adjustments:', error.response?.data || error.message)
      throw error
    }
  },

  deleteStockAdjustment: async (id) => {
    try {
      return await apiClient.delete(`/stock-adjustments/${id}`)
    } catch (error) {
      console.error(error)
    }
  },

  singleStockAdjustment: async (id) => {
    try {
      const response = await apiClient.get(`/stock-adjustments/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  },
  postStockAdjustment: async (payload) => {
    try {
      return await apiClient.post('/stock-adjustments', payload)
    } catch (error) {
      console.error('Error submitting stock adjustment:', error.response?.data || error.message)
      throw error
    }
  },

  updateStockAdjustment: async (id, payload) => {
    try {
      return await apiClient.put(`/stock-adjustments/${id}`, payload)
    } catch (error) {
      console.error('Error updating stock adjustment:', error.response?.data || error.message)
      throw error
    }
  },
  getInvoiceHistory:async(id)=>{
    return await apiClient.get(`/work-order-invoice/get-by-sku/${id}`,)
  }
}

export default apiMethods
