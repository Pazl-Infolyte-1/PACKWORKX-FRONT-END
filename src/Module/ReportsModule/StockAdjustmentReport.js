import { commonApi } from "../../api/common";
import { reportsApi } from "../../api/reports";
import CommonReportLayout from "./CommonReportLayout";



const StockAdjustmentReport = () => {
 return <CommonReportLayout
 reportTitle="Stock Adjustment Report"
  fetchReportsApi={reportsApi.getStockAdjustmentReports} 
	exportReports={reportsApi.exportStockAdjustmentReports} 
  />;
};

export default StockAdjustmentReport;