

import { apiClient } from './config'

export const landingApi = {

addTrail: async (body) => {
  try {
    return await apiClient.post(`/companies`, body);
  } catch (error) {
    console.error("API error in addTrail:", error);
    throw error; // preserves original error object
  }
},

addDemo: async (body) => {
  try {
    return await apiClient.post(`/common-service/demo-request`, body);
  } catch (error) {
    console.error("API error in demo:", error);
    throw error; // preserves original error object
  }
},

setPasswordForEmail: async (body) => {
  try {
    return await apiClient.post(`/common-service/forgot-password`, body);
  } catch (error) {
    console.error("API error in demo:", error);
    throw error; // preserves original error object
  }
},

resetPassword: async (body) => {
  try {
    return await apiClient.post(`/common-service/reset-password`, body);
  } catch (error) {
    console.error("API error in demo:", error);
    throw error; // preserves original error object
  }
},

createContacts: async (body) => {
  try {
    return await apiClient.post(`/common-service/contact-message`, body);
  } catch (error) {
    console.error("API error in demo:", error);
    throw error; // preserves original error object
  }
},
displayPricing: async () => {
  try {
    return await apiClient.get(`/common-service/packages`);
  } catch (error) {
    console.error("API error in demo:", error);
    throw error; // preserves original error object
  }
}
}
