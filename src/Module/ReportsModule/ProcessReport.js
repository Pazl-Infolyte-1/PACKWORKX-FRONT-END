import { reportsApi } from "../../api/reports";
import CommonReportLayout from "./CommonReportLayout";



const ProcessReport = () => {
 return <CommonReportLayout
 reportTitle="Process Report"
  fetchReportsApi={reportsApi.getProcessReports} 
	exportReports={reportsApi.exportProcessReports} 
  />;
};

export default ProcessReport;