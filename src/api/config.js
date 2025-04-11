import axios from 'axios'

const BASE_URL = 'https://packworkx.pazl.info/api/'
const GST_URL = 'http://sheet.gstincheck.co.in/check/9ee24120971acd5c17dc6cad239d99fa'
// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
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
    console.error('Request interceptor error:',error)
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
      const response = await apiClient.post('/user/login',credentials,{
        headers: {
          'x-api-key':
            '4b3e77f648e5b9055a45f0812b3a4c3b88b08ff10b2f34ec21d11b6f678b6876a4014c88ff2a3c7e8e934c4f4790a94d3acb28d2f78a9b90f18960feaf3e4f99',
        },
      })

      if (response.data.token) {
        localStorage.setItem('token',response.data.token)
        // await saveToken(response.data.token)
      }

      return response.data
    } catch (error) {
      console.error('Login error:',error)
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
      const response = await apiClient.get('/rbac',{
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
        params: queryParams, // Attach query params (optional)
      })
      return response.data
    } catch (error) {
      console.error('Error fetching clients:',error.response?.data || error.message)
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
    console.log("api id", singleId);
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }
  
      // If singleId exists, append it to the endpoint, otherwise, use "/companies"
      const url = singleId ? `/companies/${singleId}` : '/companies';
  
      const response = await apiClient.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: queryParams, // Pass query parameters if needed
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error.response?.data || error.message);
      throw error;
    }
  },
  
  createCompany: async (companyData) => {
    try {
      const token = localStorage.getItem('token') // Retrieve token before sending request
      // const token = await getToken()
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }
      const response = await apiClient.post('/companies',companyData,{
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      })
      return response.data
    } catch (error) {
      console.error('Error posting client:',error.response?.data || error.message)
      throw error
    }
  },
  updateCompany: async (companyId,companyData) => {
    console.log(companyId,'client124')
    try {
      const token = localStorage.getItem('token') // Retrieve token before sending request
      // const token = await getToken()
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }
      const response = await apiClient.put(`/companies/${companyId}`,companyData,{
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      })
      return response.data
    } catch (error) {
      console.error('Error posting client:',error.response?.data || error.message)
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

      const response = await apiClient.delete(`/companies/${companyId}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      })
      return response.data
    } catch (error) {
      console.error('Error deleting company:',error.response?.data || error.message)
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
      console.error('Error in getClientOrVendors:',error)
      throw error
    }
  },

  formatDate: async (isoString) => {
    try {
      const date = new Date(isoString)
      return date.toLocaleDateString('en-GB',{
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch (error) {
      console.error('Error in formatDate:',error)
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

      const response = await apiClient.post('/clients',clientData,{
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      })

      return response.data
    } catch (error) {
      console.error('Error posting client:',error.response?.data || error.message)
      throw error
    }
  },
  editClient: async (clientId,clientData) => {
    console.log(clientId,'client124')
    try {
      const token = localStorage.getItem('token') // Retrieve token before sending request
      // const token = await getToken()
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }

      const response = await apiClient.put(`/clients/${clientId}`,clientData,{
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      })

      return response.data
    } catch (error) {
      console.error('Error posting client:',error.response?.data || error.message)
      throw error
    }
  },
  getClients: async (queryParams = {}) => {
    try {
      const token = localStorage.getItem('token') // Retrieve token
      // const token = await getToken()

      if (!token) {
        throw new Error('No token found. Please log in again.')
      }
      const response = await apiClient.get('/clients',{
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
        params: queryParams, // Attach query params (optional)
      })
      return response.data
    } catch (error) {
      console.error('Error fetching clients:',error.response?.data || error.message)
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
      const response = await apiClient.delete(`/clients/${clientId}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      })
      return response.data
    } catch (error) {
      console.error('Error deleting client:',error.response?.data || error.message)
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
      const token = localStorage.getItem("token"); // Retrieve token before sending request
  
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }
  
      const response = await apiClient.post(
        "/clients/check-gst",
        { gst_number: gstNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error("Error fetching GST details:", error.response?.data || error.message);
      throw error;
    }
  },
  
  addSku: async (addNewSkuData) => {
    try {
      const response = await apiClient.post('/sku-details',addNewSkuData,{})
      return response
    } catch (error) {
      console.error(error)
    }
  },

  getSkuList: async (params) => {
    try {
      const response = await apiClient.get('/sku-details',{
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
    const { id,...dataWithoutId } = addNewSkuData
      const response = await apiClient.put(`/sku-details/${addNewSkuData.id}`,dataWithoutId)
      return response
  },

  deleteSku: async (id) => {
    try {
      const response = await apiClient.delete(`/sku-details/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
    }
  },

  downloadClientExcel: async (queryParams = {}) => {
    try {
      const token = localStorage.getItem('token')
      // const token = await getToken()
      if (!token) {
        throw new Error('No token found. Please log in again.')
      }
      const response = await apiClient.get('/clients/download/excel',{
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: queryParams,
        responseType: 'blob', // <-- Important! Treat response as binary data
      })
      return response.data
    } catch (error) {
      console.error('Error downloading clients:',error.response?.data || error.message)
      throw error
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
  getRoles: async () => {
    try {
      return await apiClient.get(`/role`)
    } catch (error) {
      console.error(error)
    }
  },
  uploadFile: async (file) => {
    try {
      return await apiClient.post('/file/upload',file,{
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    } catch (error) {
      console.error(error)
    }
  },
  createNewEmployee: async (employeeForm) => {
    // try {
      return await apiClient.post('/user/register',employeeForm)
    // } catch (error) {
      // console.error(error)
    // }
  },
  GetEmployeelist: async (params) => {
    try {
      const response = await apiClient.get('/user/employees',{
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search || '', 
          department:params.department,
          role:params.role,
          reportingManager:params.reportingManager,
          status:params.status
        },
      })
      return response
    } catch (error) {
      console.error(error)
    }
  },
  getSkuExcelExport: async (params) => {
    try {
      const response = await apiClient.get('/sku-details/download/excel',{
        responseType:'blob',
        params
      })

      const blob = new Blob([response.data],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download','SKU Details.xlsx')
      document.body.appendChild(link)
      link.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } catch (error) {
      console.error(error);
      
    }
  },

   DeleteEmployee: async (id) => {
    try {
      return await apiClient.delete(`/user/employees/${id}`)
    } catch (error) {
      console.error(error)
    }
  },
  editEmployee:async(id,body)=>{
    try {

      return await apiClient.put(`/user/employees/${id}`,body)

    } catch (error) {
      console.error(error)
    }
  },
  getEmployeeData:async(id)=>{
    try {
      return await apiClient.get(`/user/employees/${id}`)
    } catch (error) {
      console.error(error)
    }
  },
  getSkuListOptions: async () => {
    try {
      const response = await apiClient.get('/sku-details',{
      })
      return response.data
    } catch (error) {
      console.error(error)
    }
  },
  getPackages: async (params) => {
    try {
      return await apiClient.get('/packages', {params})
    } catch (error) {
      console.error(error)
    }
  },

  AddPacakges: async (payload) => {
    try {
      return await apiClient.post('/packages/create',payload)
    } catch (error) {
      console.error(error)
    }
  },
  
  UpdatePacakges: async (id,payload) => {
    try {
      return await apiClient.put(`/packages/update/${id}`,payload)
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
      return await apiClient.get('/work-order', {params})
    } catch (error) {
      console.error(error)
    }
  },

  getProcess: async (params) => {
    try {
      return await apiClient.get('/machines/process',{params})
    } catch (error) {
      console.error(error);
    }
  },

  AddProcess: async (formData) => {
      return await apiClient.post('/machines/process', formData)
  },
  EditProcess : async (formData) => {
    try {
      return await apiClient.put(`/machines/process/${formData.id}`, formData)
    } catch (error) {
      console.error(error);
    }
  },

  deleteProcess : async (id) => {
    try {
      return await apiClient.delete(`/machines/process/${id}`)
    } catch (error) {
      console.error(error);
      
    }
  },
  getAllFileds : async () => {
    try {
      return await apiClient.get('/machines/process-fields')
    } catch (error) {
      console.error(error);
      
    }
  },
  getProcessFields: async (id) => {
    try {
      return await apiClient.get(`/machines/process/${id}/fields` )
    } catch (error) {
      console.error(error);
      
    }
  },

  saveProcessValues: async (payload) => {
    try {
      return await apiClient.post('/machines/process-values', payload)
    } catch (error) {
      console.error(error);
      
    }
  },

  addFields: async (payload) => {
    try {
      return await apiClient.post('/machines/process-fields', payload)
    } catch (error) {
      console.error(error);
      
    }
  },


  getDies: async (params) => {
    try {
      return await apiClient.get('/common-service/die', {params})
    } catch (error) {
      console.error(error)
    }
  },
  getSalesOrderList: async (params = {}) => {
    console.log(params,'fasdfa')
    try {
      return await apiClient.get('/sale-order', {
        params: {
          client: params.client || '',
          sku: params.sku || '',
          manufacture: params.manufacture || '',
          sales_status: params.sales_status || '',
          page: params.page || 1,
          limit: params.limit || 25
        }
      })
    } catch (error) {
      console.error('Error fetching sales orders:', error.response?.data || error.message)
      throw error
    }
  },

  DeleteSalesOrder : async (id)=>{
    const response = await apiClient.delete(`/sale-order/${id}`)
    return response
  },

  getSaleOrderData: async (id) => {
    const response = await apiClient.get(`/sale-order/${id}`)
    return response
  },

  addSalesOrder: async (body) => {
    const response = await apiClient.post(`/sale-order`,body)
    return response
  },

  editSalesOrder:async(id,body)=>{
    const response = await apiClient.put(`/sale-order/${id}`,body)
    return response
  },

  getSkuVersions:async(id)=>{
    const response = await apiClient.get(`/sku-details/sku-version/sku/${id}`)
    return response
  },

  getSingleSkuData:async(id)=>{
    const response = await apiClient.get(`/sku-details/${id}`);
    return response
  },
  addSkuVersion:async(body)=>{
    const response = await apiClient.post(`/sku-details/sku-version`,body);
    return response
  }



}


export default apiMethods


