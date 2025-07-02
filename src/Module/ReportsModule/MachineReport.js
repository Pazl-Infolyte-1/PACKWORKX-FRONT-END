import { reportsApi } from "../../api/reports";
import CommonReportLayout from "./CommonReportLayout";



const MachineReport = () => {
 return <CommonReportLayout
 reportTitle="Machine Report"
  fetchReportsApi={reportsApi.getMachineReports} 
    exportReports={reportsApi.exportMachineReports} 
  />;
};

export default MachineReport;