import { commonApi } from "../../api/common";
import { reportsApi } from "../../api/reports";
import CommonReportLayout from "./CommonReportLayout";



const PurchaseReturnReport = () => {
 return <CommonReportLayout
  purchaseOrderDropdownApi={commonApi.getPurchaseOrderDropdown}
     clientDropdownApi={commonApi.getClientsDropdown}
 reportTitle="GRN Report"
  fetchReportsApi={reportsApi.getGrnReports} 
	exportReports={reportsApi.exportGrnReports} 
  />;
};

export default PurchaseReturnReport;