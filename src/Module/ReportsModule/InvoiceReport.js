import { commonApi } from "../../api/common";
import { reportsApi } from "../../api/reports";
import CommonReportLayout from "./CommonReportLayout";



const InvoiceReport = () => {
 return <CommonReportLayout
 reportTitle="Invoice Report"
 
  fetchReportsApi={reportsApi.getInvoiceReports}
	exportReports={reportsApi.exportInvoiceReports} 
  />;
};

export default InvoiceReport;