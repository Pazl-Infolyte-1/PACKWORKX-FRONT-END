import { commonApi } from "../../api/common";
import { reportsApi } from "../../api/reports";
import CommonReportLayout from "./CommonReportLayout";



const CreditNoteReport = () => {
 return <CommonReportLayout
     invoiceDropdownApi={commonApi.getInvoiceDropdown}
   clientDropdownApi={commonApi.getClientsDropdown}
 reportTitle="Credit Note Report"
  fetchReportsApi={reportsApi.getCreditNoteReports} 
	exportReports={reportsApi.exportCreditNoteReports} 
  />;
};

export default CreditNoteReport;