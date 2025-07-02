import { commonApi } from "../../api/common";
import { reportsApi } from "../../api/reports";
import CommonReportLayout from "./CommonReportLayout";



const SkuReport = () => {
 return <CommonReportLayout
 reportTitle="SKU Report"
  clientDropdownApi={commonApi.getClientsDropdown}
  fetchReportsApi={reportsApi.getSkuReports} 
	exportReports={reportsApi.exportSkuReports} 
  />;
};

export default SkuReport;