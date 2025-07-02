import { commonApi } from "../../api/common";
import { reportsApi } from "../../api/reports";
import CommonReportLayout from "./CommonReportLayout";



const DebitNoteReport = () => {
 return <CommonReportLayout
 reportTitle="Debit Note Report"
  fetchReportsApi={reportsApi.getDebitNoteReports} 
	exportReports={reportsApi.exportDebitNoteReports} 
  />;
};

export default DebitNoteReport;