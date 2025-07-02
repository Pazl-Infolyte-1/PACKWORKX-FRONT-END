import { commonApi } from "../../api/common";
import { reportsApi } from "../../api/reports";
import CommonReportLayout from "./CommonReportLayout";



const BillReport = () => {
 return <CommonReportLayout
 reportTitle="Bills Report"
  fetchReportsApi={reportsApi.getBillReports} 
	exportReports={reportsApi.exportBillReports} 
  />;
};

export default BillReport;