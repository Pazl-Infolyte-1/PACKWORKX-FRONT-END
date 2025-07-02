
import { apiClient } from './config'

export const reportsApi = {
 getClientReports: async (page = 1, entries = 20, filters = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: entries.toString()
      });

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      return await apiClient.get(`/report/clients?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching:', error.response?.data || error.message);
      throw error;
    }
  },
  exportClientReports: async (filters = {}) => {
    try {
      // Build query parameters with export parameter
      const params = new URLSearchParams();

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Add export parameter
      params.append('export', 'excel');

      return await apiClient.get(`/report/clients?${params.toString()}`, {
        responseType: 'blob' // Important for file downloads
      });
    } catch (error) {
      console.error('Error exporting:', error.response?.data || error.message);
      throw error;
    }
  },


//  machine

 getMachineReports: async (page = 1, entries = 20, filters = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: entries.toString()
      });

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      return await apiClient.get(`/report/machines?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching:', error.response?.data || error.message);
      throw error;
    }
  },
  exportMachineReports: async (filters = {}) => {
    try {
      // Build query parameters with export parameter
      const params = new URLSearchParams();

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Add export parameter
      params.append('export', 'excel');

      return await apiClient.get(`/report/machines?${params.toString()}`, {
        responseType: 'blob' // Important for file downloads
      });
    } catch (error) {
      console.error('Error exporting:', error.response?.data || error.message);
      throw error;
    }
  },

  //process

   getProcessReports: async (page = 1, entries = 20, filters = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: entries.toString()
      });

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      return await apiClient.get(`/report/processes?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching:', error.response?.data || error.message);
      throw error;
    }
  },
  exportProcessReports: async (filters = {}) => {
    try {
      // Build query parameters with export parameter
      const params = new URLSearchParams();

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Add export parameter
      params.append('export', 'excel');

      return await apiClient.get(`/report/processes?${params.toString()}`, {
        responseType: 'blob' // Important for file downloads
      });
    } catch (error) {
      console.error('Error exporting:', error.response?.data || error.message);
      throw error;
    }
  },

    //routes

   getRoutesReports: async (page = 1, entries = 20, filters = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: entries.toString()
      });

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      return await apiClient.get(`/report/routes?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching:', error.response?.data || error.message);
      throw error;
    }
  },
  exportRoutesReports: async (filters = {}) => {
    try {
      // Build query parameters with export parameter
      const params = new URLSearchParams();

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Add export parameter
      params.append('export', 'excel');

      return await apiClient.get(`/report/routes?${params.toString()}`, {
        responseType: 'blob' // Important for file downloads
      });
    } catch (error) {
      console.error('Error exporting:', error.response?.data || error.message);
      throw error;
    }
  },

  //sales-order

     getSalesOrderReports: async (page = 1, entries = 20, filters = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: entries.toString()
      });

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
        if (filters.client_id) {
        params.append('client_id', filters.client_id);
      }
      if (filters.sales_status) {
        params.append('sales_status', filters.sales_status);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      return await apiClient.get(`/report/sales-orders?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching:', error.response?.data || error.message);
      throw error;
    }
  },
  exportSalesOrderReports: async (filters = {}) => {
    try {
      // Build query parameters with export parameter
      const params = new URLSearchParams();

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
         if (filters.client_id) {
        params.append('client_id', filters.client_id);
      }
      if (filters.sales_status) {
        params.append('sales_status', filters.sales_status);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Add export parameter
      params.append('export', 'excel');

      return await apiClient.get(`/report/sales-orders?${params.toString()}`, {
        responseType: 'blob' // Important for file downloads
      });
    } catch (error) {
      console.error('Error exporting:', error.response?.data || error.message);
      throw error;
    }
  },

   //WORK-order

     getWorkOrderReports: async (page = 1, entries = 20, filters = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: entries.toString()
      });

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.progress) {
        params.append('progress', filters.progress);
      }
       if (filters.sales_order_id) {
        params.append('sales_order_id', filters.sales_order_id);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      return await apiClient.get(`/report/work-orders?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching:', error.response?.data || error.message);
      throw error;
    }
  },
  exportWorkOrderReports: async (filters = {}) => {
    try {
      // Build query parameters with export parameter
      const params = new URLSearchParams();

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.progress) {
        params.append('progress', filters.progress);
      }
       if (filters.sales_order_id) {
        params.append('sales_order_id', filters.sales_order_id);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Add export parameter
      params.append('export', 'excel');

      return await apiClient.get(`/report/work-orders?${params.toString()}`, {
        responseType: 'blob' // Important for file downloads
      });
    } catch (error) {
      console.error('Error exporting:', error.response?.data || error.message);
      throw error;
    }
  },

  //SKU DETAILS

  
     getSkuReports: async (page = 1, entries = 20, filters = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: entries.toString()
      });

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.status) {
        params.append('status', filters.status);
      }
         if (filters.client_id) {
        params.append('client_id', filters.client_id);
      }  if (filters.sku_type_id) {
        params.append('sku_type_id', filters.sku_type_id);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      return await apiClient.get(`/report/sku-details?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching:', error.response?.data || error.message);
      throw error;
    }
  },
  exportSkuReports: async (filters = {}) => {
    try {
      // Build query parameters with export parameter
      const params = new URLSearchParams();

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
     if (filters.status) {
        params.append('status', filters.status);
      }
         if (filters.client_id) {
        params.append('client_id', filters.client_id);
      }  if (filters.sku_type_id) {
        params.append('sku_type_id', filters.sku_type_id);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Add export parameter
      params.append('export', 'excel');

      return await apiClient.get(`/report/sku-details?${params.toString()}`, {
        responseType: 'blob' // Important for file downloads
      });
    } catch (error) {
      console.error('Error exporting:', error.response?.data || error.message);
      throw error;
    }
  },

  //purchase Order
    //SKU DETAILS

  
     getPurchaseOrderReports: async (page = 1, entries = 20, filters = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: entries.toString()
      });

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.po_status) {
        params.append('po_status', filters.po_status);
      }
       if (filters.payment_status) {
        params.append('payment_status', filters.payment_status);
      }
         if (filters.vendor_id) {
        params.append('vendor_id', filters.vendor_id);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      return await apiClient.get(`/report/purchase-orders?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching:', error.response?.data || error.message);
      throw error;
    }
  },
  exportPurchaseOrderReports: async (filters = {}) => {
    try {
      // Build query parameters with export parameter
      const params = new URLSearchParams();

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
  if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.po_status) {
        params.append('po_status', filters.po_status);
      }
       if (filters.payment_status) {
        params.append('payment_status', filters.payment_status);
      }
         if (filters.vendor_id) {
        params.append('vendor_id', filters.vendor_id);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Add export parameter
      params.append('export', 'excel');

      return await apiClient.get(`/report/purchase-orders?${params.toString()}`, {
        responseType: 'blob' // Important for file downloads
      });
    } catch (error) {
      console.error('Error exporting:', error.response?.data || error.message);
      throw error;
    }
  },

  
  //inventory
     getInventoryReports: async (page = 1, entries = 20, filters = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: entries.toString()
      });

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.stock_status) {
        params.append('stock_status', filters.stock_status);
      }
        if (filters.category) {
        params.append('category', filters.category);
      }
             if (filters.subCategory) {
        params.append('subCategory', filters.subCategory);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      return await apiClient.get(`/report/inventory?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching:', error.response?.data || error.message);
      throw error;
    }
  },
  exportInventoryReports: async (filters = {}) => {
    try {
      // Build query parameters with export parameter
      const params = new URLSearchParams();

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
     if (filters.stock_status) {
        params.append('stock_status', filters.stock_status);
      }
        if (filters.category) {
        params.append('category', filters.category);
      }
             if (filters.subCategory) {
        params.append('subCategory', filters.subCategory);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Add export parameter
      params.append('export', 'excel');

      return await apiClient.get(`/report/inventory?${params.toString()}`, {
        responseType: 'blob' // Important for file downloads
      });
    } catch (error) {
      console.error('Error exporting:', error.response?.data || error.message);
      throw error;
    }
  },

  //sales return
      getSalesReturnReports: async (page = 1, entries = 20, filters = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: entries.toString()
      });

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.invoice) {
        params.append('invoice', filters.invoice);
      }
       if (filters.client_id) {
        params.append('client_id', filters.client_id);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      return await apiClient.get(`/report/sales-returns?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching:', error.response?.data || error.message);
      throw error;
    }
  },
  exportSalesReturnReports: async (filters = {}) => {
    try {
      // Build query parameters with export parameter
      const params = new URLSearchParams();

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.invoice) {
        params.append('invoice', filters.invoice);
      }
           if (filters.client_id) {
        params.append('client_id', filters.client_id);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Add export parameter
      params.append('export', 'excel');

      return await apiClient.get(`/report/sales-returns?${params.toString()}`, {
        responseType: 'blob' // Important for file downloads
      });
    } catch (error) {
      console.error('Error exporting:', error.response?.data || error.message);
      throw error;
    }
  },

  //grn

    getGrnReports: async (page = 1, entries = 20, filters = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: entries.toString()
      });

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.vendor_id) {
        params.append('vendor_id', filters.vendor_id);
      }
         if (filters.po_id) {
        params.append('po_id', filters.po_id);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      return await apiClient.get(`/report/grn?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching:', error.response?.data || error.message);
      throw error;
    }
  },
  exportGrnReports: async (filters = {}) => {
    try {
      // Build query parameters with export parameter
      const params = new URLSearchParams();

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
    if (filters.vendor_id) {
        params.append('vendor_id', filters.vendor_id);
      }
         if (filters.po_id) {
        params.append('po_id', filters.po_id);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Add export parameter
      params.append('export', 'excel');

      return await apiClient.get(`/report/grn?${params.toString()}`, {
        responseType: 'blob' // Important for file downloads
      });
    } catch (error) {
      console.error('Error exporting:', error.response?.data || error.message);
      throw error;
    }
  },

  //invoice
  
    getInvoiceReports: async (page = 1, entries = 20, filters = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: entries.toString()
      });

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.status_wo) {
        params.append('status_wo', filters.status_wo);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      return await apiClient.get(`/report/grn?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching:', error.response?.data || error.message);
      throw error;
    }
  },
  exportInvoiceReports: async (filters = {}) => {
    try {
      // Build query parameters with export parameter
      const params = new URLSearchParams();

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.status_wo) {
        params.append('status_wo', filters.status_wo);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Add export parameter
      params.append('export', 'excel');

      return await apiClient.get(`/report/grn?${params.toString()}`, {
        responseType: 'blob' // Important for file downloads
      });
    } catch (error) {
      console.error('Error exporting:', error.response?.data || error.message);
      throw error;
    }
  },

  //creditnote
  
    getCreditNoteReports: async (page = 1, entries = 20, filters = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: entries.toString()
      });

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
       if (filters.client_id) {
        params.append('client_id', filters.client_id);
      }
           if (filters.invoice) {
        params.append('invoice', filters.invoice);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      return await apiClient.get(`/report/credit-notes?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching:', error.response?.data || error.message);
      throw error;
    }
  },
  exportCreditNoteReports: async (filters = {}) => {
    try {
      // Build query parameters with export parameter
      const params = new URLSearchParams();

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.client_id) {
        params.append('client_id', filters.client_id);
      }
           if (filters.invoice) {
        params.append('invoice', filters.invoice);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Add export parameter
      params.append('export', 'excel');

      return await apiClient.get(`/report/credit-notes?${params.toString()}`, {
        responseType: 'blob' // Important for file downloads
      });
    } catch (error) {
      console.error('Error exporting:', error.response?.data || error.message);
      throw error;
    }
  },

  // debit note
    getDebitNoteReports: async (page = 1, entries = 20, filters = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: entries.toString()
      });

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.status_wo) {
        params.append('status_wo', filters.status_wo);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      return await apiClient.get(`/report/debit-notes?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching:', error.response?.data || error.message);
      throw error;
    }
  },
  exportDebitNoteReports: async (filters = {}) => {
    try {
      // Build query parameters with export parameter
      const params = new URLSearchParams();

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.status_wo) {
        params.append('status_wo', filters.status_wo);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Add export parameter
      params.append('export', 'excel');

      return await apiClient.get(`/report/debit-notes?${params.toString()}`, {
        responseType: 'blob' // Important for file downloads
      });
    } catch (error) {
      console.error('Error exporting:', error.response?.data || error.message);
      throw error;
    }
  },

  //stock adjustment
   getStockAdjustmentReports: async (page = 1, entries = 20, filters = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: entries.toString()
      });

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.status_wo) {
        params.append('status_wo', filters.status_wo);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      return await apiClient.get(`/report/stock-adjustments?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching:', error.response?.data || error.message);
      throw error;
    }
  },
  exportStockAdjustmentReports: async (filters = {}) => {
    try {
      // Build query parameters with export parameter
      const params = new URLSearchParams();

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.status_wo) {
        params.append('status_wo', filters.status_wo);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Add export parameter
      params.append('export', 'excel');

      return await apiClient.get(`/report/stock-adjustments?${params.toString()}`, {
        responseType: 'blob' // Important for file downloads
      });
    } catch (error) {
      console.error('Error exporting:', error.response?.data || error.message);
      throw error;
    }
  },

  //bills

   getBillReports: async (page = 1, entries = 20, filters = {}) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: entries.toString()
      });

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.status_wo) {
        params.append('status_wo', filters.status_wo);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      return await apiClient.get(`/report/bills?${params.toString()}`);
    } catch (error) {
      console.error('Error fetching:', error.response?.data || error.message);
      throw error;
    }
  },
  exportBillReports: async (filters = {}) => {
    try {
      // Build query parameters with export parameter
      const params = new URLSearchParams();

      // Add filter parameters if they exist
      if (filters.entity_type) {
        params.append('entity_type', filters.entity_type);
      }
      if (filters.fromDate) {
        params.append('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params.append('toDate', filters.toDate);
      }
      if (filters.status_wo) {
        params.append('status_wo', filters.status_wo);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Add export parameter
      params.append('export', 'excel');

      return await apiClient.get(`/report/bills?${params.toString()}`, {
        responseType: 'blob' // Important for file downloads
      });
    } catch (error) {
      console.error('Error exporting:', error.response?.data || error.message);
      throw error;
    }
  },



}   