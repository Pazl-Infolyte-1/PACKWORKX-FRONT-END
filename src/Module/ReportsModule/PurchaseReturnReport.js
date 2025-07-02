import { commonApi } from "../../api/common";
import { reportsApi } from "../../api/reports";
import CommonReportLayout from "./CommonReportLayout";



const PurchaseReturnReport = () => {
 return <CommonReportLayout
 reportTitle="Purchase Return Report"
  fetchReportsApi={reportsApi.getSkuReports} 
	exportReports={reportsApi.exportSkuReports} 
  />;
};

export default PurchaseReturnReport;