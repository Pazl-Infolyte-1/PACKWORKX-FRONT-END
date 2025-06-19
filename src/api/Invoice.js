
import { apiClient } from './config'

export const invoiceApi = {

    getWorkOrdersListByClientId:async(id)=>{
        return apiClient.get(`/work-order/client/${id}/all`)
    },
    createInvoice:async(body)=>{
        return apiClient.post(`/work-order-invoice/create`,body)
    },
    getInvoiceById:async(id)=>{
        return apiClient.get(`work-order-invoice/view/${id}`)
    },
    downloadInvoice:async(id)=>{
        return apiClient.get(`work-order-invoice/download/${id}`,{
            responseType: 'blob', // <-- This is important!
        })
    }

}