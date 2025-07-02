import { commonApi } from "../../api/common";
import { reportsApi } from "../../api/reports";
import CommonReportLayout from "./CommonReportLayout";



const PurchaseOrderReport = () => {
 return <CommonReportLayout
 reportTitle="Purchase Order Report"
 supplierApi={commonApi.getSupplierDropdown}
  fetchReportsApi={reportsApi.getPurchaseOrderReports} 
	exportReports={reportsApi.exportPurchaseOrderReports} 
  />;
};

export default PurchaseOrderReport;