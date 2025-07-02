import { reportsApi } from "../../api/reports";
import CommonReportLayout from "./CommonReportLayout";



const RoutesReport = () => {
 return <CommonReportLayout
 reportTitle="Routes Report"
  fetchReportsApi={reportsApi.getRoutesReports} 
	exportReports={reportsApi.exportRoutesReports} 
  />;
};

export default RoutesReport;