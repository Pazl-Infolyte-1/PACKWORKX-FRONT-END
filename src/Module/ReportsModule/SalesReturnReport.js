import { commonApi } from "../../api/common";
import { reportsApi } from "../../api/reports";
import CommonReportLayout from "./CommonReportLayout";



const SalesReturnReport = () => {
 return <CommonReportLayout
 reportTitle="Sales Return Report"
    invoiceDropdownApi={commonApi.getInvoiceDropdown}
   clientDropdownApi={commonApi.getClientsDropdown}
  fetchReportsApi={reportsApi.getSalesReturnReports} 
	exportReports={reportsApi.exportSalesReturnReports} 
  />;
};

export default SalesReturnReport;