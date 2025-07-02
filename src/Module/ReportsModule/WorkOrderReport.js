import { commonApi } from "../../api/common";
import { reportsApi } from "../../api/reports";
import CommonReportLayout from "./CommonReportLayout";



const WorkOrderReport = () => {
 return <CommonReportLayout
 reportTitle="Work Order Report"
 salesOrderDropdownApi={commonApi.getSalesOrderDropdown}
  fetchReportsApi={reportsApi.getWorkOrderReports} 
	exportReports={reportsApi.exportWorkOrderReports} 
  />;
};

export default WorkOrderReport;