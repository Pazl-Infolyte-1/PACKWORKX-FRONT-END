import { commonApi } from "../../api/common";
import { reportsApi } from "../../api/reports";
import CommonReportLayout from "./CommonReportLayout";



const SalesOrderReport = () => {
 return <CommonReportLayout
 reportTitle="Sales Order Report"
 clientDropdownApi={commonApi.getClientsDropdown}
  fetchReportsApi={reportsApi.getSalesOrderReports} 
	exportReports={reportsApi.exportSalesOrderReports} 
  />;
};

export default SalesOrderReport;