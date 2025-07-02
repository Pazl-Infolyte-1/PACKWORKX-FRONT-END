import { commonApi } from "../../api/common";
import { itemApi } from "../../api/item";
import { reportsApi } from "../../api/reports";
import CommonReportLayout from "./CommonReportLayout";



const InventoryReport = () => {
 return <CommonReportLayout
 reportTitle="Inventory Report"
 categoryListApi={itemApi.getCategoryList}
  subCategoryListApi={itemApi.getSubCategory}
  fetchReportsApi={reportsApi.getInventoryReports} 
	exportReports={reportsApi.exportInventoryReports} 
  />;
};

export default InventoryReport;