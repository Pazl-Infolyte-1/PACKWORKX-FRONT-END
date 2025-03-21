import axios from 'axios'

const BASE_URL = 'https://packworkx.pazl.info/api/'
const GST_URL = "http://sheet.gstincheck.co.in/check/9ee24120971acd5c17dc6cad239d99fa"

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
    console.log('Interceptor token:', token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('Authorization header set:', config.headers.Authorization)
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

export const apiMethods = {
  login: async (credentials) => {
    console.log('credentials', credentials)
    try {
      const response = await apiClient.post('/user/login', credentials, {
        headers: {
          'x-api-key':
            '4b3e77f648e5b9055a45f0812b3a4c3b88b08ff10b2f34ec21d11b6f678b6876a4014c88ff2a3c7e8e934c4f4790a94d3acb28d2f78a9b90f18960feaf3e4f99',
        },
      })

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }

      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  getSideBarMenu: async (params) => {
    try {
      const token = localStorage.getItem('token')
      console.log('object', token)
      const response = await apiClient.get(
        'https://mocki.io/v1/06927d0e-012b-4ace-8c82-e5519674a3c0',
        { params },
      )
      return response.data
    } catch (error) {
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

  editClient: async (clientId,clientData) => {
    try {
      const token = localStorage.getItem('token') // Retrieve token before sending request
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
    try {
      const token = localStorage.getItem("token"); // Retrieve token
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }
  
      const response = await apiClient.get("/clients", {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
        params: queryParams, // Attach query params (optional)
      });
  
      return response.data;
    } catch (error) {
      console.error("Error fetching clients:", error.response?.data || error.message);
      throw error;
    }
  },
  
  deleteClient: async (clientId) => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token before sending request
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }
  
      const response = await apiClient.delete(`/clients/${clientId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error deleting client:', error.response?.data || error.message);
      throw error;
    }
  },
  
  getGst: async (gstNumber) => {
    try {
      if (!gstNumber) {
        throw new Error("GST number is required");
      }
  
      const response = await axios.get(`${GST_URL}/${gstNumber}`);
  
      return response.data;
    } catch (error) {
      console.error("Error fetching GST details:", error.response?.data || error.message);
      throw error;
    }
  },

  downloadClientExcel: async (queryParams = {}) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }
  
      const response = await apiClient.get("/clients/download/excel", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: queryParams,
        responseType: "blob", // <-- Important! Treat response as binary data
      });
  
      return response.data;
    } catch (error) {
      console.error("Error downloading clients:", error.response?.data || error.message);
      throw error;
    }
  }  
}

export default apiMethods
